"use client";

import { useState } from "react";
import { Button } from "@/shared/_components/ui/button";
import type { Goal } from "@/shared/_types/finance";
import { GoalCard } from "./goal-card";

export function GoalsPageContent() {
  const [goals, setGoals] = useState<Goal[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Tabungan dengan progres dan deadline</p>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
            Target
          </h1>
        </div>
        <Button className="rounded-full" disabled>
          Target Baru
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Target tabungan belum tersedia untuk akun ini.
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {goals.length ? goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        )) : (
          <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground md:col-span-2">
            Belum ada target tabungan.
          </div>
        )}
      </div>
    </div>
  );
}
