export const DEFAULT_CATEGORIES = {
  expense: [
    { name: "Makanan & Minuman", icon: "🍜", color: "#f97316" },
    { name: "Transportasi", icon: "🚗", color: "#3b82f6" },
    { name: "Belanja", icon: "🛍️", color: "#ec4899" },
    { name: "Hiburan", icon: "🎮", color: "#8b5cf6" },
    { name: "Kesehatan", icon: "🏥", color: "#ef4444" },
    { name: "Pendidikan", icon: "📚", color: "#06b6d4" },
    { name: "Tagihan", icon: "📄", color: "#64748b" },
    { name: "Groceries", icon: "🛒", color: "#22c55e" },
    { name: "Lainnya", icon: "📌", color: "#a3a3a3" },
  ],
  income: [
    { name: "Gaji", icon: "💰", color: "#22c55e" },
    { name: "Freelance", icon: "💻", color: "#3b82f6" },
    { name: "Investasi", icon: "📈", color: "#8b5cf6" },
    { name: "Bonus", icon: "🎁", color: "#f97316" },
    { name: "Lainnya", icon: "📌", color: "#a3a3a3" },
  ],
} as const;
