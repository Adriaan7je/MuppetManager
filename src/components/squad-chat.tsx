"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bot, Send, Loader2, Plus } from "lucide-react";
import { calculateCost, formatCurrency, type CostParams } from "@/lib/cost";
import { calculateSquadBudgets } from "@/lib/budget";
import { FORMATIONS } from "@/lib/formations";
import type { SquadWithPlayers, GameSettings } from "@/types";

interface SquadChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  squad: SquadWithPlayers | null;
  settings: GameSettings;
  onAddPlayer: (playerId: number, slotType: "FIRST_XI" | "BENCH" | "RESERVES", slotIndex: number) => void;
}

interface PlayerResult {
  id: number;
  name: string;
  position: string;
  overall: number;
  team: string;
  cost: string;
  costRaw: number;
}

export function SquadChat({ open, onOpenChange, squad, settings, onAddPlayer }: SquadChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const costParams: CostParams = {
    base: settings.costBase,
    exponent: settings.costExponent,
    baseRating: settings.costBaseRating,
  };

  const squadContext = useMemo(() => {
    if (!squad) return undefined;

    const formation = FORMATIONS[squad.formation];
    const budgets = calculateSquadBudgets(squad, settings);
    const existingPlayerIds = squad.players.map((sp) => sp.playerId);

    // Build list of empty slots
    const emptySlots: { slotType: string; slotIndex: number; label: string }[] = [];

    // First XI empty slots
    if (formation) {
      const occupiedFirstXI = new Set(
        squad.players.filter((p) => p.slotType === "FIRST_XI").map((p) => p.slotIndex)
      );
      formation.slots.forEach((slot, i) => {
        if (!occupiedFirstXI.has(i)) {
          emptySlots.push({ slotType: "FIRST_XI", slotIndex: i, label: slot.label });
        }
      });
    }

    // Bench empty slots
    const occupiedBench = new Set(
      squad.players.filter((p) => p.slotType === "BENCH").map((p) => p.slotIndex)
    );
    for (let i = 0; i < 7; i++) {
      if (!occupiedBench.has(i)) {
        emptySlots.push({ slotType: "BENCH", slotIndex: i, label: `Bench ${i + 1}` });
      }
    }

    // Reserves empty slots
    const occupiedReserves = new Set(
      squad.players.filter((p) => p.slotType === "RESERVES").map((p) => p.slotIndex)
    );
    for (let i = 0; i < 5; i++) {
      if (!occupiedReserves.has(i)) {
        emptySlots.push({ slotType: "RESERVES", slotIndex: i, label: `Reserve ${i + 1}` });
      }
    }

    return {
      formation: squad.formation,
      players: squad.players.map((sp) => ({
        name: sp.player.name,
        position: sp.player.position,
        overall: sp.player.overall,
        cost: formatCurrency(calculateCost(sp.player.overall, costParams)),
        slotType: sp.slotType,
        slotIndex: sp.slotIndex,
      })),
      budgets: {
        firstXI: { remaining: budgets.firstXI.remaining, budget: budgets.firstXI.budget, spent: budgets.firstXI.spent },
        bench: { remaining: budgets.bench.remaining, budget: budgets.bench.budget, spent: budgets.bench.spent },
        reserves: { remaining: budgets.reserves.remaining, budget: budgets.reserves.budget, spent: budgets.reserves.spent },
      },
      emptySlots,
      existingPlayerIds,
      costParams,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [squad, settings]);

  const transport = useMemo(
    () => new DefaultChatTransport({ body: { squadContext } }),
    [squadContext]
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Reset chat when squad changes
  const squadId = squad?.id;
  useEffect(() => {
    setMessages([]);
  }, [squadId, setMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || !squad || isLoading) return;
    setInput("");
    sendMessage({ text });
  }

  function findBestSlot(player: PlayerResult): { slotType: "FIRST_XI" | "BENCH" | "RESERVES"; slotIndex: number } | null {
    if (!squadContext?.emptySlots?.length) return null;

    // Try to find a First XI slot matching position
    const positionMatch = squadContext.emptySlots.find(
      (s) => s.slotType === "FIRST_XI" && s.label === player.position
    );
    if (positionMatch) {
      return { slotType: positionMatch.slotType as "FIRST_XI", slotIndex: positionMatch.slotIndex };
    }

    // Fallback to first available First XI slot
    const firstXISlot = squadContext.emptySlots.find((s) => s.slotType === "FIRST_XI");
    if (firstXISlot) {
      return { slotType: "FIRST_XI", slotIndex: firstXISlot.slotIndex };
    }

    // Then bench
    const benchSlot = squadContext.emptySlots.find((s) => s.slotType === "BENCH");
    if (benchSlot) {
      return { slotType: "BENCH", slotIndex: benchSlot.slotIndex };
    }

    // Then reserves
    const reserveSlot = squadContext.emptySlots.find((s) => s.slotType === "RESERVES");
    if (reserveSlot) {
      return { slotType: "RESERVES", slotIndex: reserveSlot.slotIndex };
    }

    return null;
  }

  function handleAddPlayer(player: PlayerResult) {
    const slot = findBestSlot(player);
    if (!slot) return;
    onAddPlayer(player.id, slot.slotType, slot.slotIndex);
  }

  const existingIds = new Set(squadContext?.existingPlayerIds ?? []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Bot className="h-4 w-4 text-primary" />
            Squad Assistant
          </SheetTitle>
        </SheetHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Bot className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                Ask me to find players for your squad
              </p>
              <div className="mt-3 space-y-1">
                {[
                  "Find me a fast LW under budget",
                  "Who are the best strikers?",
                  "Suggest a cheap CB",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    className="block w-full rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-accent"
                    onClick={() => setInput(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="mb-4">
              {/* User message */}
              {message.role === "user" && (
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
                    {message.parts
                      .filter((p): p is { type: "text"; text: string } => p.type === "text")
                      .map((p, i) => (
                        <span key={i}>{p.text}</span>
                      ))}
                  </div>
                </div>
              )}

              {/* Assistant message */}
              {message.role === "assistant" && (
                <div className="flex gap-2">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    {/* Render text parts */}
                    {message.parts
                      .filter((p): p is { type: "text"; text: string } => p.type === "text")
                      .map((p, i) =>
                        p.text ? (
                          <div key={i} className="rounded-2xl rounded-tl-sm bg-accent/60 px-3 py-2 text-sm">
                            {p.text}
                          </div>
                        ) : null
                      )}

                    {/* Tool results — player cards */}
                    {message.parts.map((part, i) => {
                      if (part.type !== "tool-searchPlayers") return null;
                      const toolPart = part as {
                        type: string;
                        state: string;
                        output?: { players: PlayerResult[]; total: number };
                      };
                      if (toolPart.state !== "output-available") return null;
                      if (!toolPart.output?.players?.length) return null;

                      return (
                        <div key={i} className="mt-2 space-y-1.5">
                          {toolPart.output.players.map((player) => {
                            const alreadyInSquad = existingIds.has(player.id);
                            const slot = findBestSlot(player);
                            return (
                              <div
                                key={player.id}
                                className="flex items-center gap-2 rounded-lg border border-border bg-card p-2"
                              >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-sm font-bold text-primary">
                                  {player.overall}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-sm font-medium">
                                    {player.name}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Badge variant="outline" className="px-1 py-0 text-[10px]">
                                      {player.position}
                                    </Badge>
                                    <span className="truncate">{player.team}</span>
                                    <span className="font-medium text-primary">
                                      {player.cost}
                                    </span>
                                  </div>
                                </div>
                                {alreadyInSquad ? (
                                  <Badge variant="secondary" className="shrink-0 text-[10px]">
                                    In Squad
                                  </Badge>
                                ) : slot ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 shrink-0 gap-1 text-xs"
                                    onClick={() => handleAddPlayer(player)}
                                  >
                                    <Plus className="h-3 w-3" />
                                    Add
                                  </Button>
                                ) : (
                                  <Badge variant="secondary" className="shrink-0 text-[10px]">
                                    Full
                                  </Badge>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="mb-4 flex gap-2">
              <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-accent/60 px-3 py-2 text-sm text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t px-4 py-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={squad ? "Ask about players..." : "Select a squad first"}
            disabled={!squad || isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!squad || !input.trim() || isLoading}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
