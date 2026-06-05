"use client";

import type { Goal } from "@/shared/_types";
import { apiRequest } from "@/shared/_utils/api-client";

type BackendGoal = {
  color: string;
  created_at: string;
  current_amount: number;
  deadline: string;
  icon: string;
  id: string;
  name: string;
  status: "active" | "achieved";
  target_amount: number;
  updated_at: string;
  user_id: string;
};

export type CreateGoalInput = {
  color: string;
  deadline: string;
  icon: string;
  name: string;
  targetAmount: number;
};

export type UpdateGoalInput = CreateGoalInput & {
  id: string;
};

function mapBackendGoal(goal: BackendGoal): Goal {
  return {
    color: goal.color,
    currentAmount: goal.current_amount,
    deadline: goal.deadline,
    icon: goal.icon,
    id: goal.id,
    name: goal.name,
    targetAmount: goal.target_amount,
  };
}

export async function getGoals() {
  const goals = await apiRequest<BackendGoal[]>("/goals");
  return (goals ?? []).map(mapBackendGoal);
}

export async function createGoal(input: CreateGoalInput) {
  const goal = await apiRequest<BackendGoal>("/goals", {
    body: JSON.stringify({
      color: input.color,
      deadline: input.deadline,
      icon: input.icon,
      name: input.name.trim(),
      target_amount: input.targetAmount,
    }),
    method: "POST",
  });

  return mapBackendGoal(goal);
}

export async function updateGoal(input: UpdateGoalInput) {
  const goal = await apiRequest<BackendGoal>(`/goals/${input.id}`, {
    body: JSON.stringify({
      color: input.color,
      deadline: input.deadline,
      icon: input.icon,
      name: input.name.trim(),
      target_amount: input.targetAmount,
    }),
    method: "PUT",
  });

  return mapBackendGoal(goal);
}

export async function contributeGoal(input: { amount: number; id: string }) {
  const goal = await apiRequest<BackendGoal>(`/goals/${input.id}/contribute`, {
    body: JSON.stringify({ amount: input.amount }),
    method: "POST",
  });

  return mapBackendGoal(goal);
}

export async function deleteGoal(id: string) {
  return apiRequest<null>(`/goals/${id}`, {
    method: "DELETE",
  });
}
