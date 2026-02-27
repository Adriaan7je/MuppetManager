"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { calculateCost } from "@/lib/cost";
import { addPlayerSchema, removePlayerSchema, updateFormationSchema, swapSlotsSchema } from "@/lib/validators";
import { assignPlayersToFormation } from "@/lib/formations";
import { revalidatePath } from "next/cache";

async function getAuthUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

async function verifySquadOwnership(squadId: string, userId: string) {
  const squad = await db.squad.findUnique({ where: { id: squadId } });
  if (!squad || squad.userId !== userId) throw new Error("Not your squad");
  return squad;
}

export async function addPlayerToSquad(formData: {
  squadId: string;
  playerId: number;
  slotType: "FIRST_XI" | "BENCH" | "RESERVES";
  slotIndex: number;
}) {
  const userId = await getAuthUser();
  const data = addPlayerSchema.parse(formData);
  await verifySquadOwnership(data.squadId, userId);

  // Check slot limits
  const maxSlots = { FIRST_XI: 11, BENCH: 7, RESERVES: 5 };
  if (data.slotIndex >= maxSlots[data.slotType]) {
    return { error: "Invalid slot index" };
  }

  // Check if player already in squad
  const existing = await db.squadPlayer.findUnique({
    where: { squadId_playerId: { squadId: data.squadId, playerId: data.playerId } },
  });
  if (existing) return { error: "Player already in squad" };

  // Check if slot is occupied
  const slotOccupied = await db.squadPlayer.findUnique({
    where: {
      squadId_slotType_slotIndex: {
        squadId: data.squadId,
        slotType: data.slotType,
        slotIndex: data.slotIndex,
      },
    },
  });
  if (slotOccupied) return { error: "Slot already occupied" };

  // Budget enforcement
  const player = await db.player.findUnique({ where: { id: data.playerId } });
  if (!player) return { error: "Player not found" };

  const settings = await db.gameSettings.findUnique({ where: { id: "singleton" } });
  if (!settings) return { error: "Settings not found" };

  const playerCost = calculateCost(player.overall, {
    base: settings.costBase,
    exponent: settings.costExponent,
    baseRating: settings.costBaseRating,
  });

  // Calculate current spending for the slot type
  const currentPlayers = await db.squadPlayer.findMany({
    where: { squadId: data.squadId, slotType: data.slotType },
    include: { player: true },
  });

  const currentSpent = currentPlayers.reduce(
    (sum, sp) =>
      sum +
      calculateCost(sp.player.overall, {
        base: settings.costBase,
        exponent: settings.costExponent,
        baseRating: settings.costBaseRating,
      }),
    0
  );

  const budgetMap = {
    FIRST_XI: settings.firstXIBudget,
    BENCH: settings.benchBudget,
    RESERVES: settings.reservesBudget,
  };

  if (currentSpent + playerCost > budgetMap[data.slotType]) {
    return { error: "Would exceed budget" };
  }

  await db.squadPlayer.create({
    data: {
      squadId: data.squadId,
      playerId: data.playerId,
      slotType: data.slotType,
      slotIndex: data.slotIndex,
    },
  });

  revalidatePath("/squad");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function removePlayerFromSquad(formData: {
  squadId: string;
  squadPlayerId: string;
}) {
  const userId = await getAuthUser();
  const data = removePlayerSchema.parse(formData);
  await verifySquadOwnership(data.squadId, userId);

  await db.squadPlayer.delete({ where: { id: data.squadPlayerId } });

  revalidatePath("/squad");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateFormation(formData: {
  squadId: string;
  formation: string;
}) {
  const userId = await getAuthUser();
  const data = updateFormationSchema.parse(formData);
  await verifySquadOwnership(data.squadId, userId);

  // Fetch existing First XI players to reassign them
  const existing = await db.squadPlayer.findMany({
    where: { squadId: data.squadId, slotType: "FIRST_XI" },
    include: { player: { select: { id: true, position: true, alternativePositions: true } } },
  });

  if (existing.length === 0) {
    // No players to reassign, just update formation
    await db.squad.update({
      where: { id: data.squadId },
      data: { formation: data.formation },
    });
  } else {
    // Compute best slot assignments for the new formation
    const assignments = assignPlayersToFormation(
      existing.map((sp) => ({
        playerId: sp.playerId,
        position: sp.player.position,
        alternativePositions: sp.player.alternativePositions,
      })),
      data.formation,
    );

    await db.$transaction([
      // Remove old First XI entries
      db.squadPlayer.deleteMany({
        where: { squadId: data.squadId, slotType: "FIRST_XI" },
      }),
      // Re-create with new slot indices
      ...Array.from(assignments.entries()).map(([playerId, slotIndex]) =>
        db.squadPlayer.create({
          data: {
            squadId: data.squadId,
            playerId,
            slotType: "FIRST_XI",
            slotIndex,
          },
        }),
      ),
      // Update formation
      db.squad.update({
        where: { id: data.squadId },
        data: { formation: data.formation },
      }),
    ]);
  }

  revalidatePath("/squad");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function swapSlots(formData: {
  squadId: string;
  fromIndex: number;
  toIndex: number;
}) {
  const userId = await getAuthUser();
  const data = swapSlotsSchema.parse(formData);
  await verifySquadOwnership(data.squadId, userId);

  const fromPlayer = await db.squadPlayer.findUnique({
    where: {
      squadId_slotType_slotIndex: {
        squadId: data.squadId,
        slotType: "FIRST_XI",
        slotIndex: data.fromIndex,
      },
    },
  });

  if (!fromPlayer) return { error: "No player in source slot" };

  const toPlayer = await db.squadPlayer.findUnique({
    where: {
      squadId_slotType_slotIndex: {
        squadId: data.squadId,
        slotType: "FIRST_XI",
        slotIndex: data.toIndex,
      },
    },
  });

  if (toPlayer) {
    // Both slots occupied — delete both and re-create with swapped indices
    await db.$transaction([
      db.squadPlayer.delete({ where: { id: fromPlayer.id } }),
      db.squadPlayer.delete({ where: { id: toPlayer.id } }),
      db.squadPlayer.create({
        data: {
          squadId: data.squadId,
          playerId: fromPlayer.playerId,
          slotType: "FIRST_XI",
          slotIndex: data.toIndex,
        },
      }),
      db.squadPlayer.create({
        data: {
          squadId: data.squadId,
          playerId: toPlayer.playerId,
          slotType: "FIRST_XI",
          slotIndex: data.fromIndex,
        },
      }),
    ]);
  } else {
    // Only source occupied — move to target
    await db.squadPlayer.update({
      where: { id: fromPlayer.id },
      data: { slotIndex: data.toIndex },
    });
  }

  revalidatePath("/squad");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function createSquad(name: string) {
  const userId = await getAuthUser();

  // Only mark as favorite if it's the user's first squad
  const existingCount = await db.squad.count({ where: { userId } });

  const squad = await db.squad.create({
    data: {
      name,
      formation: "4-3-3",
      userId,
      isActive: existingCount === 0,
    },
  });

  revalidatePath("/squad");
  revalidatePath("/dashboard");
  return { success: true, squadId: squad.id };
}

export async function setFavoriteSquad(squadId: string) {
  const userId = await getAuthUser();
  await verifySquadOwnership(squadId, userId);

  await db.squad.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false },
  });

  await db.squad.update({
    where: { id: squadId },
    data: { isActive: true },
  });

  revalidatePath("/squad");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteSquad(squadId: string) {
  const userId = await getAuthUser();
  const squad = await verifySquadOwnership(squadId, userId);
  const wasFavorite = squad.isActive;

  await db.squad.delete({ where: { id: squadId } });

  // If deleted squad was the favorite, promote another
  if (wasFavorite) {
    const next = await db.squad.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    if (next) {
      await db.squad.update({ where: { id: next.id }, data: { isActive: true } });
    }
  }

  revalidatePath("/squad");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function renameSquad(squadId: string, name: string) {
  const userId = await getAuthUser();
  await verifySquadOwnership(squadId, userId);

  if (!name.trim()) return { error: "Name cannot be empty" };

  await db.squad.update({
    where: { id: squadId },
    data: { name: name.trim() },
  });

  revalidatePath("/squad");
  revalidatePath("/dashboard");
  return { success: true };
}
