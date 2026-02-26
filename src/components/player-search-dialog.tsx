"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Loader2 } from "lucide-react";
import { calculateCost, formatCurrency, type CostParams } from "@/lib/cost";
import type { Player, GameSettings } from "@/types";

interface PlayerSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPlayer: (player: Player) => void;
  slotLabel: string;
  budgetRemaining: number;
  costParams: CostParams;
  existingPlayerIds: number[];
}

export function PlayerSearchDialog({
  open,
  onOpenChange,
  onSelectPlayer,
  slotLabel,
  budgetRemaining,
  costParams,
  existingPlayerIds,
}: PlayerSearchDialogProps) {
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchPlayers = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("search", q);
      params.set("pageSize", "50");
      params.set("sortBy", "overall");
      params.set("sortOrder", "desc");

      const res = await fetch(`/api/players?${params}`);
      const data = await res.json();
      setPlayers(data.players);
      setTotal(data.total);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchPlayers(search);
    }
  }, [open, search, fetchPlayers]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add player to {slotLabel}</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="text-xs text-muted-foreground">
          Budget remaining: {formatCurrency(budgetRemaining)} — {total} players found
        </div>

        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-1">
              {players.map((player) => {
                const cost = calculateCost(player.overall, costParams);
                const canAfford = cost <= budgetRemaining;
                const alreadyInSquad = existingPlayerIds.includes(player.id);

                return (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent/50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                      {player.overall}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {player.name}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-[10px] px-1 py-0">
                          {player.position}
                        </Badge>
                        <span className="truncate">{player.team}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-xs font-medium tabular-nums">
                        {formatCurrency(cost)}
                      </span>
                      <Button
                        size="sm"
                        variant={canAfford && !alreadyInSquad ? "default" : "outline"}
                        disabled={!canAfford || alreadyInSquad}
                        onClick={() => onSelectPlayer(player)}
                        className="h-7 text-xs"
                      >
                        {alreadyInSquad ? "In squad" : !canAfford ? "Over budget" : "Add"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
