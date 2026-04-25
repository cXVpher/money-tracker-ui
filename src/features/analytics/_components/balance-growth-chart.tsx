"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatRupiah, formatRupiahShort } from "@/features/analytics/_utils/chart-formatters";

const accountGrowth = [
  { month: "Nov", balance: 14_500_000 },
  { month: "Des", balance: 16_800_000 },
  { month: "Jan", balance: 19_200_000 },
  { month: "Feb", balance: 21_450_000 },
  { month: "Mar", balance: 23_100_000 },
  { month: "Apr", balance: 24_150_000 },
];

export function BalanceGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={280} minWidth={0}>
      <AreaChart data={accountGrowth}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickFormatter={(value) => formatRupiahShort(Number(value))} tickLine={false} axisLine={false} />
        <Tooltip formatter={(value) => formatRupiah(Number(value))} />
        <Area type="monotone" dataKey="balance" name="Saldo" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.22} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
