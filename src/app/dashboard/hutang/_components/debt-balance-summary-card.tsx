import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { formatRupiah } from "@/shared/_utils/formatters";
import type { DebtBalanceSummary } from "../_types/debt";

interface DebtBalanceSummaryCardProps {
  debtBalanceSummary: DebtBalanceSummary;
}

export function DebtBalanceSummaryCard({
  debtBalanceSummary,
}: DebtBalanceSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{debtBalanceSummary.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`font-[family-name:var(--font-heading)] text-3xl font-bold ${debtBalanceSummary.toneClass}`}>
          {formatRupiah(debtBalanceSummary.totalRemainingAmount)}
        </p>
      </CardContent>
    </Card>
  );
}
