export interface BudgetSpendingSummary {
  totalLimit: number;
  totalSpent: number;
  utilization: number;
}

export type BudgetTone = "text-destructive" | "text-success" | "text-warning";
