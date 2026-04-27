"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ellipsis, Settings } from "lucide-react";
import { Button } from "@/shared/_components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/_components/ui/sheet";
import { DASHBOARD_NAV } from "@/features/dashboard-shell/_utils/navigation";
import { cn } from "@/shared/_utils/cn";
import {
  dashboardIcons,
  type DashboardIconName,
} from "@/features/dashboard-shell/_utils/icon-map";

const primaryMobileItems = DASHBOARD_NAV.slice(0, 4);
const secondaryMobileItems = [
  ...DASHBOARD_NAV.slice(4),
  { label: "Pengaturan", href: "/dashboard/pengaturan", icon: "Settings" },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const isMoreSectionActive = secondaryMobileItems.some(
    (item) =>
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href))
  );

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 px-2 pb-2 pt-1 backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {primaryMobileItems.map((item) => {
          const Icon = dashboardIcons[item.icon as DashboardIconName];
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium text-muted-foreground",
                active && "bg-primary/10 text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
        <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium text-muted-foreground",
                  isMoreSectionActive && "bg-primary/10 text-primary"
                )}
              />
            }
          >
            <Ellipsis className="h-4 w-4" />
            <span>More</span>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl pb-6">
            <SheetHeader>
              <SheetTitle>Navigasi Dashboard</SheetTitle>
              <SheetDescription>
                Akses halaman dashboard lainnya dari sini.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2 px-4">
              {secondaryMobileItems.map((item) => {
                const Icon =
                  item.icon === "Settings"
                    ? Settings
                    : dashboardIcons[item.icon as DashboardIconName];

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMoreMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground/80",
                      pathname === item.href ||
                        (item.href !== "/dashboard" && pathname.startsWith(item.href))
                        ? "border-primary/30 bg-primary/5 text-primary"
                        : "hover:bg-accent"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
