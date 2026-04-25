"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatRupiah } from "@/features/analytics/_utils/chart-formatters";
import { mockExpenseByCategory } from "@/shared/_constants/mock-data";

export function ExpenseCategoryChart() {
  return (
    <ResponsiveContainer width="100%" height={280} minWidth={0}>
      <PieChart>
        <Pie data={mockExpenseByCategory} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105} paddingAngle={3}>
          {mockExpenseByCategory.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatRupiah(Number(value))} />
      </PieChart>
    </ResponsiveContainer>
  );
}
