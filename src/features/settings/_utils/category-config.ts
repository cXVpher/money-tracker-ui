import type { CategoryConfig, CategoryGroup } from "@/features/settings/_types/settings";

export const DEFAULT_CATEGORIES: Record<CategoryGroup, CategoryConfig[]> = {
  expense: [
    { name: "Makanan & Minuman", icon: "food", color: "#f97316" },
    { name: "Transportasi", icon: "transport", color: "#3b82f6" },
    { name: "Belanja", icon: "shopping", color: "#ec4899" },
    { name: "Hiburan", icon: "entertainment", color: "#8b5cf6" },
    { name: "Kesehatan", icon: "health", color: "#ef4444" },
    { name: "Pendidikan", icon: "education", color: "#06b6d4" },
    { name: "Tagihan", icon: "bills", color: "#64748b" },
    { name: "Groceries", icon: "groceries", color: "#22c55e" },
    { name: "Lainnya", icon: "other", color: "#a3a3a3" },
  ],
  income: [
    { name: "Gaji", icon: "salary", color: "#22c55e" },
    { name: "Freelance", icon: "freelance", color: "#3b82f6" },
    { name: "Investasi", icon: "investment", color: "#8b5cf6" },
    { name: "Bonus", icon: "bonus", color: "#f97316" },
    { name: "Lainnya", icon: "other", color: "#a3a3a3" },
  ],
};
