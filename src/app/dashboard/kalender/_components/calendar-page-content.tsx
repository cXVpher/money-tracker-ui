"use client";

import { useMemo, useState } from "react";
import { CalendarGrid } from "./calendar-grid";
import { SelectedDayTransactions } from "./selected-day-transactions";
import { buildCalendarDaySummaries } from "../_utils/calendar-day-summaries";
import type { CalendarDaySummary } from "../_types/calendar";

export function CalendarPageContent() {
  const today = useMemo(() => new Date(), []);
  const currentMonth = useMemo(() => formatLocalMonth(today), [today]);
  const todayDate = useMemo(() => formatLocalDate(today), [today]);
  const monthLabel = useMemo(
    () =>
      today.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      }),
    [today]
  );
  const calendarDaySummaries = useMemo(
    () => buildCalendarDaySummaries([], currentMonth),
    [currentMonth]
  );
  const initialSelectedDay =
    calendarDaySummaries.find((day) => day.date === todayDate) ??
    calendarDaySummaries.find((day) => day.transactions.length > 0) ??
    calendarDaySummaries[0];
  const [selectedDay, setSelectedDay] = useState<CalendarDaySummary>(
    initialSelectedDay
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Surplus dan defisit harian</p>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
          Kalender
        </h1>
      </div>

      <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Belum ada transaksi untuk ditampilkan di kalender.
      </div>

      <CalendarGrid
        days={calendarDaySummaries}
        monthLabel={monthLabel}
        selectedDate={selectedDay.date}
        onSelectDay={setSelectedDay}
      />
      <SelectedDayTransactions selectedDay={selectedDay} />
    </div>
  );
}

function formatLocalMonth(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatLocalDate(date: Date) {
  return `${formatLocalMonth(date)}-${String(date.getDate()).padStart(2, "0")}`;
}
