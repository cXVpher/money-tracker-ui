"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatRupiah, formatRupiahShort } from "@/shared/_utils/formatters";

type CashflowChartProps = {
  cashflowSeries?: Array<{
    expense: number;
    income: number;
    month: string;
  }>;
};

export function CashflowChart({ cashflowSeries: providedSeries }: CashflowChartProps) {
  const cashflowSeries = useMemo(
    () => providedSeries ?? [],
    [providedSeries]
  );

  if (!cashflowSeries.length) {
    return <EmptyChartState message="Belum ada riwayat cashflow." />;
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

function EmptyChartState({ message }: { message: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-lg bg-muted/40 text-sm text-muted-foreground">
      {message}
    </div>
  );
}
