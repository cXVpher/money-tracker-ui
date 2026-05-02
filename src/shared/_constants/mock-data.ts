// Mock data for frontend development
// Will be replaced with real API calls when backend is ready

import type {
  Account,
  Bill,
  Budget,
  Debt,
  Goal,
  Transaction,
} from "@/shared/_types/finance";

export type { Account, Bill, Budget, Debt, Goal, Transaction };

export const mockAccounts: Account[] = [
  { id: "1", name: "BCA", type: "bank", balance: 15_450_000, icon: "bank", color: "#0060af" },
  { id: "2", name: "GoPay", type: "ewallet", balance: 1_250_000, icon: "mobile", color: "#00aed6" },
  { id: "3", name: "Tunai", type: "cash", balance: 850_000, icon: "cash", color: "#22c55e" },
  { id: "4", name: "Mandiri", type: "bank", balance: 8_320_000, icon: "bank", color: "#003d79" },
  { id: "5", name: "OVO", type: "ewallet", balance: 430_000, icon: "mobile", color: "#4c3494" },
  { id: "6", name: "BCA CC", type: "credit_card", balance: -2_150_000, icon: "credit_card", color: "#ef4444" },
];

export const mockTransactions: Transaction[] = [
  { id: "t1", accountId: "1", categoryId: "c1", type: "expense", amount: 65_000, description: "Kopi Starbucks", date: "2026-04-25", categoryName: "Makanan & Minuman", categoryIcon: "food", accountName: "BCA" },
  { id: "t2", accountId: "2", categoryId: "c2", type: "expense", amount: 25_000, description: "Grab ke kantor", date: "2026-04-25", categoryName: "Transportasi", categoryIcon: "transport", accountName: "GoPay" },
  { id: "t3", accountId: "1", categoryId: "c10", type: "income", amount: 12_000_000, description: "Gaji April", date: "2026-04-24", categoryName: "Gaji", categoryIcon: "salary", accountName: "BCA" },
  { id: "t4", accountId: "3", categoryId: "c1", type: "expense", amount: 45_000, description: "Makan siang warteg", date: "2026-04-24", categoryName: "Makanan & Minuman", categoryIcon: "food", accountName: "Tunai" },
  { id: "t5", accountId: "1", categoryId: "c7", type: "expense", amount: 350_000, description: "Listrik bulan April", date: "2026-04-23", categoryName: "Tagihan", categoryIcon: "bills", accountName: "BCA" },
  { id: "t6", accountId: "2", categoryId: "c4", type: "expense", amount: 150_000, description: "Netflix & Spotify", date: "2026-04-23", categoryName: "Hiburan", categoryIcon: "entertainment", accountName: "GoPay" },
  { id: "t7", accountId: "1", categoryId: "c11", type: "income", amount: 3_500_000, description: "Proyek freelance", date: "2026-04-22", categoryName: "Freelance", categoryIcon: "freelance", accountName: "BCA" },
  { id: "t8", accountId: "3", categoryId: "c8", type: "expense", amount: 287_000, description: "Belanja mingguan", date: "2026-04-22", categoryName: "Groceries", categoryIcon: "groceries", accountName: "Tunai" },
  { id: "t9", accountId: "1", categoryId: "c3", type: "expense", amount: 499_000, description: "Beli hoodie baru", date: "2026-04-21", categoryName: "Belanja", categoryIcon: "shopping", accountName: "BCA" },
  { id: "t10", accountId: "4", categoryId: "c10", type: "income", amount: 500_000, description: "Transfer dari teman", date: "2026-04-21", categoryName: "Lainnya", categoryIcon: "other", accountName: "Mandiri" },
];

export const mockBudgets: Budget[] = [
  { id: "b1", categoryName: "Makanan & Minuman", categoryIcon: "food", limit: 2_000_000, spent: 1_450_000, color: "#f97316" },
  { id: "b2", categoryName: "Transportasi", categoryIcon: "transport", limit: 800_000, spent: 520_000, color: "#3b82f6" },
  { id: "b3", categoryName: "Hiburan", categoryIcon: "entertainment", limit: 500_000, spent: 480_000, color: "#8b5cf6" },
  { id: "b4", categoryName: "Belanja", categoryIcon: "shopping", limit: 1_000_000, spent: 499_000, color: "#ec4899" },
  { id: "b5", categoryName: "Tagihan", categoryIcon: "bills", limit: 1_500_000, spent: 1_100_000, color: "#64748b" },
  { id: "b6", categoryName: "Groceries", categoryIcon: "groceries", limit: 1_200_000, spent: 890_000, color: "#22c55e" },
];

