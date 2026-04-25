import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Progress } from "@/shared/_components/ui/progress";
import { formatRupiah } from "@/shared/_utils/formatters";
import type { BudgetSummary } from "../_types/budget";

interface BudgetSummaryCardProps {
  summary: BudgetSummary;
}

export function BudgetSummaryCard({ summary }: BudgetSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ringkasan Budget April</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Terpakai</p>
            <p className="font-[family-name:var(--font-heading)] text-3xl font-bold">
              {formatRupiah(summary.totalSpent)}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Sisa {formatRupiah(summary.totalLimit - summary.totalSpent)} dari {formatRupiah(summary.totalLimit)}
          </p>
        </div>
        <Progress value={summary.utilization} className="mt-4" />
      </CardContent>
    </Card>
  );
}
