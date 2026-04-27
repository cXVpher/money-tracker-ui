import { mockGoals } from "@/shared/_constants/mock-data";
import { GoalCard } from "./goal-card";
import { GoalDialog } from "./goal-dialog";

export function GoalsPageContent() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Tabungan dengan progres dan deadline</p>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
            Target
          </h1>
        </div>
        <GoalDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mockGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}
