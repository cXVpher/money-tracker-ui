"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatRupiah, formatRupiahShort } from "@/features/analytics/_utils/chart-formatters";
import { mockMonthlyCashflow } from "@/shared/_constants/mock-data";

export function CashflowTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={280} minWidth={0}>
      <AreaChart data={mockMonthlyCashflow}>
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
