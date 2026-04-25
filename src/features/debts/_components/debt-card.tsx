import { Badge } from "@/shared/_components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Progress } from "@/shared/_components/ui/progress";
import { formatDate, formatRupiah } from "@/shared/_utils/formatters";
import type { Debt } from "@/features/debts/_types/debt";

export function DebtCard({ debt }: { debt: Debt }) {
  const paid = debt.amount - debt.remainingAmount;
  const percent = Math.round((paid / debt.amount) * 100);

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle>{debt.personName}</CardTitle>
          <p className="text-sm text-muted-foreground">{debt.description}</p>
        </div>
        <Badge variant={debt.type === "owed" ? "destructive" : "secondary"}>
          {debt.type === "owed" ? "Hutang" : "Piutang"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex items-center justify-between text-sm">
          <span>Sisa {formatRupiah(debt.remainingAmount)}</span>
          <span>{percent}% lunas</span>
        </div>
        <Progress value={percent} />
        <p className="mt-3 text-sm text-muted-foreground">
          Jatuh tempo {formatDate(debt.dueDate)}
        </p>
      </CardContent>
    </Card>
  );
}
