"use client";

import { useState, useTransition } from "react";
import { PitchVisualization } from "@/components/pitch-visualization";
import { BudgetBar } from "@/components/budget-bar";
import { PlayerSearchDialog } from "@/components/player-search-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Loader2, Star, Pencil, ChevronDown, Check, Bot } from "lucide-react";
import { FORMATION_NAMES } from "@/lib/formations";
import { calculateCost, formatCurrency, type CostParams } from "@/lib/cost";
import { calculateSquadBudgets } from "@/lib/budget";
import { SquadChat } from "@/components/squad-chat";
import {
  addPlayerToSquad,
  removePlayerFromSquad,
  updateFormation,
  createSquad,
  deleteSquad,
  setFavoriteSquad,
  renameSquad,
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
  squads: SquadWithPlayers[];
  settings: GameSettings;
  userId: string;
}

export function SquadBuilder({ squads, settings, userId }: SquadBuilderProps) {
  const [isPending, startTransition] = useTransition();
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    index: number;
    label: string;
    type: "FIRST_XI" | "BENCH" | "RESERVES";
  } | null>(null);

  // Squad management dialogs
  const [newSquadDialogOpen, setNewSquadDialogOpen] = useState(false);
  const [newSquadName, setNewSquadName] = useState("");
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Chat drawer
  const [chatOpen, setChatOpen] = useState(false);

  // Track selected squad — default to favorite, fall back to first
  const favoriteSquad = squads.find((s) => s.isActive);
  const [selectedSquadId, setSelectedSquadId] = useState<string | null>(
    favoriteSquad?.id ?? squads[0]?.id ?? null
  );

  const squad = squads.find((s) => s.id === selectedSquadId) ?? null;

  const costParams: CostParams = {
    base: settings.costBase,
    exponent: settings.costExponent,
    baseRating: settings.costBaseRating,
  };

  // --- Squad management handlers ---

  function handleCreateSquad() {
    const name = newSquadName.trim();
    if (!name) return;
    setNewSquadDialogOpen(false);
    setNewSquadName("");
    startTransition(async () => {
      const result = await createSquad(name);
      if (result.squadId) {
        setSelectedSquadId(result.squadId);
      }
    });
  }

  function handleDeleteSquad(squadId: string) {
    setDeleteConfirmId(null);
    const wasSelected = squadId === selectedSquadId;
    startTransition(async () => {
      await deleteSquad(squadId);
      if (wasSelected) {
        // Will pick up the new list after revalidation
        const remaining = squads.filter((s) => s.id !== squadId);
        const next = remaining.find((s) => s.isActive) ?? remaining[0];
        setSelectedSquadId(next?.id ?? null);
      }
    });
  }

  function handleSetFavorite(squadId: string) {
    startTransition(async () => {
      await setFavoriteSquad(squadId);
    });
  }

  function handleRenameSquad() {
    const name = renameValue.trim();
    if (!name || !squad) return;
    setRenameDialogOpen(false);
    startTransition(async () => {
      await renameSquad(squad.id, name);
    });
  }

  // --- No squads state ---

  if (squads.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Squads</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-muted-foreground">
              You don&apos;t have any squads yet
            </p>
            <Button
              onClick={() => setNewSquadDialogOpen(true)}
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

        <NewSquadDialog
          open={newSquadDialogOpen}
          onOpenChange={setNewSquadDialogOpen}
          name={newSquadName}
          onNameChange={setNewSquadName}
          onConfirm={handleCreateSquad}
        />
      </div>
    );
  }

  // --- Active squad content ---

  const budgets = squad ? calculateSquadBudgets(squad, settings) : null;
  const existingPlayerIds = squad?.players.map((sp) => sp.playerId) ?? [];

  const benchPlayers = (squad?.players ?? [])
    .filter((p) => p.slotType === "BENCH")
    .sort((a, b) => a.slotIndex - b.slotIndex);
  const reservesPlayers = (squad?.players ?? [])
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

  function handleAddFromChat(playerId: number, slotType: "FIRST_XI" | "BENCH" | "RESERVES", slotIndex: number) {
    if (!squad) return;
    startTransition(async () => {
      await addPlayerToSquad({
        squadId: squad.id,
        playerId,
        slotType,
        slotIndex,
      });
    });
  }

  const budgetForSlot =
    selectedSlot?.type === "FIRST_XI"
      ? budgets?.firstXI.remaining ?? 0
      : selectedSlot?.type === "BENCH"
        ? budgets?.bench.remaining ?? 0
        : budgets?.reserves.remaining ?? 0;

  return (
    <div className="flex flex-col md:h-[calc(100vh-3rem)]">
      {/* Squad header with dropdown */}
      <div className="mb-4 flex shrink-0 items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-1 py-0.5 text-xl font-bold tracking-tight transition-colors hover:text-primary md:text-2xl">
              {squad?.isActive && (
                <Star className="h-4 w-4 shrink-0 fill-yellow-500 text-yellow-500" />
              )}
              <span className="truncate">{squad?.name ?? "Select Squad"}</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Squads</DropdownMenuLabel>
            <DropdownMenuGroup>
              {squads.map((s) => (
                <DropdownMenuItem
                  key={s.id}
                  onClick={() => setSelectedSquadId(s.id)}
                >
                  {s.isActive && (
                    <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                  )}
                  <span className="flex-1 truncate">{s.name}</span>
                  {s.id === selectedSquadId && (
                    <Check className="h-3.5 w-3.5 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setNewSquadDialogOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              New Squad
            </DropdownMenuItem>
            {squad && (
              <>
                <DropdownMenuItem
                  onClick={() => {
                    setRenameValue(squad.name);
                    setRenameDialogOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Rename
                </DropdownMenuItem>
                {!squad.isActive && (
                  <DropdownMenuItem
                    onClick={() => handleSetFavorite(squad.id)}
                  >
                    <Star className="h-3.5 w-3.5" />
                    Set as Favorite
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeleteConfirmId(squad.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Squad
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        {isPending && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Main content — three columns filling remaining viewport height */}
      {squad && budgets && (
        <div className="grid min-h-0 flex-1 gap-4 md:gap-6 lg:grid-cols-[auto_1fr_1fr]">
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
          <div className="flex min-h-0 flex-col gap-4 md:gap-6">
            <Card className="flex flex-1 flex-col">
              <CardHeader className="px-4 py-2">
                <CardTitle className="text-sm">Bench (7)</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-1 px-4 pb-3 pt-0">
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

            <Card className="flex flex-1 flex-col">
              <CardHeader className="px-4 py-2">
                <CardTitle className="text-sm">Reserves (5)</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-1 px-4 pb-3 pt-0">
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
          <div className="min-h-0">
            <Card>
              <CardContent className="space-y-5 pt-4">
                <BudgetBar label="First XI" budget={budgets.firstXI} />
                <BudgetBar label="Bench" budget={budgets.bench} />
                <BudgetBar label="Reserves" budget={budgets.reserves} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <PlayerSearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelectPlayer={handleSelectPlayer}
        slotLabel={selectedSlot?.label ?? ""}
        budgetRemaining={budgetForSlot}
        costParams={costParams}
        existingPlayerIds={existingPlayerIds}
      />

      {/* New squad dialog */}
      <NewSquadDialog
        open={newSquadDialogOpen}
        onOpenChange={setNewSquadDialogOpen}
        name={newSquadName}
        onNameChange={setNewSquadName}
        onConfirm={handleCreateSquad}
      />

      {/* Rename dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename Squad</DialogTitle>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            placeholder="Squad name"
            onKeyDown={(e) => e.key === "Enter" && handleRenameSquad()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameSquad} disabled={!renameValue.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Squad</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this squad? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDeleteSquad(deleteConfirmId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Chat button & drawer */}
      <Button
        size="icon"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full shadow-lg"
        onClick={() => setChatOpen(true)}
      >
        <Bot className="h-5 w-5" />
      </Button>

      <SquadChat
        open={chatOpen}
        onOpenChange={setChatOpen}
        squad={squad}
        settings={settings}
        onAddPlayer={handleAddFromChat}
      />
    </div>
  );
}

function NewSquadDialog({
  open,
  onOpenChange,
  name,
  onNameChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (name: string) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New Squad</DialogTitle>
        </DialogHeader>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Squad name"
          onKeyDown={(e) => e.key === "Enter" && onConfirm()}
          autoFocus
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={!name.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
