import { mockTransactions } from "@/shared/_constants/mock-data";
import { CalendarGrid } from "./calendar-grid";
import { SelectedDayTransactions } from "./selected-day-transactions";
import { getCalendarDays } from "../_utils/calendar-data";

export function CalendarScreen() {
  const daily = getCalendarDays();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Surplus dan defisit harian</p>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
          Kalender
        </h1>
      </div>

      <CalendarGrid days={daily} />
      <SelectedDayTransactions transactions={mockTransactions.slice(0, 4)} />
    </div>
  );
}
