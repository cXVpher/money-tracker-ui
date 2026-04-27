"use client";

import { useState } from "react";
import type { Goal } from "@/shared/_types/finance";
import { getAppGoals } from "@/shared/_utils/mock-client-store";
import { GoalCard } from "./goal-card";
import { GoalDialog } from "./goal-dialog";

export function GoalsPageContent() {
  const [goals, setGoals] = useState<Goal[]>(getAppGoals);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Tabungan dengan progres dan deadline</p>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
            Target
          </h1>
        </div>
        <GoalDialog
          onGoalCreated={(goal) =>
            setGoals((currentGoals) => [...currentGoals, goal])
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}
