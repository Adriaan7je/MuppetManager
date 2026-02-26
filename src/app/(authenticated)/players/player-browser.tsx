"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { calculateCost, formatCurrency, type CostParams } from "@/lib/cost";
import type { Player, GameSettings } from "@/types";

interface PlayerBrowserProps {
  players: Player[];
  total: number;
  pages: number;
  currentPage: number;
  search?: string;
  position?: string;
  league?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  filterOptions: { positions: string[]; leagues: string[] };
  settings: GameSettings;
}

export function PlayerBrowser({
  players,
  total,
  pages,
  currentPage,
  search,
  position,
  league,
  sortBy,
  sortOrder,
  filterOptions,
  settings,
}: PlayerBrowserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const costParams: CostParams = {
    base: settings.costBase,
    exponent: settings.costExponent,
    baseRating: settings.costBaseRating,
  };

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      // Reset to page 1 on filter change unless explicitly setting page
      if (!("page" in updates)) {
        params.delete("page");
      }
      router.push(`/players?${params.toString()}`);
    },
    [router, searchParams]
  );

  function handleSort(column: string) {
    if (sortBy === column) {
      updateParams({
        sortOrder: sortOrder === "desc" ? "asc" : "desc",
      });
    } else {
      updateParams({ sortBy: column, sortOrder: "desc" });
    }
  }

  const SortButton = ({
    column,
    children,
  }: {
    column: string;
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => handleSort(column)}
      className="flex items-center gap-1 hover:text-foreground"
    >
      {children}
      {sortBy === column && (
        <ArrowUpDown className="h-3 w-3" />
      )}
    </button>
  );

  function getOvrColor(ovr: number) {
    if (ovr >= 90) return "text-amber-400";
    if (ovr >= 85) return "text-emerald-400";
    if (ovr >= 80) return "text-blue-400";
    if (ovr >= 75) return "text-purple-400";
    return "text-muted-foreground";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Players</h1>
        <p className="text-muted-foreground">
          Browse {total} players from the FC26 database
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                defaultValue={search}
                onChange={(e) => {
                  const timer = setTimeout(() => {
                    updateParams({ search: e.target.value });
                  }, 300);
                  return () => clearTimeout(timer);
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={position ?? "all"}
              onValueChange={(v) => updateParams({ position: v })}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All positions</SelectItem>
                {filterOptions.positions.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={league ?? "all"}
              onValueChange={(v) => updateParams({ league: v })}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="League" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All leagues</SelectItem>
                {filterOptions.leagues.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <SortButton column="overall">OVR</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton column="name">Name</SortButton>
                </TableHead>
                <TableHead>Pos</TableHead>
                <TableHead className="hidden md:table-cell">Team</TableHead>
                <TableHead className="hidden lg:table-cell">
                  <SortButton column="pace">PAC</SortButton>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <SortButton column="shooting">SHO</SortButton>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <SortButton column="passing">PAS</SortButton>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <SortButton column="dribbling">DRI</SortButton>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <SortButton column="defending">DEF</SortButton>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <SortButton column="physical">PHY</SortButton>
                </TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>
                    <span
                      className={`font-bold tabular-nums ${getOvrColor(player.overall)}`}
                    >
                      {player.overall}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-xs text-muted-foreground md:hidden">
                        {player.team}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-[10px] px-1 py-0">
                        {player.position}
                      </Badge>
                      {player.alternativePositions.map((pos) => (
                        <Badge
                          key={pos}
                          variant="outline"
                          className="text-[10px] px-1 py-0 text-muted-foreground"
                        >
                          {pos}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {player.team}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell tabular-nums text-sm">
                    {player.pace}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell tabular-nums text-sm">
                    {player.shooting}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell tabular-nums text-sm">
                    {player.passing}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell tabular-nums text-sm">
                    {player.dribbling}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell tabular-nums text-sm">
                    {player.defending}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell tabular-nums text-sm">
                    {player.physical}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums text-sm">
                    {formatCurrency(calculateCost(player.overall, costParams))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {pages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() =>
                updateParams({ page: String(currentPage - 1) })
              }
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= pages}
              onClick={() =>
                updateParams({ page: String(currentPage + 1) })
              }
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
