import { getAllActiveSquads, getGameSettings } from "@/lib/queries";
import { calculateSquadBudgets } from "@/lib/budget";
import { PitchVisualization } from "@/components/pitch-visualization";
import { BudgetBar } from "@/components/budget-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KermitIcon } from "@/components/kermit-icon";
import type { SquadWithPlayers, SquadPlayerWithPlayer } from "@/types";

export default async function DashboardPage() {
  const [squads, settings] = await Promise.all([
    getAllActiveSquads(),
    getGameSettings(),
  ]);

  return (
    <div className="flex flex-col md:h-[calc(100vh-3rem)]">
      <div className="mb-4 shrink-0">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">Dashboard</h1>
        <p className="text-muted-foreground">
          Side-by-side view of all active squads
        </p>
      </div>

      {squads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <KermitIcon className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">No active squads yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-2">
          {squads.map((squad) => {
            const budgets = calculateSquadBudgets(
              squad as unknown as SquadWithPlayers,
              settings
            );
            const benchPlayers = squad.players
              .filter((p) => p.slotType === "BENCH")
              .sort((a, b) => a.slotIndex - b.slotIndex);
            const reservesPlayers = squad.players
              .filter((p) => p.slotType === "RESERVES")
              .sort((a, b) => a.slotIndex - b.slotIndex);

            return (
              <Card key={squad.id} className="flex min-h-0 flex-col overflow-hidden">
                <CardHeader className="shrink-0 pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{squad.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        by {squad.user.displayName}
                      </p>
                    </div>
                    <Badge variant="outline">{squad.formation}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex min-h-0 flex-1 flex-col gap-4 pb-4 sm:flex-row">
                  {/* Left: Pitch */}
                  <div className="min-h-0 min-w-0 flex-1">
                    <PitchVisualization
                      formation={squad.formation}
                      players={squad.players}
                      readOnly
                    />
                  </div>

                  {/* Right: Bench, Reserves, Budgets */}
                  <div className="flex w-full shrink-0 flex-col gap-3 overflow-y-auto sm:w-48">
                    {/* Bench */}
                    <div>
                      <h3 className="mb-1 text-xs font-semibold text-muted-foreground">
                        Bench ({benchPlayers.length}/7)
                      </h3>
                      <div className="space-y-0.5">
                        {Array.from({ length: 7 }).map((_, i) => {
                          const sp = benchPlayers.find((p) => p.slotIndex === i);
                          return (
                            <DashboardPlayerRow
                              key={`bench-${i}`}
                              squadPlayer={sp as SquadPlayerWithPlayer | undefined}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Reserves */}
                    <div>
                      <h3 className="mb-1 text-xs font-semibold text-muted-foreground">
                        Reserves ({reservesPlayers.length}/5)
                      </h3>
                      <div className="space-y-0.5">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const sp = reservesPlayers.find((p) => p.slotIndex === i);
                          return (
                            <DashboardPlayerRow
                              key={`res-${i}`}
                              squadPlayer={sp as SquadPlayerWithPlayer | undefined}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Budgets */}
                    <div className="space-y-2 border-t border-border pt-3">
                      <BudgetBar label="First XI" budget={budgets.firstXI} />
                      <BudgetBar label="Bench" budget={budgets.bench} />
                      <BudgetBar label="Reserves" budget={budgets.reserves} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DashboardPlayerRow({
  squadPlayer,
}: {
  squadPlayer?: SquadPlayerWithPlayer;
}) {
  if (!squadPlayer) {
    return (
      <div className="flex items-center gap-1.5 rounded px-1.5 py-0.5 text-[10px] text-muted-foreground/50">
        <div className="flex h-5 w-5 items-center justify-center rounded bg-secondary text-[9px]">
          —
        </div>
        <span>Empty</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 rounded px-1.5 py-0.5">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">
        {squadPlayer.player.overall}
      </div>
      <span className="min-w-0 truncate text-[11px] font-medium">
        {squadPlayer.player.name.split(" ").pop()}
      </span>
      <Badge variant="outline" className="ml-auto shrink-0 px-1 py-0 text-[8px]">
        {squadPlayer.player.position}
      </Badge>
    </div>
  );
}
