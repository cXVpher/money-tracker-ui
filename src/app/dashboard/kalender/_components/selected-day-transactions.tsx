import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { formatRupiahShort } from "@/shared/_utils/formatters";
import type { Transaction } from "@/shared/_types/finance";

interface SelectedDayTransactionsProps {
  transactions: Transaction[];
}

export function SelectedDayTransactions({ transactions }: SelectedDayTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaksi Hari Terpilih</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-lg border border-border p-3">
            <span className="text-sm">{item.categoryIcon} {item.description}</span>
            <span className="text-sm font-semibold">{formatRupiahShort(item.amount)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
