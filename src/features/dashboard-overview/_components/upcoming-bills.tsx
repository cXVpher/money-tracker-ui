import { Badge } from "@/shared/_components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { formatDate, formatRupiah } from "@/shared/_utils/formatters";
import { mockBills } from "@/shared/_constants/mock-data";

export function UpcomingBills() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tagihan Mendatang</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockBills.map((bill) => (
          <div key={bill.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-lg">
              {bill.categoryIcon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{bill.name}</p>
              <p className="text-xs text-muted-foreground">
                Jatuh tempo {formatDate(bill.dueDate)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{formatRupiah(bill.amount)}</p>
              <Badge variant="secondary" className="mt-1 capitalize">
                {bill.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
