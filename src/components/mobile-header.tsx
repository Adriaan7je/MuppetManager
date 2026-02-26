"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, LayoutDashboard, Swords, Users, Settings, LogOut } from "lucide-react";
import { KermitIcon } from "@/components/kermit-icon";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/squad", label: "My Squad", icon: Swords },
  { href: "/players", label: "Players", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileHeader({ displayName }: { displayName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-sidebar px-4 md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </Button>

      <KermitIcon className="h-6 w-6 text-primary" />
      <span className="text-base font-bold tracking-tight">MuppetManager</span>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 bg-sidebar p-0">
          <SheetHeader className="border-b border-sidebar-border px-4 py-4">
            <SheetTitle className="flex items-center gap-2 text-sidebar-foreground">
              <KermitIcon className="h-6 w-6 text-primary" />
              MuppetManager
            </SheetTitle>
          </SheetHeader>

          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-sidebar-border p-3">
            <div className="mb-2 px-3 text-xs text-muted-foreground">
              Signed in as <span className="font-medium text-sidebar-foreground">{displayName}</span>
            </div>
            <form action={logout}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground"
                onClick={() => setOpen(false)}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
