import type { Budget } from "@/shared/_types/finance";
import type { BudgetSummary, BudgetTone } from "../_types/budget";

export function getBudgetSummary(budgets: Budget[]): BudgetSummary {
  const totalLimit = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);

  return {
    totalLimit,
    totalSpent,
    utilization: totalLimit === 0 ? 0 : Math.round((totalSpent / totalLimit) * 100),
  };
}

export function getBudgetTone(percent: number): BudgetTone {
  if (percent > 90) {
    return "text-destructive";
  }

  if (percent > 70) {
    return "text-warning";
  }

  return "text-success";
}
