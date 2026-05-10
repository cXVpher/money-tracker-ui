"use client";

import { useMemo } from "react";
import { AppIcon } from "@/shared/_components/icons/app-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Progress } from "@/shared/_components/ui/progress";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import { formatRupiahShort } from "@/shared/_utils/formatters";
import { getAppBudgets } from "@/shared/_utils/mock-client-store";

export function BudgetOverview() {
  const budgets = useMemo(
    () => (USE_MOCK_DATA ? getAppBudgets().slice(0, 5) : []),
    []
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Bulanan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgets.length ? budgets.map((budget) => {
          const percent = Math.round((budget.spent / budget.limit) * 100);
          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-medium">
                  <AppIcon name={budget.categoryIcon} size={18} />
                  {budget.categoryName}
                </span>
                <span className="text-muted-foreground">{percent}%</span>
              </div>
              <Progress value={percent} />
              <p className="text-xs text-muted-foreground">
                {formatRupiahShort(budget.spent)} dari{" "}
                {formatRupiahShort(budget.limit)}
              </p>
            </div>
          );
        }) : (
          <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            Belum ada budget aktif.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
