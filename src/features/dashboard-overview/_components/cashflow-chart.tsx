"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { formatRupiahShort } from "@/shared/_utils/formatters";
import { getMonthlyCashflowSeries } from "@/shared/_utils/mock-client-store";

const subscribeToMountState = () => () => {};
const getMountedClientSnapshot = () => true;
const getUnmountedServerSnapshot = () => false;

type CashflowChartProps = {
  cashflowSeries?: Array<{
    expense: number;
    income: number;
    month: string;
  }>;
};

export function CashflowChart({ cashflowSeries: providedSeries }: CashflowChartProps) {
  const cashflowSeries = useMemo(
    () => providedSeries ?? getMonthlyCashflowSeries(),
    [providedSeries]
  );
  const isMounted = useSyncExternalStore(
    subscribeToMountState,
    getMountedClientSnapshot,
    getUnmountedServerSnapshot
  );

  return (
    <Card className="min-h-[360px]">
      <CardHeader>
        <CardTitle>Income vs Expense</CardTitle>
        <p className="text-sm text-muted-foreground">
          Perbandingan pemasukan dan pengeluaran enam bulan terakhir.
        </p>
      </CardHeader>
      <CardContent className="h-[260px]">
        {!cashflowSeries.length ? (
          <div className="flex h-full items-center justify-center rounded-lg bg-muted/40 text-sm text-muted-foreground">
            Belum ada data cashflow untuk ditampilkan.
          </div>
        ) : isMounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={cashflowSeries} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis
                tickFormatter={(value) => formatRupiahShort(Number(value))}
                tickLine={false}
                axisLine={false}
                width={58}
              />
              <Tooltip
                formatter={(value) => formatRupiah(Number(value))}
                cursor={{ fill: "var(--accent)" }}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="income" name="Pemasukan" fill="var(--primary)" radius={6} />
              <Bar dataKey="expense" name="Pengeluaran" fill="var(--warning)" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full rounded-lg bg-muted/40" />
        )}
      </CardContent>
    </Card>
  );
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
