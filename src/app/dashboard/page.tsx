"use client";

import { useMemo } from "react";
import { Banknote, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { BudgetOverview } from "@/features/dashboard-overview/_components/budget-overview";
import { CashflowChart } from "@/features/dashboard-overview/_components/cashflow-chart";
import { GoalsOverview } from "@/features/dashboard-overview/_components/goals-overview";
import { RecentTransactions } from "@/features/dashboard-overview/_components/recent-transactions";
import { StatCard } from "@/features/dashboard-overview/_components/stat-card";
import { UpcomingBills } from "@/features/dashboard-overview/_components/upcoming-bills";
import { formatRupiah, formatRupiahShort } from "@/shared/_utils/formatters";
import { getAppDashboardSummary } from "@/shared/_utils/mock-client-store";

export default function DashboardPage() {
  const dashboardSummary = useMemo(() => getAppDashboardSummary(), []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Ringkasan April 2026</p>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Saldo"
          value={formatRupiah(dashboardSummary.totalBalance)}
          helper={`${dashboardSummary.accountCount} akun aktif`}
          icon={Banknote}
          badge="+12.5%"
          tone="success"
        />
        <StatCard
          title="Pemasukan"
          value={formatRupiahShort(dashboardSummary.monthlyIncome)}
          helper="Bulan berjalan"
          icon={TrendingUp}
          tone="success"
        />
        <StatCard
          title="Pengeluaran"
          value={formatRupiahShort(dashboardSummary.monthlyExpense)}
          helper="Budget masih terkendali"
          icon={TrendingDown}
          tone="warning"
        />
        <StatCard
          title="Runway Dana Darurat"
          value={`${dashboardSummary.emergencyRunway} bulan`}
          helper="Estimasi biaya hidup"
          icon={PiggyBank}
          badge={dashboardSummary.cashflowStatus}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <CashflowChart />
        <RecentTransactions />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <BudgetOverview />
        <UpcomingBills />
      </div>

      <GoalsOverview />
    </div>
  );
}
