"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatRupiah, formatRupiahShort } from "@/shared/_utils/formatters";
import { getMonthlyCashflowSeries } from "@/shared/_utils/mock-client-store";

export function CashflowChart() {
  const cashflowSeries = useMemo(() => getMonthlyCashflowSeries(), []);

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
