import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatRupiah, formatRupiahShort } from "@/shared/_utils/formatters";
import type { IncomeSourceDatum } from "../_types/analytics";

interface IncomeSourcesChartProps {
  incomeSources: IncomeSourceDatum[];
}

export function IncomeSourcesChart({ incomeSources }: IncomeSourcesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280} minWidth={0}>
      <BarChart data={incomeSources}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickFormatter={(value) => formatRupiahShort(Number(value))} tickLine={false} axisLine={false} />
        <Tooltip formatter={(value) => formatRupiah(Number(value))} />
        <Bar dataKey="amount" fill="var(--primary)" radius={6} />
      </BarChart>
    </ResponsiveContainer>
  );
}
