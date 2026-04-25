import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Badge } from "@/shared/_components/ui/badge";
import type { CalendarDaySummary } from "../_types/calendar";
import { CalendarDayCard } from "./calendar-day-card";

const weekDays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

interface CalendarGridProps {
  days: CalendarDaySummary[];
}

export function CalendarGrid({ days }: CalendarGridProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>April 2026</CardTitle>
        <div className="flex gap-2">
          <Badge variant="secondary">Hijau surplus</Badge>
          <Badge variant="destructive">Merah defisit</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
          {weekDays.map((day) => (
            <div key={day} className="py-2 font-medium">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <CalendarDayCard key={day.date} day={day} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
