import type { Transaction } from "@/shared/_types/finance";
import type { CalendarDaySummary } from "../_types/calendar";

const calendarDayNumbers = Array.from({ length: 30 }, (_, index) => index + 1);

export function buildCalendarDaySummaries(
  transactions: Transaction[]
): CalendarDaySummary[] {
  return calendarDayNumbers.map((day) => {
    const date = `2026-04-${String(day).padStart(2, "0")}`;
    const dayTransactions = transactions.filter(
      (transaction) => transaction.date === date
    );
    const income = dayTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((incomeTotal, transaction) => incomeTotal + transaction.amount, 0);
    const expense = dayTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (expenseTotal, transaction) => expenseTotal + transaction.amount,
        0
      );

    return {
      date,
      day,
      net: income - expense,
      transactions: dayTransactions,
    };
  });
}
