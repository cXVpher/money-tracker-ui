import type { Debt } from "@/features/debts/_types/debt";

export function getDebtRemainingTotal(
  debts: Debt[],
  debtType: Debt["type"]
) {
  return debts
    .filter((debt) => debt.type === debtType)
    .reduce((sum, debt) => sum + debt.remainingAmount, 0);
}
