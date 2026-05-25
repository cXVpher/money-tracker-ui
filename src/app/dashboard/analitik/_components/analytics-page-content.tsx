"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import {
  type DashboardOverviewData,
  getDashboardOverviewData,
} from "@/shared/_utils/backend-client";
import {
  accountBalanceSeries,
  incomeSourceBreakdown,
  monthOverMonthChangeMetrics,
} from "../_utils/analytics-series";
import { useChartClientReady } from "../_hooks/use-chart-client-ready";
import { BalanceGrowthChart } from "./balance-growth-chart";
import { CashflowChart } from "./cashflow-chart";
import { ChartCard } from "./chart-card";
import { ChartFallback } from "./chart-fallback";
import { ExpenseCategoryChart } from "./expense-category-chart";
import { IncomeSourcesChart } from "./income-sources-chart";
import { MetricCard } from "./metric-card";

export function AnalyticsPageContent() {
  const isChartClientReady = useChartClientReady();
  const [backendOverview, setBackendOverview] =
    useState<DashboardOverviewData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadAnalytics() {
      try {
        const overview = await getDashboardOverviewData();

        if (isActive) {
          setBackendOverview(overview);
          setLoadError(null);
        }
      } catch (error) {
        if (isActive) {
          setBackendOverview(null);
          setLoadError(
            error instanceof Error ? error.message : "Gagal memuat analitik."
          );
        }
      }
    }

    void loadAnalytics();

    return () => {
      isActive = false;
    };
  }, []);

  const cashflowSeries = backendOverview?.cashflowSeries ?? [];
  const incomeSources: any[] = [];
  const balanceSeries: any[] = [];
  const metrics: any[] = [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Grafik dan insight cashflow</p>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
          Analitik
        </h1>
      </div>

      {loadError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {loadError}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Tren Cashflow Bulanan">
          {isChartClientReady ? (
            <CashflowChart cashflowSeries={cashflowSeries} />
          ) : (
            <ChartFallback />
          )}
        </ChartCard>

        <ChartCard title="Expense by Category">
          {isChartClientReady ? <ExpenseCategoryChart /> : <ChartFallback />}
        </ChartCard>

        <ChartCard title="Sumber Pemasukan">
          {isChartClientReady && incomeSources.length ? (
            <IncomeSourcesChart incomeSources={incomeSources} />
          ) : isChartClientReady ? (
            <ChartEmptyState message="Belum ada pemasukan untuk dianalisis." />
          ) : (
            <ChartFallback />
          )}
        </ChartCard>

        <ChartCard title="Pertumbuhan Saldo">
          {isChartClientReady && balanceSeries.length ? (
            <BalanceGrowthChart balanceSeries={balanceSeries} />
          ) : isChartClientReady ? (
            <ChartEmptyState message="Belum ada riwayat saldo." />
          ) : (
            <ChartFallback />
          )}
        </ChartCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Month-over-Month</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {metrics.length ? metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          )) : (
            <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground sm:col-span-3">
              Belum ada perbandingan bulanan.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-lg bg-muted/40 text-sm text-muted-foreground">
      {message}
    </div>
  );
}
