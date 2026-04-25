"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatRupiah, formatRupiahShort } from "@/features/analytics/_utils/chart-formatters";

const incomeSources = [
  { name: "Gaji", value: 12_000_000 },
  { name: "Freelance", value: 3_500_000 },
  { name: "Lainnya", value: 500_000 },
];

export function IncomeSourceChart() {
  return (
    <ResponsiveContainer width="100%" height={280} minWidth={0}>
      <BarChart data={incomeSources}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickFormatter={(value) => formatRupiahShort(Number(value))} tickLine={false} axisLine={false} />
        <Tooltip formatter={(value) => formatRupiah(Number(value))} />
        <Bar dataKey="value" fill="var(--primary)" radius={6} />
      </BarChart>
    </ResponsiveContainer>
  );
}
