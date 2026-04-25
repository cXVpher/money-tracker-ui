import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatRupiah, formatRupiahShort } from "@/shared/_utils/formatters";
import type { IncomeSourcePoint } from "../_types/analytics";

interface IncomeSourcesChartProps {
  data: IncomeSourcePoint[];
}

export function IncomeSourcesChart({ data }: IncomeSourcesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280} minWidth={0}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickFormatter={(value) => formatRupiahShort(Number(value))} tickLine={false} axisLine={false} />
        <Tooltip formatter={(value) => formatRupiah(Number(value))} />
        <Bar dataKey="value" fill="var(--primary)" radius={6} />
      </BarChart>
    </ResponsiveContainer>
  );
}
