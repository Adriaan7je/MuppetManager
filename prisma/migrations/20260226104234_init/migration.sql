-- CreateEnum
CREATE TYPE "SlotType" AS ENUM ('FIRST_XI', 'BENCH', 'RESERVES');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "overall" INTEGER NOT NULL,
    "position" TEXT NOT NULL,
    "alternativePositions" TEXT[],
    "pace" INTEGER NOT NULL DEFAULT 0,
    "shooting" INTEGER NOT NULL DEFAULT 0,
    "passing" INTEGER NOT NULL DEFAULT 0,
    "dribbling" INTEGER NOT NULL DEFAULT 0,
    "defending" INTEGER NOT NULL DEFAULT 0,
    "physical" INTEGER NOT NULL DEFAULT 0,
    "nation" TEXT NOT NULL DEFAULT '',
    "league" TEXT NOT NULL DEFAULT '',
    "team" TEXT NOT NULL DEFAULT '',
    "age" INTEGER NOT NULL DEFAULT 0,
    "height" INTEGER NOT NULL DEFAULT 0,
    "weight" INTEGER NOT NULL DEFAULT 0,
    "preferredFoot" TEXT NOT NULL DEFAULT '',
    "weakFoot" INTEGER NOT NULL DEFAULT 0,
    "skillMoves" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Squad" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "formation" TEXT NOT NULL DEFAULT '4-3-3',
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Squad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SquadPlayer" (
    "id" TEXT NOT NULL,
    "squadId" TEXT NOT NULL,
    "playerId" INTEGER NOT NULL,
    "slotType" "SlotType" NOT NULL,
    "slotIndex" INTEGER NOT NULL,

    CONSTRAINT "SquadPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "firstXIBudget" DOUBLE PRECISION NOT NULL DEFAULT 1000000000,
    "benchBudget" DOUBLE PRECISION NOT NULL DEFAULT 400000000,
    "reservesBudget" DOUBLE PRECISION NOT NULL DEFAULT 100000000,
    "costBase" DOUBLE PRECISION NOT NULL DEFAULT 13723086,
    "costExponent" DOUBLE PRECISION NOT NULL DEFAULT 1.23,
    "costBaseRating" INTEGER NOT NULL DEFAULT 76,

    CONSTRAINT "GameSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "Player_overall_idx" ON "Player"("overall");

-- CreateIndex
CREATE INDEX "Player_position_idx" ON "Player"("position");

-- CreateIndex
CREATE INDEX "Player_name_idx" ON "Player"("name");

-- CreateIndex
CREATE INDEX "Squad_userId_idx" ON "Squad"("userId");

-- CreateIndex
CREATE INDEX "SquadPlayer_squadId_idx" ON "SquadPlayer"("squadId");

-- CreateIndex
CREATE UNIQUE INDEX "SquadPlayer_squadId_slotType_slotIndex_key" ON "SquadPlayer"("squadId", "slotType", "slotIndex");

-- CreateIndex
CREATE UNIQUE INDEX "SquadPlayer_squadId_playerId_key" ON "SquadPlayer"("squadId", "playerId");

-- AddForeignKey
ALTER TABLE "Squad" ADD CONSTRAINT "Squad_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SquadPlayer" ADD CONSTRAINT "SquadPlayer_squadId_fkey" FOREIGN KEY ("squadId") REFERENCES "Squad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SquadPlayer" ADD CONSTRAINT "SquadPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
