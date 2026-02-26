"use client";

import { useState, useTransition } from "react";
import { PitchVisualization } from "@/components/pitch-visualization";
import { BudgetBar } from "@/components/budget-bar";
import { PlayerSearchDialog } from "@/components/player-search-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { FORMATION_NAMES } from "@/lib/formations";
import { calculateCost, formatCurrency, type CostParams } from "@/lib/cost";
import { calculateSquadBudgets } from "@/lib/budget";
import {
  addPlayerToSquad,
  removePlayerFromSquad,
  updateFormation,
  createSquad,
  swapSlots,
} from "@/actions/squad";
import type {
  SquadWithPlayers,
  GameSettings,
  Player,
  SquadPlayerWithPlayer,
} from "@/types";
import type { FormationSlot } from "@/lib/formations";

interface SquadBuilderProps {
  squad: SquadWithPlayers | null;
  settings: GameSettings;
  userId: string;
}

export function SquadBuilder({ squad, settings, userId }: SquadBuilderProps) {
  const [isPending, startTransition] = useTransition();
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    index: number;
    label: string;
    type: "FIRST_XI" | "BENCH" | "RESERVES";
  } | null>(null);

  const costParams: CostParams = {
    base: settings.costBase,
    exponent: settings.costExponent,
    baseRating: settings.costBaseRating,
  };

  if (!squad) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">My Squad</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-muted-foreground">
              You don&apos;t have an active squad yet
            </p>
            <Button
              onClick={() =>
                startTransition(async () => {
                  await createSquad("My Squad");
                })
              }
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Create Squad
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const budgets = calculateSquadBudgets(squad, settings);
  const existingPlayerIds = squad.players.map((sp) => sp.playerId);

  const benchPlayers = squad.players
    .filter((p) => p.slotType === "BENCH")
    .sort((a, b) => a.slotIndex - b.slotIndex);
  const reservesPlayers = squad.players
    .filter((p) => p.slotType === "RESERVES")
    .sort((a, b) => a.slotIndex - b.slotIndex);

  function handleSlotClick(slotIndex: number, slot: FormationSlot) {
    setSelectedSlot({ index: slotIndex, label: slot.label, type: "FIRST_XI" });
    setSearchOpen(true);
  }

  function handleBenchSlotClick(index: number) {
    setSelectedSlot({ index, label: `Bench ${index + 1}`, type: "BENCH" });
    setSearchOpen(true);
  }

  function handleReservesSlotClick(index: number) {
    setSelectedSlot({
      index,
      label: `Reserve ${index + 1}`,
      type: "RESERVES",
    });
    setSearchOpen(true);
  }

  function handleSelectPlayer(player: Player) {
    if (!selectedSlot || !squad) return;
    setSearchOpen(false);
    startTransition(async () => {
      await addPlayerToSquad({
        squadId: squad.id,
        playerId: player.id,
        slotType: selectedSlot.type,
        slotIndex: selectedSlot.index,
      });
    });
  }

  function handleRemovePlayer(squadPlayerId: string) {
    if (!squad) return;
    startTransition(async () => {
      await removePlayerFromSquad({
        squadId: squad.id,
        squadPlayerId,
      });
    });
  }

  function handleSwapSlots(fromIndex: number, toIndex: number) {
    if (!squad || fromIndex === toIndex) return;
    startTransition(async () => {
      await swapSlots({ squadId: squad.id, fromIndex, toIndex });
    });
  }

  function handleFormationChange(formation: string) {
    if (!squad) return;
    startTransition(async () => {
      await updateFormation({ squadId: squad.id, formation });
    });
  }

  const budgetForSlot =
    selectedSlot?.type === "FIRST_XI"
      ? budgets.firstXI.remaining
      : selectedSlot?.type === "BENCH"
        ? budgets.bench.remaining
        : budgets.reserves.remaining;

  return (
    <div className="flex flex-col md:h-[calc(100vh-3rem)]">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">{squad.name}</h1>
        {isPending && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Main content — three columns filling remaining viewport height */}
      <div className="grid min-h-0 flex-1 gap-4 md:gap-6 lg:grid-cols-[2fr_1fr_1fr]">
        {/* Column 1: Pitch */}
        <div className="min-h-0">
          <PitchVisualization
            formation={squad.formation}
            players={squad.players}
            onSlotClick={handleSlotClick}
            onRemovePlayer={handleRemovePlayer}
            onSwapSlots={handleSwapSlots}
            overlay={
              <Select value={squad.formation} onValueChange={handleFormationChange}>
                <SelectTrigger className="h-7 w-40 border-white/20 bg-black/40 text-xs text-white hover:bg-black/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FORMATION_NAMES.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            }
          />
        </div>

        {/* Column 2: Bench & Reserves */}
        <div className="min-h-0 space-y-2">
          <Card>
            <CardHeader className="px-4 py-2">
              <CardTitle className="text-sm">Bench (7)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 px-4 pb-3 pt-0">
              {Array.from({ length: 7 }).map((_, i) => {
                const player = benchPlayers.find((p) => p.slotIndex === i);
                return (
                  <PlayerSlotRow
                    key={`bench-${i}`}
                    index={i}
                    squadPlayer={player || null}
                    costParams={costParams}
                    onAdd={() => handleBenchSlotClick(i)}
                    onRemove={
                      player ? () => handleRemovePlayer(player.id) : undefined
                    }
                  />
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-4 py-2">
              <CardTitle className="text-sm">Reserves (5)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 px-4 pb-3 pt-0">
              {Array.from({ length: 5 }).map((_, i) => {
                const player = reservesPlayers.find((p) => p.slotIndex === i);
                return (
                  <PlayerSlotRow
                    key={`res-${i}`}
                    index={i}
                    squadPlayer={player || null}
                    costParams={costParams}
                    onAdd={() => handleReservesSlotClick(i)}
                    onRemove={
                      player ? () => handleRemovePlayer(player.id) : undefined
                    }
                  />
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Column 3: Budgets */}
        <div className="min-h-0 space-y-4 overflow-y-auto">
          <Card>
            <CardContent className="space-y-5 pt-4">
              <BudgetBar label="First XI" budget={budgets.firstXI} />
              <BudgetBar label="Bench" budget={budgets.bench} />
              <BudgetBar label="Reserves" budget={budgets.reserves} />
            </CardContent>
          </Card>
        </div>
      </div>

      <PlayerSearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelectPlayer={handleSelectPlayer}
        slotLabel={selectedSlot?.label ?? ""}
        budgetRemaining={budgetForSlot}
        costParams={costParams}
        existingPlayerIds={existingPlayerIds}
      />
    </div>
  );
}

function PlayerSlotRow({
  index,
  squadPlayer,
  costParams,
  onAdd,
  onRemove,
}: {
  index: number;
  squadPlayer: SquadPlayerWithPlayer | null;
  costParams: CostParams;
  onAdd: () => void;
  onRemove?: () => void;
}) {
  if (!squadPlayer) {
    return (
      <button
        onClick={onAdd}
        className="flex w-full items-center gap-2 rounded-md border border-dashed border-border px-2 py-1.5 text-xs text-muted-foreground transition hover:border-primary/30 hover:bg-accent/50"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded bg-secondary">
          <Plus className="h-3 w-3" />
        </div>
        <span>Slot {index + 1}</span>
      </button>
    );
  }

  const cost = calculateCost(squadPlayer.player.overall, costParams);

  return (
    <div className="flex items-center gap-2 rounded-md bg-accent/30 px-2 py-1.5">
      <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
        {squadPlayer.player.overall}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium">
          {squadPlayer.player.name}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Badge variant="outline" className="px-1 py-0 text-[9px]">
            {squadPlayer.player.position}
          </Badge>
          <span>{formatCurrency(cost)}</span>
        </div>
      </div>
      {onRemove && (
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
