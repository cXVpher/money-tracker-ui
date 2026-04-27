import type { Debt } from "@/shared/_types/finance";
import type { DebtBalanceSummary } from "../_types/debt";

export function getDebtBalanceSummaries(debts: Debt[]): DebtBalanceSummary[] {
  const totalOwedAmount = debts
    .filter((debt) => debt.type === "owed")
    .reduce((sum, debt) => sum + debt.remainingAmount, 0);
  const totalReceivableAmount = debts
    .filter((debt) => debt.type === "receivable")
    .reduce((sum, debt) => sum + debt.remainingAmount, 0);

  return [
    {
      title: "Yang Harus Dibayar",
      toneClass: "text-destructive",
      totalRemainingAmount: totalOwedAmount,
    },
    {
      title: "Piutang Masuk",
      toneClass: "text-success",
      totalRemainingAmount: totalReceivableAmount,
    },
  ];
}

export function getDebtPaidPercent(amount: number, remainingAmount: number) {
  if (amount === 0) {
    return 0;
  }

  return Math.round(((amount - remainingAmount) / amount) * 100);
}
