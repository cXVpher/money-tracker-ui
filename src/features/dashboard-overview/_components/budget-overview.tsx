import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Progress } from "@/shared/_components/ui/progress";
import { formatRupiahShort } from "@/shared/_utils/formatters";
import { mockBudgets } from "@/shared/_constants/mock-data";

export function BudgetOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Bulanan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockBudgets.slice(0, 5).map((budget) => {
          const percent = Math.round((budget.spent / budget.limit) * 100);
          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">
                  {budget.categoryIcon} {budget.categoryName}
                </span>
                <span className="text-muted-foreground">{percent}%</span>
              </div>
              <Progress value={percent} />
              <p className="text-xs text-muted-foreground">
                {formatRupiahShort(budget.spent)} dari{" "}
                {formatRupiahShort(budget.limit)}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
