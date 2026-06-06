import type { Budget } from "@/shared/_types";
import { AppIcon } from "@/shared/_components/icons/app-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Progress } from "@/shared/_components/ui/progress";
import { Button } from "@/shared/_components/ui/button";
import { formatRupiah, formatRupiahShort } from "@/shared/_utils/formatters";
import { getBudgetTone } from "../_utils/budget-spending-summary";

interface BudgetCardProps {
  budget: Budget;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const percent = Math.round((budget.spent / budget.limit) * 100);
  const tone = getBudgetTone(percent);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-primary"
            style={{ backgroundColor: `${budget.color}1a`, color: budget.color }}
          >
            <AppIcon name={budget.categoryIcon} size={18} weight="fill" />
          </span>
          {budget.categoryName}
        </CardTitle>
        <div className="flex gap-1">
          {onEdit && <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>}
          {onDelete && <Button variant="ghost" size="sm" onClick={onDelete}>Hapus</Button>}
        </div>
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
