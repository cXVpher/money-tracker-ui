import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Progress } from "@/shared/_components/ui/progress";
import { formatRupiah, formatRupiahShort } from "@/shared/_utils/formatters";
import { getBudgetTone } from "@/features/budgets/_utils/budget-status";
import type { Budget } from "@/features/budgets/_types/budget";

export function BudgetCard({ budget }: { budget: Budget }) {
  const percent = Math.round((budget.spent / budget.limit) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{budget.categoryIcon}</span>
          {budget.categoryName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex items-center justify-between text-sm">
          <span>{formatRupiahShort(budget.spent)}</span>
          <span className={getBudgetTone(percent)}>{percent}%</span>
        </div>
        <Progress value={percent} />
        <p className="mt-3 text-sm text-muted-foreground">
          Sisa {formatRupiah(budget.limit - budget.spent)}
        </p>
      </CardContent>
    </Card>
  );
}
