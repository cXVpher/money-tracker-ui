"use client";

import { useEffect, useMemo, useState } from "react";
import { Banknote, PiggyBank, TrendingDown, TrendingUp } from "@/shared/_components/icons/phosphor";
import { BudgetOverview } from "@/features/dashboard-overview/_components/budget-overview";
import { CashflowChart } from "@/features/dashboard-overview/_components/cashflow-chart";
import { GoalsOverview } from "@/features/dashboard-overview/_components/goals-overview";
import { RecentTransactions } from "@/features/dashboard-overview/_components/recent-transactions";
import { StatCard } from "@/features/dashboard-overview/_components/stat-card";
import { UpcomingBills } from "@/features/dashboard-overview/_components/upcoming-bills";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import { ApiClientError, shouldUseMockFallback } from "@/shared/_utils/api-client";
import { formatRupiah, formatRupiahShort } from "@/shared/_utils/formatters";
import {
  type DashboardOverviewData,
  getDashboardOverviewData,
} from "@/shared/_utils/backend-client";
import { getAppDashboardSummary } from "@/shared/_utils/mock-client-store";

export default function DashboardPage() {
  const mockSummary = useMemo(() => getAppDashboardSummary(), []);
  const [backendOverview, setBackendOverview] =
    useState<DashboardOverviewData | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      return;
    }

    let isActive = true;

    async function loadOverview() {
      try {
        const overview = await getDashboardOverviewData();
        if (isActive) {
          setBackendOverview(overview);
          setBackendError(null);
          setFallbackNotice(null);
        }
      } catch (error) {
        if (isActive) {
          if (shouldUseMockFallback(error)) {
            setBackendOverview(null);
            setFallbackNotice(
              "API dashboard belum aktif. Menampilkan ringkasan mock sementara."
            );
            return;
          }

          setBackendError(
            error instanceof ApiClientError
              ? error.message
              : "Gagal memuat ringkasan dashboard."
          );
        }
      }
    }

    void loadOverview();

    return () => {
      isActive = false;
    };
  }, []);

  const isUsingBackendData = !USE_MOCK_DATA && backendOverview !== null;
  const backendSummary = backendOverview?.summary ?? null;
  const dashboardPeriodLabel = isUsingBackendData
    ? backendSummary?.month ?? new Date().toISOString().slice(0, 7)
    : "April 2026";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Ringkasan {dashboardPeriodLabel}
        </p>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
      </div>

      {backendError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {backendError}
        </div>
      ) : null}
      {fallbackNotice ? (
        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          {fallbackNotice}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isUsingBackendData && backendSummary ? (
          <>
            <StatCard
              title="Saldo Periode"
              value={formatRupiah(backendSummary.saldo)}
              helper={`${backendSummary.totalTransactions} transaksi bulan ini`}
              icon={Banknote}
              tone="success"
            />
            <StatCard
              title="Pemasukan"
              value={formatRupiahShort(backendSummary.totalIn)}
              helper="Bulan berjalan"
              icon={TrendingUp}
              tone="success"
            />
            <StatCard
              title="Pengeluaran"
              value={formatRupiahShort(backendSummary.totalOut)}
              helper={`Bulan lalu ${formatRupiahShort(backendSummary.prevMonthOut)}`}
              icon={TrendingDown}
              tone="warning"
            />
            <StatCard
              title="Perubahan Pengeluaran"
              value={`${backendSummary.changePercent}%`}
              helper="Dibanding bulan lalu"
              icon={PiggyBank}
              badge={backendSummary.changePercent > 0 ? "naik" : "stabil"}
              tone={backendSummary.changePercent > 0 ? "danger" : "default"}
            />
          </>
        ) : (
          <>
            <StatCard
              title="Total Saldo"
              value={formatRupiah(mockSummary.totalBalance)}
              helper={`${mockSummary.accountCount} akun aktif`}
              icon={Banknote}
              badge="+12.5%"
              tone="success"
            />
            <StatCard
              title="Pemasukan"
              value={formatRupiahShort(mockSummary.monthlyIncome)}
              helper="Bulan berjalan"
              icon={TrendingUp}
              tone="success"
            />
            <StatCard
              title="Pengeluaran"
              value={formatRupiahShort(mockSummary.monthlyExpense)}
              helper="Budget masih terkendali"
              icon={TrendingDown}
              tone="warning"
            />
            <StatCard
              title="Runway Dana Darurat"
              value={`${mockSummary.emergencyRunway} bulan`}
              helper="Estimasi biaya hidup"
              icon={PiggyBank}
              badge={mockSummary.cashflowStatus}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <CashflowChart
          cashflowSeries={
            isUsingBackendData ? (backendOverview?.cashflowSeries ?? []) : undefined
          }
        />
        <RecentTransactions
          transactions={
            isUsingBackendData ? (backendOverview?.recentTransactions ?? []) : undefined
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <BudgetOverview />
        <UpcomingBills />
      </div>

      <GoalsOverview />
    </div>
  );
}

