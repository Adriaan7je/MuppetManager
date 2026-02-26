import { notFound } from "next/navigation";
import { getSquadById, getGameSettings } from "@/lib/queries";
import { calculateSquadBudgets } from "@/lib/budget";
import { PitchVisualization } from "@/components/pitch-visualization";
import { BudgetBar } from "@/components/budget-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SquadWithPlayers } from "@/types";

export default async function SquadViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [squad, settings] = await Promise.all([
    getSquadById(id),
    getGameSettings(),
  ]);

  if (!squad) notFound();

  const budgets = calculateSquadBudgets(
    squad as unknown as SquadWithPlayers,
    settings
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">{squad.name}</h1>
          <Badge variant="outline">{squad.formation}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          by {squad.user.displayName}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <BudgetBar label="First XI" budget={budgets.firstXI} />
        <BudgetBar label="Bench" budget={budgets.bench} />
        <BudgetBar label="Reserves" budget={budgets.reserves} />
      </div>

      <div className="max-w-2xl">
        <PitchVisualization
          formation={squad.formation}
          players={squad.players}
          readOnly
        />
      </div>
    </div>
  );
}
