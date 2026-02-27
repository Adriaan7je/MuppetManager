import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import players from "./players.json";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed GameSettings
  await prisma.gameSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      firstXIBudget: 1_000_000_000,
      benchBudget: 400_000_000,
      reservesBudget: 100_000_000,
      costBase: 13_723_086,
      costExponent: 1.23,
      costBaseRating: 76,
    },
  });
  console.log("✅ GameSettings seeded");

  // Seed Users
  const passwordHash1 = await hash("password123", 12);
  const passwordHash2 = await hash("password123", 12);

  const user1 = await prisma.user.upsert({
    where: { username: "stef" },
    update: {},
    create: {
      id: "user-stef",
      username: "stef",
      passwordHash: passwordHash1,
      displayName: "Stef",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { username: "karsten" },
    update: {},
    create: {
      id: "user-karsten",
      username: "karsten",
      passwordHash: passwordHash2,
      displayName: "Karsten",
    },
  });
  console.log("✅ Users seeded:", user1.username, user2.username);

  // Create default squads for each user
  await prisma.squad.upsert({
    where: { id: "default-squad-stef" },
    update: {},
    create: {
      id: "default-squad-stef",
      name: "Stef's Squad",
      formation: "4-3-3",
      userId: user1.id,
      isActive: true,
    },
  });

  await prisma.squad.upsert({
    where: { id: "default-squad-karsten" },
    update: {},
    create: {
      id: "default-squad-karsten",
      name: "Karsten's Squad",
      formation: "4-3-3",
      userId: user2.id,
      isActive: true,
    },
  });
  console.log("✅ Default squads created");

  // Seed Players — clear stale data then bulk insert
  await prisma.squadPlayer.deleteMany();
  await prisma.player.deleteMany();
  console.log("🗑️  Cleared existing players & squad assignments");

  const BATCH = 500;
  for (let i = 0; i < players.length; i += BATCH) {
    const batch = players.slice(i, i + BATCH);
    await prisma.player.createMany({
      data: batch.map((p) => ({
        id: p.id,
        name: p.name,
        overall: p.overall,
        position: p.position,
        alternativePositions: p.alternativePositions,
        pace: p.pace,
        shooting: p.shooting,
        passing: p.passing,
        dribbling: p.dribbling,
        defending: p.defending,
        physical: p.physical,
        nation: p.nation,
        league: p.league,
        team: p.team,
        age: p.age,
        height: p.height,
        weight: p.weight,
        preferredFoot: p.preferredFoot,
        weakFoot: p.weakFoot,
        skillMoves: p.skillMoves,
        eaId: (p as Record<string, unknown>).eaId as number | undefined ?? null,
        imageUrl: (p as Record<string, unknown>).imageUrl as string | undefined ?? "",
        countryCode: (p as Record<string, unknown>).countryCode as string | undefined ?? "",
        clubLogoUrl: (p as Record<string, unknown>).clubLogoUrl as string | undefined ?? "",
        playStyles: (p as Record<string, unknown>).playStyles as string[] | undefined ?? [],
        specialities: (p as Record<string, unknown>).specialities as string[] | undefined ?? [],
      })),
    });
  }
  console.log(`✅ ${players.length} players seeded`);

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
