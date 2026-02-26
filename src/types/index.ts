import type { Player, Squad, SquadPlayer, GameSettings, SlotType } from "@prisma/client";

export type { Player, Squad, SquadPlayer, GameSettings, SlotType };

export type SquadWithPlayers = Squad & {
  players: (SquadPlayer & {
    player: Player;
  })[];
};

export type SquadPlayerWithPlayer = SquadPlayer & {
  player: Player;
};

export interface BudgetInfo {
  spent: number;
  budget: number;
  remaining: number;
  percentage: number;
}

export interface SquadBudgets {
  firstXI: BudgetInfo;
  bench: BudgetInfo;
  reserves: BudgetInfo;
  total: BudgetInfo;
}
