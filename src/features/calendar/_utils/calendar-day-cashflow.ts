import type { Transaction } from "@/shared/_types/finance";

export function getCalendarDayCashflow(day: number, transactions: Transaction[]) {
  const date = `2026-04-${String(day).padStart(2, "0")}`;
  const dayTransactions = transactions.filter((transaction) => transaction.date === date);
  const income = dayTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expense = dayTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return { day, transactions: dayTransactions, net: income - expense };
}
