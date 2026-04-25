import type { DEFAULT_CATEGORIES } from "@/features/settings/_utils/category-config";

export type CategoryGroup = keyof typeof DEFAULT_CATEGORIES;
export type CategoryConfig = (typeof DEFAULT_CATEGORIES)[CategoryGroup][number];
