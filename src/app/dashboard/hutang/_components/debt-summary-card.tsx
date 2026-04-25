import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { formatRupiah } from "@/shared/_utils/formatters";
import type { DebtSummary } from "../_types/debt";

interface DebtSummaryCardProps {
  summary: DebtSummary;
}

export function DebtSummaryCard({ summary }: DebtSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{summary.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`font-[family-name:var(--font-heading)] text-3xl font-bold ${summary.tone}`}>
          {formatRupiah(summary.value)}
        </p>
      </CardContent>
    </Card>
  );
}
