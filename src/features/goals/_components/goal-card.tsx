import { AppIcon } from "@/shared/_components/icons/app-icon";
import { Button } from "@/shared/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Progress } from "@/shared/_components/ui/progress";
import { formatDate, formatRupiah } from "@/shared/_utils/formatters";
import { getGoalProgress } from "@/features/goals/_utils/goal-progress";
import type { Goal } from "@/features/goals/_types/goal";

export function GoalCard({ goal }: { goal: Goal }) {
  const percent = getGoalProgress(goal.currentAmount, goal.targetAmount);

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-xl">
            <AppIcon name={goal.icon} size={22} />
          </span>
          <div>
            <CardTitle>{goal.name}</CardTitle>
            <p className="text-xs text-muted-foreground">
              Deadline {formatDate(goal.deadline)}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Kontribusi
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex items-center justify-between text-sm">
          <span>{formatRupiah(goal.currentAmount)}</span>
          <span>{percent}%</span>
        </div>
        <Progress value={percent} />
        <p className="mt-3 text-sm text-muted-foreground">
          Target {formatRupiah(goal.targetAmount)}
        </p>
      </CardContent>
    </Card>
  );
}
