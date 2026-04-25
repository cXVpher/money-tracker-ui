import { mockTransactions } from "@/shared/_constants/mock-data";
import type { CalendarDaySummary } from "../_types/calendar";

const days = Array.from({ length: 30 }, (_, index) => index + 1);

export function getCalendarDays(): CalendarDaySummary[] {
  return days.map((day) => {
    const date = `2026-04-${String(day).padStart(2, "0")}`;
    const transactions = mockTransactions.filter((item) => item.date === date);
    const income = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);
    const expense = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      date,
      day,
      net: income - expense,
      transactions,
    };
  });
}
