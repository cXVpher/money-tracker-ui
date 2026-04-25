import { Badge } from "@/shared/_components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { formatRupiahShort } from "@/shared/_utils/formatters";
import { getDailyCashflow } from "@/features/calendar/_utils/calendar-cashflow";
import type { Transaction } from "@/shared/_types/finance";

const days = Array.from({ length: 30 }, (_, index) => index + 1);

export function CashflowCalendar({ transactions }: { transactions: Transaction[] }) {
  const daily = days.map((day) => getDailyCashflow(day, transactions));

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
          {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day) => (
            <div key={day} className="py-2 font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {daily.map((item) => (
            <div
              key={item.day}
              className={
                item.net > 0
                  ? "min-h-24 rounded-lg border border-success/30 bg-success/10 p-2"
                  : item.net < 0
                    ? "min-h-24 rounded-lg border border-destructive/30 bg-destructive/10 p-2"
                    : "min-h-24 rounded-lg border border-border bg-card p-2"
              }
            >
              <p className="text-sm font-semibold">{item.day}</p>
              {item.transactions.length > 0 ? (
                <div className="mt-2 space-y-1 text-left">
                  <p className="text-xs font-medium">
                    {formatRupiahShort(Math.abs(item.net))}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.transactions.length} transaksi
                  </p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
