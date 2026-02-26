import { NextRequest, NextResponse } from "next/server";
import { searchPlayers } from "@/lib/queries";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;

  const result = await searchPlayers({
    search: params.get("search") || undefined,
    position: params.get("position") || undefined,
    league: params.get("league") || undefined,
    team: params.get("team") || undefined,
    minOvr: params.get("minOvr") ? Number(params.get("minOvr")) : undefined,
    maxOvr: params.get("maxOvr") ? Number(params.get("maxOvr")) : undefined,
    page: params.get("page") ? Number(params.get("page")) : 1,
    pageSize: params.get("pageSize") ? Number(params.get("pageSize")) : 20,
    sortBy: params.get("sortBy") || "overall",
    sortOrder: (params.get("sortOrder") as "asc" | "desc") || "desc",
  });

  return NextResponse.json(result);
}
