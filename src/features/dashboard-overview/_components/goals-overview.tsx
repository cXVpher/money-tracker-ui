import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Progress } from "@/shared/_components/ui/progress";
import { formatDate, formatRupiahShort } from "@/shared/_utils/formatters";
import { mockGoals } from "@/shared/_constants/mock-data";

export function GoalsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Target Tabungan</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {mockGoals.slice(0, 4).map((goal) => {
          const percent = Math.round(
            (goal.currentAmount / goal.targetAmount) * 100
          );
          return (
            <div key={goal.id} className="rounded-lg border border-border p-3">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-lg">
                  {goal.icon}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{goal.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Deadline {formatDate(goal.deadline)}
                  </p>
                </div>
              </div>
              <Progress value={percent} />
              <p className="mt-2 text-xs text-muted-foreground">
                {formatRupiahShort(goal.currentAmount)} dari{" "}
                {formatRupiahShort(goal.targetAmount)}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
