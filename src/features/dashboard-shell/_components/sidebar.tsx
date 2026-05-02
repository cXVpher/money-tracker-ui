"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Wallet,
} from "@/shared/_components/icons/phosphor";
import { toast } from "sonner";
import { Button } from "@/shared/_components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/shared/_components/ui/navigation-menu";
import { ScrollArea } from "@/shared/_components/ui/scroll-area";
import { APP_NAME } from "@/shared/_constants/brand";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import { DASHBOARD_NAV } from "@/features/dashboard-shell/_utils/navigation";
import { cn } from "@/shared/_utils/cn";
import {
  dashboardIcons,
  type DashboardIconName,
} from "@/features/dashboard-shell/_utils/icon-map";
import { shouldUseMockFallback } from "@/shared/_utils/api-client";
import { getBalance, logout as logoutRequest } from "@/shared/_utils/backend-client";
import { logoutMockAccount } from "@/shared/_utils/mock-auth";

type SidebarProps = {
  isCollapsed: boolean;
  onCollapsedChange: (nextValue: boolean) => void;
};

export function Sidebar({ isCollapsed, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [balanceStatus, setBalanceStatus] = useState<{
    amount: number;
    daysRemaining: number;
    expiresAt?: string | null;
    planType: string;
  } | null>(null);
  const navItems = [
    ...DASHBOARD_NAV,
    { label: "Pengaturan", href: "/dashboard/pengaturan", icon: "Settings" },
  ] as const;

  useEffect(() => {
    if (USE_MOCK_DATA) {
      return;
    }

    let isActive = true;

    async function loadBalance() {
      try {
        const balance = await getBalance();

        if (!isActive) {
          return;
        }

        setBalanceStatus({
          amount: balance.balance,
          daysRemaining: balance.days_remaining ?? 0,
          expiresAt: balance.expires_at,
          planType: balance.plan_type,
        });
      } catch (error) {
        if (!isActive || shouldUseMockFallback(error)) {
          return;
        }

        setBalanceStatus(null);
      }
    }

    void loadBalance();

    return () => {
      isActive = false;
    };
  }, []);

  async function handleLogout() {
    try {
      if (!USE_MOCK_DATA) {
        await logoutRequest();
      }
    } catch (error) {
      if (!shouldUseMockFallback(error)) {
        toast.error(error instanceof Error ? error.message : "Logout gagal.");
        return;
      }
    }

    logoutMockAccount();
    router.push("/login");
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden h-dvh border-r border-border bg-sidebar px-3 py-4 transition-[width] duration-300 lg:flex lg:flex-col",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      <div
        className={cn(
          "mb-4 flex items-center gap-2",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        <Link
          href="/"
          className={cn(
            "flex min-w-0 items-center gap-2 rounded-xl px-1",
            isCollapsed && "justify-center"
          )}
          aria-label={APP_NAME}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wallet className="h-5 w-5" />
          </span>
          <span
            className={cn(
              "truncate font-[family-name:var(--font-heading)] text-xl font-bold",
              isCollapsed && "sr-only"
            )}
          >
            {APP_NAME}
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-full"
          onClick={() => onCollapsedChange(!isCollapsed)}
          aria-label={isCollapsed ? "Buka sidebar" : "Tutup sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="min-h-0 flex-1 pr-1">
        <NavigationMenu orientation="vertical" className="w-full">
          <NavigationMenuList className="flex-col items-stretch justify-start">
            {navItems.map((item) => {
              const Icon = dashboardIcons[item.icon as DashboardIconName];
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    active={active}
                    render={<Link href={item.href} />}
                    className={cn(
                      "h-11",
                      isCollapsed ? "justify-center px-0" : "gap-3 px-3"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className={cn(isCollapsed && "sr-only")}>
                      {item.label}
                    </span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </ScrollArea>

      <div
        className={cn(
          "mt-3 rounded-xl border border-border bg-background/60 p-3",
          isCollapsed && "hidden"
        )}
      >
        <p className="text-sm font-semibold">
          {balanceStatus ? "Status Akun" : "DuitKu Pro"}
        </p>
        {balanceStatus ? (
          <>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Plan {balanceStatus.planType} dengan saldo aplikasi Rp
              {Intl.NumberFormat("id-ID").format(balanceStatus.amount)}.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {balanceStatus.daysRemaining > 0
                ? `${balanceStatus.daysRemaining} hari tersisa`
                : balanceStatus.expiresAt
                  ? `Berakhir ${new Date(balanceStatus.expiresAt).toLocaleDateString("id-ID")}`
                  : "Belum ada masa aktif"}
            </p>
          </>
        ) : (
          <>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              18 hari tersisa di trial. Upgrade untuk export dan analitik lengkap.
            </p>
            <Button size="sm" className="mt-3 w-full rounded-full">
              Upgrade
            </Button>
          </>
        )}
      </div>

      <Button
        variant="ghost"
        className={cn(
          "mt-3 shrink-0 text-muted-foreground",
          isCollapsed ? "justify-center px-0" : "justify-start gap-3"
        )}
        onClick={handleLogout}
        title={isCollapsed ? "Keluar" : undefined}
      >
        <LogOut className="h-4 w-4" />
        <span className={cn(isCollapsed && "sr-only")}>Keluar</span>
      </Button>
    </aside>
  );
}

