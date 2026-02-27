import { streamText, convertToModelMessages, tool, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { searchPlayers } from "@/lib/queries";
import { calculateCost, formatCurrency } from "@/lib/cost";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, squadContext } = await request.json();

  const systemPrompt = buildSystemPrompt(squadContext);
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages: modelMessages,
    tools: {
      searchPlayers: tool({
        description:
          "Search the player database. Use this to find players matching the user's criteria. You can search by name, position, league, team, and OVR range. Always use this tool when the user asks about players.",
        inputSchema: z.object({
          search: z.string().optional().describe("Player name search query"),
          position: z
            .string()
            .optional()
            .describe("Position filter (e.g. ST, CB, LW, GK, CDM, CAM, CM, LB, RB)"),
          league: z
            .string()
            .optional()
            .describe("League filter (e.g. Premier League, La Liga, Serie A, Bundesliga, Ligue 1)"),
          team: z.string().optional().describe("Team name search"),
          minOvr: z.number().optional().describe("Minimum OVR rating"),
          maxOvr: z.number().optional().describe("Maximum OVR rating"),
          sortBy: z
            .enum(["overall", "pace", "shooting", "passing", "dribbling", "defending", "physical"])
            .optional()
            .describe("Sort results by attribute"),
        }),
        execute: async (params) => {
          const costParams = squadContext?.costParams ?? {
            base: 13_723_086,
            exponent: 1.23,
            baseRating: 76,
          };

          const { players, total } = await searchPlayers({
            ...params,
            pageSize: 10,
            sortOrder: "desc",
          });

          return {
            total,
            players: players.map((p) => ({
              id: p.id,
              name: p.name,
              position: p.position,
              alternativePositions: p.alternativePositions,
              overall: p.overall,
              team: p.team,
              league: p.league,
              pace: p.pace,
              shooting: p.shooting,
              passing: p.passing,
              dribbling: p.dribbling,
              defending: p.defending,
              physical: p.physical,
              cost: formatCurrency(
                calculateCost(p.overall, costParams)
              ),
              costRaw: calculateCost(p.overall, costParams),
            })),
          };
        },
      }),
    },
    stopWhen: stepCountIs(3),
  });

  return result.toUIMessageStreamResponse();
}

function buildSystemPrompt(
  ctx: {
    formation?: string;
    players?: { name: string; position: string; overall: number; cost: string; slotType: string; slotIndex: number }[];
    budgets?: {
      firstXI: { remaining: number; budget: number; spent: number };
      bench: { remaining: number; budget: number; spent: number };
      reserves: { remaining: number; budget: number; spent: number };
    };
    emptySlots?: { slotType: string; slotIndex: number; label: string }[];
    existingPlayerIds?: number[];
    costParams?: { base: number; exponent: number; baseRating: number };
  } | undefined
): string {
  let prompt = `You are an FC26 Squad Building Assistant for MuppetManager. You help users find and suggest players for their squads.

Rules:
- Be concise and helpful. Use short responses.
- When the user asks about players, ALWAYS use the searchPlayers tool to find them.
- When suggesting players, mention their OVR, position, team, and cost.
- Consider budget constraints when making suggestions.
- If a player is already in the squad, mention that.
- You can search multiple times to compare options.
- Don't suggest players that are already in the squad.`;

  if (!ctx) {
    prompt += "\n\nNo squad is currently selected.";
    return prompt;
  }

  if (ctx.formation) {
    prompt += `\n\nCurrent formation: ${ctx.formation}`;
  }

  if (ctx.players && ctx.players.length > 0) {
    prompt += "\n\nCurrent squad:";
    for (const p of ctx.players) {
      prompt += `\n- ${p.slotType} slot ${p.slotIndex}: ${p.name} (${p.position}, OVR ${p.overall}, ${p.cost})`;
    }
  }

  if (ctx.budgets) {
    const b = ctx.budgets;
    prompt += `\n\nBudgets:`;
    prompt += `\n- First XI: ${formatCurrency(b.firstXI.remaining)} remaining of ${formatCurrency(b.firstXI.budget)}`;
    prompt += `\n- Bench: ${formatCurrency(b.bench.remaining)} remaining of ${formatCurrency(b.bench.budget)}`;
    prompt += `\n- Reserves: ${formatCurrency(b.reserves.remaining)} remaining of ${formatCurrency(b.reserves.budget)}`;
  }

  if (ctx.emptySlots && ctx.emptySlots.length > 0) {
    prompt += "\n\nEmpty slots to fill:";
    for (const s of ctx.emptySlots) {
      prompt += `\n- ${s.slotType} slot ${s.slotIndex} (${s.label})`;
    }
  }

  if (ctx.existingPlayerIds && ctx.existingPlayerIds.length > 0) {
    prompt += `\n\nExisting player IDs in squad (do NOT suggest these): ${ctx.existingPlayerIds.join(", ")}`;
  }

  return prompt;
}
