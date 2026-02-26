import { db } from "./db";
import { auth } from "./auth";
import type { Prisma } from "@prisma/client";

export async function getActiveSquad() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return db.squad.findFirst({
    where: { userId: session.user.id, isActive: true },
    include: {
      players: {
        include: { player: true },
        orderBy: { slotIndex: "asc" },
      },
    },
  });
}

export async function getUserSquads() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return db.squad.findMany({
    where: { userId: session.user.id },
    include: {
      players: {
        include: { player: true },
        orderBy: { slotIndex: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllActiveSquads() {
  return db.squad.findMany({
    where: { isActive: true },
    include: {
      user: { select: { displayName: true, username: true } },
      players: {
        include: { player: true },
        orderBy: { slotIndex: "asc" },
      },
    },
  });
}

export async function getSquadById(id: string) {
  return db.squad.findUnique({
    where: { id },
    include: {
      user: { select: { displayName: true, username: true } },
      players: {
        include: { player: true },
        orderBy: { slotIndex: "asc" },
      },
    },
  });
}

export async function getGameSettings() {
  let settings = await db.gameSettings.findUnique({
    where: { id: "singleton" },
  });
  if (!settings) {
    settings = await db.gameSettings.create({
      data: { id: "singleton" },
    });
  }
  return settings;
}

export async function searchPlayers(params: {
  search?: string;
  position?: string;
  league?: string;
  team?: string;
  minOvr?: number;
  maxOvr?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  const {
    search,
    position,
    league,
    team,
    minOvr,
    maxOvr,
    page = 1,
    pageSize = 20,
    sortBy = "overall",
    sortOrder = "desc",
  } = params;

  const where: Prisma.PlayerWhereInput = {};

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }
  if (position) {
    where.OR = [
      { position },
      { alternativePositions: { has: position } },
    ];
  }
  if (league) {
    where.league = league;
  }
  if (team) {
    where.team = { contains: team, mode: "insensitive" };
  }
  if (minOvr !== undefined || maxOvr !== undefined) {
    const ovrFilter: { gte?: number; lte?: number } = {};
    if (minOvr !== undefined) ovrFilter.gte = minOvr;
    if (maxOvr !== undefined) ovrFilter.lte = maxOvr;
    where.overall = ovrFilter;
  }

  const [players, total] = await Promise.all([
    db.player.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.player.count({ where }),
  ]);

  return { players, total, pages: Math.ceil(total / pageSize) };
}

export async function getFilterOptions() {
  const [positions, leagues] = await Promise.all([
    db.player.findMany({
      select: { position: true },
      distinct: ["position"],
      orderBy: { position: "asc" },
    }),
    db.player.findMany({
      select: { league: true },
      distinct: ["league"],
      orderBy: { league: "asc" },
    }),
  ]);

  return {
    positions: positions.map((p) => p.position),
    leagues: leagues.map((l) => l.league).filter(Boolean),
  };
}
