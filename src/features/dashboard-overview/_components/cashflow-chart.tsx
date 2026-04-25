"use client";

import { useSyncExternalStore } from "react";
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
import { mockMonthlyCashflow } from "@/shared/_constants/mock-data";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function CashflowChart() {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
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
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={mockMonthlyCashflow} barGap={8}>
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
