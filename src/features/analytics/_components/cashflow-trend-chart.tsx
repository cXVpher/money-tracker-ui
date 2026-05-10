"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import { formatRupiah, formatRupiahShort } from "@/features/analytics/_utils/chart-formatters";
import { getMonthlyCashflowSeries } from "@/shared/_utils/mock-client-store";

export function CashflowTrendChart() {
  const cashflowSeries = useMemo(
    () => (USE_MOCK_DATA ? getMonthlyCashflowSeries() : []),
    []
  );

  if (!cashflowSeries.length) {
    return (
      <div className="flex h-[280px] items-center justify-center rounded-lg bg-muted/40 text-sm text-muted-foreground">
        Belum ada riwayat cashflow.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280} minWidth={0}>
      <AreaChart data={cashflowSeries}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickFormatter={(value) => formatRupiahShort(Number(value))} tickLine={false} axisLine={false} />
        <Tooltip formatter={(value) => formatRupiah(Number(value))} />
        <Area type="monotone" dataKey="income" name="Pemasukan" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2} />
        <Area type="monotone" dataKey="expense" name="Pengeluaran" stroke="var(--warning)" fill="var(--warning)" fillOpacity={0.18} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
