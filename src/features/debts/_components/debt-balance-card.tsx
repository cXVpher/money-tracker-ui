import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { formatRupiah } from "@/shared/_utils/formatters";

export function DebtBalanceCard({
  title,
  totalAmount,
  toneClass,
}: {
  title: string;
  totalAmount: number;
  toneClass: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`font-[family-name:var(--font-heading)] text-3xl font-bold ${toneClass}`}>
          {formatRupiah(totalAmount)}
        </p>
      </CardContent>
    </Card>
  );
}
