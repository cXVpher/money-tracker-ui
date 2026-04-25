export type DashboardSummary = {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  cashflow: number;
  cashflowStatus: "surplus" | "deficit";
  totalBudgetUsed: number;
  totalBudgetLimit: number;
  emergencyRunway: number;
  accountCount: number;
};
