import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatRupiah, formatRupiahShort } from "@/shared/_utils/formatters";
import type { AnalyticsSeriesPoint } from "../_types/analytics";

interface BalanceGrowthChartProps {
  balanceSeries: AnalyticsSeriesPoint[];
}

export function BalanceGrowthChart({ balanceSeries }: BalanceGrowthChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280} minWidth={0}>
      <AreaChart data={balanceSeries}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickFormatter={(value) => formatRupiahShort(Number(value))} tickLine={false} axisLine={false} />
        <Tooltip formatter={(value) => formatRupiah(Number(value))} />
        <Area type="monotone" dataKey="balance" name="Saldo" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.22} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
