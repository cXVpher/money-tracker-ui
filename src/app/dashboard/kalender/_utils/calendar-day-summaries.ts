import type { Transaction } from "@/shared/_types";
import type { CalendarDaySummary } from "../_types/calendar";

export function buildCalendarDaySummaries(
  transactions: Transaction[],
  month = formatLocalMonth(new Date())
): CalendarDaySummary[] {
  const [year, monthNumber] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  const calendarDayNumbers = Array.from(
    { length: daysInMonth },
    (_, index) => index + 1
  );

  return calendarDayNumbers.map((day) => {
    const date = `${month}-${String(day).padStart(2, "0")}`;
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

function formatLocalMonth(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
