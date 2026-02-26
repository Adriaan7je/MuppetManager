import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SidebarNav } from "@/components/sidebar-nav";
import { MobileHeader } from "@/components/mobile-header";
import { db } from "@/lib/db";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { displayName: true },
  });

  const displayName = user?.displayName ?? "User";

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <MobileHeader displayName={displayName} />
      <SidebarNav displayName={displayName} />
      <main className="flex-1 md:pl-56">
        <div className="p-3 md:p-6">{children}</div>
      </main>
    </div>
  );
}
