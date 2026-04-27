import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Progress } from "@/shared/_components/ui/progress";
import { formatRupiah } from "@/shared/_utils/formatters";
import type { BudgetSpendingSummary } from "../_types/budget";

interface BudgetSpendingSummaryCardProps {
  budgetSpendingSummary: BudgetSpendingSummary;
}

export function BudgetSpendingSummaryCard({
  budgetSpendingSummary,
}: BudgetSpendingSummaryCardProps) {
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
              {formatRupiah(budgetSpendingSummary.totalSpent)}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Sisa {formatRupiah(budgetSpendingSummary.totalLimit - budgetSpendingSummary.totalSpent)} dari {formatRupiah(budgetSpendingSummary.totalLimit)}
          </p>
        </div>
        <Progress value={budgetSpendingSummary.utilization} className="mt-4" />
      </CardContent>
    </Card>
  );
}
