import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/cost";
import type { BudgetInfo } from "@/types";

export function BudgetBar({
  label,
  budget,
}: {
  label: string;
  budget: BudgetInfo;
}) {
  const pct = Math.min(budget.percentage, 100);
  const color =
    pct > 90
      ? "bg-red-500"
      : pct > 70
        ? "bg-amber-500"
        : "bg-emerald-500";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {formatCurrency(budget.spent)} / {formatCurrency(budget.budget)}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-right text-xs text-muted-foreground">
        {formatCurrency(budget.remaining)} remaining
      </div>
    </div>
  );
}
