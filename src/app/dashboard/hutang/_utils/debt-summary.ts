import type { Debt } from "@/shared/_types/finance";
import type { DebtSummary } from "../_types/debt";

export function getDebtSummaries(debts: Debt[]): DebtSummary[] {
  const owed = debts
    .filter((debt) => debt.type === "owed")
    .reduce((sum, debt) => sum + debt.remainingAmount, 0);
  const receivable = debts
    .filter((debt) => debt.type === "receivable")
    .reduce((sum, debt) => sum + debt.remainingAmount, 0);

  return [
    { title: "Yang Harus Dibayar", tone: "text-destructive", value: owed },
    { title: "Piutang Masuk", tone: "text-success", value: receivable },
  ];
}

export function getDebtPaidPercent(amount: number, remainingAmount: number) {
  if (amount === 0) {
    return 0;
  }

  return Math.round(((amount - remainingAmount) / amount) * 100);
}
