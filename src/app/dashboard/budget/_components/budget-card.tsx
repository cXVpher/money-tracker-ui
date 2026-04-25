import type { Budget } from "@/shared/_types/finance";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Progress } from "@/shared/_components/ui/progress";
import { formatRupiah, formatRupiahShort } from "@/shared/_utils/formatters";
import { getBudgetTone } from "../_utils/budget-summary";

interface BudgetCardProps {
  budget: Budget;
}

export function BudgetCard({ budget }: BudgetCardProps) {
  const percent = Math.round((budget.spent / budget.limit) * 100);
  const tone = getBudgetTone(percent);

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
          <span className={tone}>{percent}%</span>
        </div>
        <Progress value={percent} />
        <p className="mt-3 text-sm text-muted-foreground">
          Sisa {formatRupiah(budget.limit - budget.spent)}
        </p>
      </CardContent>
    </Card>
  );
}
