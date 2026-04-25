import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { formatRupiah } from "@/shared/_utils/formatters";

export function DebtSummaryCard({ title, value, tone }: { title: string; value: number; tone: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`font-[family-name:var(--font-heading)] text-3xl font-bold ${tone}`}>
          {formatRupiah(value)}
        </p>
      </CardContent>
    </Card>
  );
}
