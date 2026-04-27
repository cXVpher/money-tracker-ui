"use client";

import { useMemo, useState } from "react";
import type { Budget } from "@/shared/_types/finance";
import { BudgetCard } from "./budget-card";
import { BudgetDialog } from "./budget-dialog";
import { BudgetHistory } from "./budget-history";
import { BudgetSpendingSummaryCard } from "./budget-spending-summary-card";
import { getBudgetSpendingSummary } from "../_utils/budget-spending-summary";
import { getAppBudgets, getCategoryOptions } from "@/shared/_utils/mock-client-store";

export function BudgetPageContent() {
  const [budgets, setBudgets] = useState<Budget[]>(getAppBudgets);
  const categoryOptions = useMemo(() => getCategoryOptions(), []);
  const budgetSpendingSummary = useMemo(
    () => getBudgetSpendingSummary(budgets),
    [budgets]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Kontrol batas pengeluaran bulanan</p>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
            Budget
          </h1>
        </div>
        <BudgetDialog
          categoryOptions={categoryOptions}
          onBudgetCreated={(budget) =>
            setBudgets((currentBudgets) => [...currentBudgets, budget])
          }
        />
      </div>

      <BudgetSpendingSummaryCard budgetSpendingSummary={budgetSpendingSummary} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {budgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
      </div>

      <BudgetHistory totalSpent={budgetSpendingSummary.totalSpent} />
    </div>
  );
}
