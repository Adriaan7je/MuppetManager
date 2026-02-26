export interface CostParams {
  base: number;
  exponent: number;
  baseRating: number;
}

export const DEFAULT_COST_PARAMS: CostParams = {
  base: 13_723_086,
  exponent: 1.23,
  baseRating: 76,
};

export function calculateCost(
  overall: number,
  params: CostParams = DEFAULT_COST_PARAMS
): number {
  return Math.round(params.base * Math.pow(params.exponent, overall - params.baseRating));
}

export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `€${(amount / 1_000_000_000).toFixed(2)}B`;
  }
  if (amount >= 1_000_000) {
    return `€${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `€${(amount / 1_000).toFixed(0)}K`;
  }
  return `€${amount.toFixed(0)}`;
}
