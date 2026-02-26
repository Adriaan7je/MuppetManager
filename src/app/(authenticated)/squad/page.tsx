import { getActiveSquad, getGameSettings } from "@/lib/queries";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SquadBuilder } from "./squad-builder";

export default async function SquadPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [squad, settings] = await Promise.all([
    getActiveSquad(),
    getGameSettings(),
  ]);

  return (
    <SquadBuilder
      squad={squad}
      settings={settings}
      userId={session.user.id}
    />
  );
}
