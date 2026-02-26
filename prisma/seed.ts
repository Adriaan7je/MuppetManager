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
      username: "stef",
      passwordHash: passwordHash1,
      displayName: "Stef",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { username: "karsten" },
    update: {},
    create: {
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

  // Seed Players
  let count = 0;
  for (const player of players) {
    await prisma.player.upsert({
      where: { id: player.id },
      update: {
        name: player.name,
        overall: player.overall,
        position: player.position,
        alternativePositions: player.alternativePositions,
        pace: player.pace,
        shooting: player.shooting,
        passing: player.passing,
        dribbling: player.dribbling,
        defending: player.defending,
        physical: player.physical,
        nation: player.nation,
        league: player.league,
        team: player.team,
        age: player.age,
        height: player.height,
        weight: player.weight,
        preferredFoot: player.preferredFoot,
        weakFoot: player.weakFoot,
        skillMoves: player.skillMoves,
        eaId: (player as Record<string, unknown>).eaId as number | undefined ?? null,
      },
      create: {
        id: player.id,
        name: player.name,
        overall: player.overall,
        position: player.position,
        alternativePositions: player.alternativePositions,
        pace: player.pace,
        shooting: player.shooting,
        passing: player.passing,
        dribbling: player.dribbling,
        defending: player.defending,
        physical: player.physical,
        nation: player.nation,
        league: player.league,
        team: player.team,
        age: player.age,
        height: player.height,
        weight: player.weight,
        preferredFoot: player.preferredFoot,
        weakFoot: player.weakFoot,
        skillMoves: player.skillMoves,
        eaId: (player as Record<string, unknown>).eaId as number | undefined ?? null,
      },
    });
    count++;
  }
  console.log(`✅ ${count} players seeded`);

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
