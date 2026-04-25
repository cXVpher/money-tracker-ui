import type { Transaction } from "@/shared/_types/finance";

export function getDailyCashflow(day: number, transactions: Transaction[]) {
  const date = `2026-04-${String(day).padStart(2, "0")}`;
  const dailyTransactions = transactions.filter((item) => item.date === date);
  const income = dailyTransactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const expense = dailyTransactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  return { day, transactions: dailyTransactions, net: income - expense };
}
