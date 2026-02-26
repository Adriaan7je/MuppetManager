import { calculateCost, type CostParams } from "./cost";
import type { SquadWithPlayers, BudgetInfo, SquadBudgets, GameSettings } from "@/types";

export function calculateBudgetInfo(
  spent: number,
  budget: number
): BudgetInfo {
  return {
    spent,
    budget,
    remaining: budget - spent,
    percentage: budget > 0 ? (spent / budget) * 100 : 0,
  };
}

export function calculateSquadBudgets(
  squad: SquadWithPlayers,
  settings: GameSettings
): SquadBudgets {
  const costParams: CostParams = {
    base: settings.costBase,
    exponent: settings.costExponent,
    baseRating: settings.costBaseRating,
  };

  let firstXISpent = 0;
  let benchSpent = 0;
  let reservesSpent = 0;

  for (const sp of squad.players) {
    const cost = calculateCost(sp.player.overall, costParams);
    switch (sp.slotType) {
      case "FIRST_XI":
        firstXISpent += cost;
        break;
      case "BENCH":
        benchSpent += cost;
        break;
      case "RESERVES":
        reservesSpent += cost;
        break;
    }
  }

  const firstXI = calculateBudgetInfo(firstXISpent, settings.firstXIBudget);
  const bench = calculateBudgetInfo(benchSpent, settings.benchBudget);
  const reserves = calculateBudgetInfo(reservesSpent, settings.reservesBudget);

  const totalSpent = firstXISpent + benchSpent + reservesSpent;
  const totalBudget =
    settings.firstXIBudget + settings.benchBudget + settings.reservesBudget;

  return {
    firstXI,
    bench,
    reserves,
    total: calculateBudgetInfo(totalSpent, totalBudget),
  };
}
