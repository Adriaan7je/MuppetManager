import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SidebarNav } from "@/components/sidebar-nav";
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

  return (
    <div className="flex min-h-screen">
      <SidebarNav displayName={user?.displayName ?? "User"} />
      <main className="flex-1 pl-56">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
