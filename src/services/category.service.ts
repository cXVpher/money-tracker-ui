"use client";

import type { AppIconName } from "@/shared/_components/icons/app-icon";
import { apiRequest } from "@/shared/_utils/api-client";

export type TransactionCategory = {
  color: string;
  description: string;
  displayIcon: string;
  icon: AppIconName;
  id: string;
  isDefault: boolean;
  name: string;
};

type BackendCategory = {
  color: string;
  created_at: string;
  description: string;
  icon: string;
  id: string;
  is_default: boolean;
  name: string;
  user_id: string;
};

export type CreateCategoryInput = {
  color: string;
  description?: string;
  icon: string;
  name: string;
};

export type UpdateCategoryInput = {
  color: string;
  description: string;
  icon: string;
  id: string;
};

const categoryIconByName: Record<string, AppIconName> = {
  Belanja: "shopping",
  Lainnya: "other",
  Makan: "food",
  Pemasukan: "salary",
  Tagihan: "bills",
  Transport: "transport",
};

const validAppIcons = new Set([
  "bank",
  "bills",
  "bonus",
  "cash",
  "credit_card",
  "education",
  "entertainment",
  "food",
  "freelance",
  "groceries",
  "health",
  "internet",
  "investment",
  "mobile",
  "other",
  "salary",
  "shield",
  "shopping",
  "target",
  "transport",
  "travel",
]);

const displayIconByAppIcon: Record<AppIconName, string> = {
  bank: "🏦",
  bills: "💡",
  bonus: "🎁",
  cash: "💵",
  credit_card: "💳",
  education: "🎓",
  entertainment: "🎮",
  food: "🍽️",
  freelance: "💼",
  groceries: "🛒",
  health: "💊",
  internet: "🌐",
  investment: "📈",
  mobile: "📱",
  other: "📌",
  salary: "💰",
  shield: "🛡️",
  shopping: "🛍️",
  target: "🎯",
  transport: "🚗",
  travel: "✈️",
};

function normalizeIcon(category: BackendCategory): AppIconName {
  if (validAppIcons.has(category.icon)) {
    return category.icon as AppIconName;
  }

  return categoryIconByName[category.name] ?? "other";
}

function normalizeDisplayIcon(category: BackendCategory, icon: AppIconName) {
  if (category.icon && !validAppIcons.has(category.icon)) {
    return category.icon;
  }

  return displayIconByAppIcon[icon];
}

function mapBackendCategory(category: BackendCategory): TransactionCategory {
  const icon = normalizeIcon(category);

  return {
    color: category.color,
    description: category.description,
    displayIcon: normalizeDisplayIcon(category, icon),
    icon,
    id: category.id,
    isDefault: category.is_default,
    name: category.name,
  };
}

export async function getCategories() {
  const categories = await apiRequest<BackendCategory[]>("/categories");
  return (categories ?? []).map(mapBackendCategory);
}

export async function createCategory(input: CreateCategoryInput) {
  const category = await apiRequest<BackendCategory>("/categories", {
    body: JSON.stringify({
      color: input.color,
      description: input.description?.trim() || input.name.trim(),
      icon: input.icon,
      name: input.name.trim(),
    }),
    method: "POST",
  });

  return mapBackendCategory(category);
}

export async function updateCategory(input: UpdateCategoryInput) {
  const category = await apiRequest<BackendCategory>(`/categories/${input.id}`, {
    body: JSON.stringify({
      color: input.color,
      description: input.description.trim(),
      icon: input.icon,
    }),
    method: "PUT",
  });

  return mapBackendCategory(category);
}

export async function deleteCategory(id: string) {
  return apiRequest<null>(`/categories/${id}`, {
    method: "DELETE",
  });
}
