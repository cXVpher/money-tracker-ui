import type { Goal } from "@/shared/_types/finance";
import type { GoalProgress } from "../_types/goal";

export function getGoalProgress(goal: Goal): GoalProgress {
  const percent = Math.round((goal.currentAmount / goal.targetAmount) * 100);

  return {
    percent,
    remainingAmount: goal.targetAmount - goal.currentAmount,
  };
}
