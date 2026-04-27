import { mockBudgets } from "@/shared/_constants/mock-data";
import { BudgetCard } from "./budget-card";
import { BudgetDialog } from "./budget-dialog";
import { BudgetHistory } from "./budget-history";
import { BudgetSpendingSummaryCard } from "./budget-spending-summary-card";
import { getBudgetSpendingSummary } from "../_utils/budget-spending-summary";

export function BudgetPageContent() {
  const budgetSpendingSummary = getBudgetSpendingSummary(mockBudgets);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Kontrol batas pengeluaran bulanan</p>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
            Budget
          </h1>
        </div>
        <BudgetDialog />
      </div>

      <BudgetSpendingSummaryCard budgetSpendingSummary={budgetSpendingSummary} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockBudgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
      </div>

      <BudgetHistory totalSpent={budgetSpendingSummary.totalSpent} />
    </div>
  );
}
