"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Wallet } from "@/shared/_components/icons/phosphor";
import { toast } from "sonner";
import { Button } from "@/shared/_components/ui/button";
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

export function Sidebar() {
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
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-border bg-sidebar px-4 py-5 lg:flex lg:flex-col">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Wallet className="h-5 w-5" />
        </span>
        <span className="font-[family-name:var(--font-heading)] text-xl font-bold">
          {APP_NAME}
        </span>
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = dashboardIcons[item.icon as DashboardIconName];
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                active &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-xl border border-border bg-background/60 p-3">
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
        className="mt-3 justify-start gap-3 text-muted-foreground"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        Keluar
      </Button>
    </aside>
  );
}

