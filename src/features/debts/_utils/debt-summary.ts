import type { Debt } from "@/features/debts/_types/debt";

export function getDebtTotal(debts: Debt[], type: Debt["type"]) {
  return debts
    .filter((debt) => debt.type === type)
    .reduce((sum, debt) => sum + debt.remainingAmount, 0);
}
