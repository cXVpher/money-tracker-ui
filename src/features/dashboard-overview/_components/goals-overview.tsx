"use client";

import { useMemo } from "react";
import { AppIcon } from "@/shared/_components/icons/app-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Progress } from "@/shared/_components/ui/progress";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import { formatDate, formatRupiahShort } from "@/shared/_utils/formatters";
import { getAppGoals } from "@/shared/_utils/mock-client-store";

export function GoalsOverview() {
  const goals = useMemo(
    () => (USE_MOCK_DATA ? getAppGoals().slice(0, 4) : []),
    []
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Target Tabungan</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {goals.length ? goals.map((goal) => {
          const percent = Math.round(
            (goal.currentAmount / goal.targetAmount) * 100
          );
          return (
            <div key={goal.id} className="rounded-lg border border-border p-3">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-lg">
                  <AppIcon name={goal.icon} size={20} />
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
        }) : (
          <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground sm:col-span-2">
            Belum ada target tabungan.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
