"use client";

import { useMemo, useState } from "react";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import { getAppTransactions } from "@/shared/_utils/mock-client-store";
import { CalendarGrid } from "./calendar-grid";
import { SelectedDayTransactions } from "./selected-day-transactions";
import { buildCalendarDaySummaries } from "../_utils/calendar-day-summaries";
import type { CalendarDaySummary } from "../_types/calendar";

export function CalendarPageContent() {
  const calendarDaySummaries = useMemo(
    () => buildCalendarDaySummaries(USE_MOCK_DATA ? getAppTransactions() : []),
    []
  );
  const initialSelectedDay =
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

      {!USE_MOCK_DATA ? (
        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Belum ada transaksi untuk ditampilkan di kalender.
        </div>
      ) : null}

      <CalendarGrid
        days={calendarDaySummaries}
        selectedDate={selectedDay.date}
        onSelectDay={setSelectedDay}
      />
      <SelectedDayTransactions selectedDay={selectedDay} />
    </div>
  );
}
