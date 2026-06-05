"use client";

import type { Budget } from "@/shared/_types";
import { apiRequest } from "@/shared/_utils/api-client";

type BackendBudget = {
  id: string;
  user_id: string;
  kategori: string;
  limit: number;
  month: string;
  spent: number;
  created_at: string;
  updated_at: string;
};

export type CreateBudgetInput = {
  kategori: string;
  limit: number;
  month: string; // YYYY-MM
};

export type UpdateBudgetInput = {
  id: string;
  limit: number;
};

function getMetadataForCategory(name: string) {
  const norm = name.trim().toLowerCase();
  if (norm.includes("makan")) return { icon: "food", color: "#FF5722" };
  if (norm.includes("transport")) return { icon: "transport", color: "#2196F3" };
  if (norm.includes("tagihan")) return { icon: "bills", color: "#FF9800" };
  if (norm.includes("belanja")) return { icon: "shopping", color: "#9C27B0" };
  if (norm.includes("masuk") || norm.includes("gaji") || norm.includes("salary")) return { icon: "salary", color: "#4CAF50" };
  return { icon: "other", color: "#607D8B" };
}

function mapBackendBudget(budget: BackendBudget): Budget {
  const meta = getMetadataForCategory(budget.kategori);
  return {
    id: budget.id,
    categoryName: budget.kategori,
    categoryIcon: meta.icon,
    limit: budget.limit,
    spent: budget.spent,
    color: meta.color,
  };
}

export async function getBudgets(month?: string) {
  const path = month ? `/budgets?month=${encodeURIComponent(month)}` : "/budgets";
  const budgets = await apiRequest<BackendBudget[]>(path);
  return (budgets ?? []).map(mapBackendBudget);
}

export async function createBudget(input: CreateBudgetInput) {
  const budget = await apiRequest<BackendBudget>("/budgets", {
    body: JSON.stringify({
      kategori: input.kategori.trim(),
      limit: input.limit,
      month: input.month,
    }),
    method: "POST",
  });

  return mapBackendBudget(budget);
}

export async function updateBudget(input: UpdateBudgetInput) {
  const budget = await apiRequest<BackendBudget>(`/budgets/${input.id}`, {
    body: JSON.stringify({
      limit: input.limit,
    }),
    method: "PUT",
  });

  return mapBackendBudget(budget);
}

export async function deleteBudget(id: string) {
  return apiRequest<null>(`/budgets/${id}`, {
    method: "DELETE",
  });
}
