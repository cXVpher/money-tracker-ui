import { formatRupiahShort } from "@/shared/_utils/formatters";
import type { CalendarDaySummary } from "../_types/calendar";

interface CalendarDayCardProps {
  day: CalendarDaySummary;
}

export function CalendarDayCard({ day }: CalendarDayCardProps) {
  const toneClass =
    day.net > 0
      ? "min-h-24 rounded-lg border border-success/30 bg-success/10 p-2"
      : day.net < 0
        ? "min-h-24 rounded-lg border border-destructive/30 bg-destructive/10 p-2"
        : "min-h-24 rounded-lg border border-border bg-card p-2";

  return (
    <div className={toneClass}>
      <p className="text-sm font-semibold">{day.day}</p>
      {day.transactions.length > 0 ? (
        <div className="mt-2 space-y-1 text-left">
          <p className="text-xs font-medium">{formatRupiahShort(Math.abs(day.net))}</p>
          <p className="text-[11px] text-muted-foreground">
            {day.transactions.length} transaksi
          </p>
        </div>
      ) : null}
    </div>
  );
}