export const mockGoals: Goal[] = [
  { id: "g1", name: "Dana Darurat", targetAmount: 50_000_000, currentAmount: 32_500_000, deadline: "2026-12-31", icon: "shield", color: "#3b82f6" },
  { id: "g2", name: "Liburan Bali", targetAmount: 8_000_000, currentAmount: 5_200_000, deadline: "2026-08-01", icon: "travel", color: "#f97316" },
  { id: "g3", name: "Laptop Baru", targetAmount: 15_000_000, currentAmount: 4_800_000, deadline: "2026-10-01", icon: "freelance", color: "#8b5cf6" },
  { id: "g4", name: "Kursus Online", targetAmount: 2_500_000, currentAmount: 2_100_000, deadline: "2026-06-01", icon: "education", color: "#06b6d4" },
];

export const mockBills: Bill[] = [
  { id: "bl1", name: "BCA KrisFlyer", amount: 2_830_500, dueDate: "2026-05-05", categoryIcon: "credit_card", status: "pending" },
  { id: "bl2", name: "Internet IndiHome", amount: 450_000, dueDate: "2026-05-01", categoryIcon: "internet", status: "pending" },
  { id: "bl3", name: "ShopeePaylater", amount: 128_000, dueDate: "2026-05-10", categoryIcon: "shopping", status: "pending" },
];

export const mockDebts: Debt[] = [
  { id: "d1", type: "owed", personName: "Raka", amount: 500_000, remainingAmount: 500_000, dueDate: "2026-05-15", description: "Pinjam buat beli tiket konser", status: "active" },
  { id: "d2", type: "receivable", personName: "Nadia", amount: 300_000, remainingAmount: 150_000, dueDate: "2026-05-01", description: "Patungan makan", status: "active" },
  { id: "d3", type: "owed", personName: "Dimas", amount: 1_000_000, remainingAmount: 0, dueDate: "2026-04-01", description: "Bayar kos", status: "paid" },
];

export const mockMonthlyCashflow = [
  { month: "Nov", income: 15_000_000, expense: 11_200_000 },
  { month: "Des", income: 17_500_000, expense: 14_800_000 },
  { month: "Jan", income: 15_500_000, expense: 12_100_000 },
  { month: "Feb", income: 15_500_000, expense: 10_900_000 },
  { month: "Mar", income: 16_000_000, expense: 13_200_000 },
  { month: "Apr", income: 15_500_000, expense: 9_450_000 },
];

export const mockExpenseByCategory = [
  { name: "Makanan & Minuman", value: 1_450_000, icon: "food", color: "#f97316" },
  { name: "Tagihan", value: 1_100_000, icon: "bills", color: "#64748b" },
  { name: "Groceries", value: 890_000, icon: "groceries", color: "#22c55e" },
  { name: "Transportasi", value: 520_000, icon: "transport", color: "#3b82f6" },
  { name: "Belanja", value: 499_000, icon: "shopping", color: "#ec4899" },
  { name: "Hiburan", value: 480_000, icon: "entertainment", color: "#8b5cf6" },
];

export function getMockDashboardSummary() {
  const totalBalance = mockAccounts.reduce(
    (accountBalanceTotal, account) => accountBalanceTotal + account.balance,
    0
  );
  const monthlyIncome = mockTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((incomeTotal, transaction) => incomeTotal + transaction.amount, 0);
  const monthlyExpense = mockTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (expenseTotal, transaction) => expenseTotal + transaction.amount,
      0
    );

  return {
    totalBalance,
    monthlyIncome,
    monthlyExpense,
    cashflow: monthlyIncome - monthlyExpense,
    cashflowStatus: monthlyIncome > monthlyExpense ? "surplus" : "deficit",
    totalBudgetUsed: mockBudgets.reduce(
      (budgetSpentTotal, budget) => budgetSpentTotal + budget.spent,
      0
    ),
    totalBudgetLimit: mockBudgets.reduce(
      (budgetLimitTotal, budget) => budgetLimitTotal + budget.limit,
      0
    ),
    emergencyRunway: 5.3,
    accountCount: mockAccounts.length,
  };
}
