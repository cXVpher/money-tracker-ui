import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { formatDate, formatRupiahShort } from "@/shared/_utils/formatters";
import type { CalendarDaySummary } from "../_types/calendar";

interface SelectedDayTransactionsProps {
  selectedDay: CalendarDaySummary;
}

export function SelectedDayTransactions({
  selectedDay,
}: SelectedDayTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaksi {formatDate(selectedDay.date)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {selectedDay.transactions.length > 0 ? (
          selectedDay.transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <span className="text-sm">
                {transaction.categoryIcon} {transaction.description}
              </span>
              <span className="text-sm font-semibold">
                {formatRupiahShort(transaction.amount)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Tidak ada transaksi pada hari ini.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
