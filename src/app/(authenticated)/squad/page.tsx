import { getUserSquads, getGameSettings } from "@/lib/queries";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SquadBuilder } from "./squad-builder";

export default async function SquadPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [squads, settings] = await Promise.all([
    getUserSquads(),
    getGameSettings(),
  ]);

  return (
    <SquadBuilder
      squads={squads}
      settings={settings}
      userId={session.user.id}
    />
  );
}
