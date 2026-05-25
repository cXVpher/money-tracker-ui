"use client";

import { useMemo, useState } from "react";
import type { Budget } from "@/shared/_types/finance";
import { Button } from "@/shared/_components/ui/button";
import { BudgetCard } from "./budget-card";
import { BudgetHistory } from "./budget-history";
import { BudgetSpendingSummaryCard } from "./budget-spending-summary-card";
import { getBudgetSpendingSummary } from "../_utils/budget-spending-summary";

export function BudgetPageContent() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const categoryOptions: any[] = [];
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
        <Button className="rounded-full" disabled>
          Atur Budget
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Budget belum tersedia untuk akun ini.
      </div>

      <BudgetSpendingSummaryCard budgetSpendingSummary={budgetSpendingSummary} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {budgets.length ? budgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        )) : (
          <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
            Belum ada budget aktif.
          </div>
        )}
      </div>

      <BudgetHistory totalSpent={budgetSpendingSummary.totalSpent} />
    </div>
  );
}
