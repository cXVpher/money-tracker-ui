"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
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

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Grafik dan insight cashflow</p>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
          Analitik
        </h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Tren Cashflow Bulanan">
          {isChartClientReady ? <CashflowChart /> : <ChartFallback />}
        </ChartCard>

        <ChartCard title="Expense by Category">
          {isChartClientReady ? <ExpenseCategoryChart /> : <ChartFallback />}
        </ChartCard>

        <ChartCard title="Sumber Pemasukan">
          {isChartClientReady ? (
            <IncomeSourcesChart incomeSources={incomeSourceBreakdown} />
          ) : (
            <ChartFallback />
          )}
        </ChartCard>

        <ChartCard title="Pertumbuhan Saldo">
          {isChartClientReady ? (
            <BalanceGrowthChart balanceSeries={accountBalanceSeries} />
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
          {monthOverMonthChangeMetrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
