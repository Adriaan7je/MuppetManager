import { searchPlayers, getFilterOptions, getGameSettings } from "@/lib/queries";
import { PlayerBrowser } from "./player-browser";

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const search = typeof sp.search === "string" ? sp.search : undefined;
  const position = typeof sp.position === "string" ? sp.position : undefined;
  const league = typeof sp.league === "string" ? sp.league : undefined;
  const page = typeof sp.page === "string" ? Number(sp.page) : 1;
  const sortBy = typeof sp.sortBy === "string" ? sp.sortBy : "overall";
  const sortOrder =
    typeof sp.sortOrder === "string"
      ? (sp.sortOrder as "asc" | "desc")
      : "desc";

  const [result, filterOptions, settings] = await Promise.all([
    searchPlayers({ search, position, league, page, sortBy, sortOrder, pageSize: 25 }),
    getFilterOptions(),
    getGameSettings(),
  ]);

  return (
    <PlayerBrowser
      players={result.players}
      total={result.total}
      pages={result.pages}
      currentPage={page}
      search={search}
      position={position}
      league={league}
      sortBy={sortBy}
      sortOrder={sortOrder}
      filterOptions={filterOptions}
      settings={settings}
    />
  );
}
