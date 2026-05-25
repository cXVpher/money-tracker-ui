"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatRupiah } from "@/features/analytics/_utils/chart-formatters";

export function ExpenseCategoryChart() {
  const expenseCategorySeries: any[] = [];

  if (!expenseCategorySeries.length) {
    return (
      <div className="flex h-[280px] items-center justify-center rounded-lg bg-muted/40 text-sm text-muted-foreground">
        Belum ada kategori pengeluaran.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280} minWidth={0}>
      <PieChart>
        <Pie data={expenseCategorySeries} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105} paddingAngle={3}>
          {expenseCategorySeries.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatRupiah(Number(value))} />
      </PieChart>
    </ResponsiveContainer>
  );
}
