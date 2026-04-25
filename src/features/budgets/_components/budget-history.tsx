import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { formatRupiahShort } from "@/shared/_utils/formatters";

export function BudgetHistory({ totalSpent }: { totalSpent: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Perbandingan Historis</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        {["Februari", "Maret", "April"].map((month, index) => (
          <div key={month} className="rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">{month}</p>
            <p className="mt-1 text-xl font-bold">
              {formatRupiahShort(totalSpent - (2 - index) * 420_000)}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
