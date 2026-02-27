"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FORMATIONS, type FormationSlot } from "@/lib/formations";
import { Plus, X } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import type { SquadPlayerWithPlayer, Player } from "@/types";

interface PitchVisualizationProps {
  formation: string;
  players: SquadPlayerWithPlayer[];
  onSlotClick?: (slotIndex: number, slot: FormationSlot) => void;
  onRemovePlayer?: (squadPlayerId: string) => void;
  onSwapSlots?: (fromIndex: number, toIndex: number) => void;
  readOnly?: boolean;
  overlay?: React.ReactNode;
}

export function PitchVisualization({
  formation,
  players,
  onSlotClick,
  onRemovePlayer,
  onSwapSlots,
  readOnly = false,
  overlay,
}: PitchVisualizationProps) {
  const formationData = FORMATIONS[formation] ?? FORMATIONS["4-3-3"];
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);

  const playerMap = new Map<number, SquadPlayerWithPlayer>();
  for (const p of players) {
    if (p.slotType === "FIRST_XI") {
      playerMap.set(p.slotIndex, p);
    }
  }

  return (
    <TooltipProvider delayDuration={300}>
    <div className="pitch-bg relative aspect-[3/4] h-full max-w-full overflow-hidden rounded-xl border border-white/10 shadow-lg" onClick={() => setTappedIndex(null)}>
      {/* Pitch markings */}
      <svg
        viewBox="0 0 100 130"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        {/* Center circle */}
        <circle cx="50" cy="65" r="12" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
        <line x1="0" y1="65" x2="100" y2="65" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
        {/* Penalty area top */}
        <rect x="20" y="0" width="60" height="22" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
        <rect x="30" y="0" width="40" height="10" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
        {/* Penalty area bottom */}
        <rect x="20" y="108" width="60" height="22" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
        <rect x="30" y="120" width="40" height="10" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
        {/* Outline */}
        <rect x="0.5" y="0.5" width="99" height="129" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
      </svg>

      {/* Overlay (e.g. formation selector) */}
      {overlay && (
        <div className="absolute right-3 top-3 z-10">{overlay}</div>
      )}

      {/* Player slots */}
      {formationData.slots.map((slot, index) => {
        const squadPlayer = playerMap.get(index);
        const isDragOver = dragOverIndex === index;

        return (
          <div
            key={index}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${slot.x}%`,
              top: `${slot.y}%`,
            }}
            onDragOver={(e) => {
              if (readOnly) return;
              e.preventDefault();
              setDragOverIndex(index);
            }}
            onDragLeave={() => setDragOverIndex(null)}
            onDrop={(e) => {
              if (readOnly) return;
              e.preventDefault();
              const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
              if (!isNaN(fromIndex) && fromIndex !== index) {
                onSwapSlots?.(fromIndex, index);
              }
              setDragOverIndex(null);
            }}
          >
            {squadPlayer ? (
              <Tooltip open={tappedIndex === index ? true : undefined} onOpenChange={(open) => {
                if (!open && tappedIndex === index) setTappedIndex(null);
              }}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "group relative flex flex-col items-center",
                      !readOnly && "cursor-grab active:cursor-grabbing"
                    )}
                    draggable={!readOnly}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", String(index));
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragEnd={() => setDragOverIndex(null)}
                    onClick={(e) => { e.stopPropagation(); setTappedIndex(tappedIndex === index ? null : index); }}
                  >
                    <div className="relative">
                      <div
                        className={cn(
                          "relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-zinc-600 to-zinc-700 shadow-lg ring-2 sm:h-16 sm:w-16",
                          isDragOver ? "ring-primary" : "ring-white/20"
                        )}
                      >
                        {squadPlayer.player.eaId ? (
                          <PlayerFaceImage eaId={squadPlayer.player.eaId} name={squadPlayer.player.name} overall={squadPlayer.player.overall} />
                        ) : (
                          <span className="text-sm font-bold text-primary-foreground sm:text-base">
                            {squadPlayer.player.overall}
                          </span>
                        )}
                      </div>
                      <span className={cn(
                        "absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-[10px] font-bold ring-1 ring-white/20",
                        ovrColor(squadPlayer.player.overall)
                      )}>
                        {squadPlayer.player.overall}
                      </span>
                      {squadPlayer.player.clubLogoUrl && (
                        <img
                          src={squadPlayer.player.clubLogoUrl}
                          alt={squadPlayer.player.team}
                          className="absolute -bottom-1.5 -right-2.5 h-8 w-8 object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                          referrerPolicy="no-referrer"
                          draggable={false}
                        />
                      )}
                      {!readOnly && onRemovePlayer && (
                        <button
                          onPointerDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setTappedIndex(null);
                            onRemovePlayer(squadPlayer.id);
                          }}
                          className={cn(
                            "absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-destructive text-white shadow",
                            tappedIndex === index ? "flex" : "hidden group-hover:flex"
                          )}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <div className="mt-1 max-w-[80px] truncate rounded bg-black/60 px-1.5 py-0.5 text-center text-[10px] font-medium text-white sm:text-xs">
                      {squadPlayer.player.name.split(" ").pop()}
                    </div>
                    <div className="text-[9px] font-medium text-white/60">
                      {slot.label}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={8} className="p-0">
                  <PlayerStatTooltip player={squadPlayer.player} />
                </TooltipContent>
              </Tooltip>
            ) : (
              <button
                onClick={() => !readOnly && onSlotClick?.(index, slot)}
                disabled={readOnly}
                className={cn(
                  "flex flex-col items-center",
                  !readOnly && "cursor-pointer"
                )}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed sm:h-14 sm:w-14",
                    isDragOver
                      ? "border-primary bg-primary/10 ring-2 ring-primary"
                      : readOnly
                        ? "border-white/10 bg-white/5"
                        : "border-white/20 bg-white/5 transition hover:border-primary/50 hover:bg-primary/10"
                  )}
                >
                  {!readOnly && <Plus className="h-5 w-5 text-white/30" />}
                </div>
                <div className="mt-1 text-[10px] font-medium text-white/40 sm:text-xs">
                  {slot.label}
                </div>
              </button>
            )}
          </div>
        );
      })}
    </div>
    </TooltipProvider>
  );
}

function PlayerFaceImage({ eaId, name, overall }: { eaId: number; name: string; overall: number }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="text-sm font-bold text-primary-foreground sm:text-base">
        {overall}
      </span>
    );
  }

  return (
    <img
      src={`https://cdn.futbin.com/content/fifa26/img/players/${eaId}.png`}
      alt={name}
      className="absolute inset-0 h-full w-full rounded-full object-cover"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      draggable={false}
    />
  );
}

function ovrColor(value: number) {
  if (value > 89) return "text-red-500";
  if (value > 84) return "text-orange-400";
  if (value > 79) return "text-yellow-400";
  return "text-white";
}

function statColor(value: number) {
  if (value >= 85) return "text-emerald-600";
  if (value >= 70) return "text-amber-600";
  return "text-background/50";
}

function Stars({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <span className="tracking-tight">
      {"★".repeat(count)}
      {"★".repeat(max - count).split("").map((_, i) => (
        <span key={i} className="text-background/20">★</span>
      ))}
    </span>
  );
}

function PlayerStatTooltip({ player }: { player: Player }) {
  const stats = [
    { label: "PAC", value: player.pace },
    { label: "SHO", value: player.shooting },
    { label: "PAS", value: player.passing },
    { label: "DRI", value: player.dribbling },
    { label: "DEF", value: player.defending },
    { label: "PHY", value: player.physical },
  ];

  return (
    <div className="w-52 space-y-2 p-3 text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{player.name}</span>
        <span className="rounded bg-primary/20 px-1.5 py-0.5 text-xs font-bold text-primary">
          {player.overall}
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 text-[10px] text-background/50">
        {player.countryCode && (
          <img
            src={`https://flagcdn.com/24x18/${player.countryCode}.png`}
            alt={player.nation}
            className="inline-block h-[18px] w-6 object-cover"
            draggable={false}
          />
        )}
        {player.clubLogoUrl && (
          <img
            src={player.clubLogoUrl}
            alt={player.team}
            className="inline-block h-5 w-5 object-contain"
            referrerPolicy="no-referrer"
            draggable={false}
          />
        )}
        <span>{player.age} yr</span>
      </div>

      {/* Positions */}
      <div className="flex flex-wrap gap-1">
        <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
          {player.position}
        </span>
        {player.alternativePositions.map((pos) => (
          <span
            key={pos}
            className="rounded bg-background/10 px-1.5 py-0.5 text-[10px] text-background/60"
          >
            {pos}
          </span>
        ))}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-x-3 gap-y-1">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center justify-between text-[11px]">
            <span className="text-background/40">{s.label}</span>
            <span className={cn("font-bold", statColor(s.value))}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* PlayStyles */}
      {player.playStyles?.length > 0 && (
        <div className="flex flex-wrap gap-1 border-t border-background/10 pt-2">
          {player.playStyles.map((ps) => (
            <span
              key={ps}
              className="rounded bg-primary/15 px-1.5 py-0.5 text-[9px] font-medium text-primary"
            >
              {ps}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-3 border-t border-background/10 pt-2 text-[10px]">
        <span className="text-background/60">
          {player.preferredFoot === "Left" ? "L" : "R"} foot
        </span>
        <span className="text-background/60">
          WF <Stars count={player.weakFoot} />
        </span>
        <span className="text-background/60">
          SM <Stars count={player.skillMoves} />
        </span>
      </div>
    </div>
  );
}
