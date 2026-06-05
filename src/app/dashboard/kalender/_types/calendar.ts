import type { Transaction } from "@/shared/_types";

export interface CalendarDaySummary {
  date: string;
  day: number;
  net: number;
  transactions: Transaction[];
}
