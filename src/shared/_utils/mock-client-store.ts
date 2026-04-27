"use client";

import { DEFAULT_CATEGORIES } from "@/features/settings/_utils/category-config";
import type { CategoryConfig, CategoryGroup } from "@/features/settings/_types/settings";
import {
  mockAccounts,
  mockBudgets,
  mockDebts,
  mockExpenseByCategory,
  mockGoals,
  mockMonthlyCashflow,
  mockTransactions,
  type Account,
  type Budget,
  type Debt,
  type Goal,
  type Transaction,
} from "@/shared/_constants/mock-data";

const STORAGE_KEYS = {
  accounts: "duitku:mock:accounts",
  budgets: "duitku:mock:budgets",
  categories: "duitku:settings:categories",
  debts: "duitku:mock:debts",
  goals: "duitku:mock:goals",
  notifications: "duitku:settings:notifications",
  profile: "duitku:settings:profile",
  transactions: "duitku:mock:transactions",
} as const;

export type ProfileSettings = {
  email: string;
  name: string;
};

export type NotificationSettings = {
  billReminders: boolean;
  budgetAlerts: boolean;
  weeklySummary: boolean;
};

export type CategorySettings = Record<CategoryGroup, CategoryConfig[]>;

export type CashflowSeriesPoint = {
  expense: number;
  income: number;
  month: string;
};

export type ExpenseCategorySeriesPoint = {
  color: string;
  icon: string;
  name: string;
  value: number;
};

const defaultProfileSettings: ProfileSettings = {
  name: "Bagas Pratama",
  email: "bagas@email.com",
};

const defaultNotificationSettings: NotificationSettings = {
  billReminders: true,
  budgetAlerts: true,
  weeklySummary: true,
};

function getDefaultCategorySettings(): CategorySettings {
  return {
    expense: DEFAULT_CATEGORIES.expense.map((category) => ({ ...category })),
    income: DEFAULT_CATEGORIES.income.map((category) => ({ ...category })),
  };
}

function isBrowser() {
  return typeof window !== "undefined";
}

function readStoredValue<T>(key: string, fallback: T): T {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? (JSON.parse(storedValue) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStoredValue<T>(key: string, value: T) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function createClientId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}

export function getProfileSettings() {
  return readStoredValue(STORAGE_KEYS.profile, defaultProfileSettings);
}

export function saveProfileSettings(profileSettings: ProfileSettings) {
  writeStoredValue(STORAGE_KEYS.profile, profileSettings);
}

export function getNotificationSettings() {
  return readStoredValue(STORAGE_KEYS.notifications, defaultNotificationSettings);
}

export function saveNotificationSettings(notificationSettings: NotificationSettings) {
  writeStoredValue(STORAGE_KEYS.notifications, notificationSettings);
}

export function getCategorySettings() {
  return readStoredValue(STORAGE_KEYS.categories, getDefaultCategorySettings());
}

export function saveCategorySettings(categorySettings: CategorySettings) {
  writeStoredValue(STORAGE_KEYS.categories, categorySettings);
}

function getStoredAccounts() {
  return readStoredValue<Account[]>(STORAGE_KEYS.accounts, []);
}

function getStoredBudgets() {
  return readStoredValue<Budget[]>(STORAGE_KEYS.budgets, []);
}

function getStoredDebts() {
  return readStoredValue<Debt[]>(STORAGE_KEYS.debts, []);
}

function getStoredGoals() {
  return readStoredValue<Goal[]>(STORAGE_KEYS.goals, []);
}

function getStoredTransactions() {
  return readStoredValue<Transaction[]>(STORAGE_KEYS.transactions, []);
}

export function getAppAccounts() {
  return [...mockAccounts, ...getStoredAccounts()];
}

export function addStoredAccount(account: Account) {
  const nextAccounts = [...getStoredAccounts(), account];
  writeStoredValue(STORAGE_KEYS.accounts, nextAccounts);
}

export function getAppBudgets() {
  return [...mockBudgets, ...getStoredBudgets()];
}

export function addStoredBudget(budget: Budget) {
  const nextBudgets = [...getStoredBudgets(), budget];
  writeStoredValue(STORAGE_KEYS.budgets, nextBudgets);
}

export function getAppDebts() {
  return [...mockDebts, ...getStoredDebts()];
}

export function addStoredDebt(debt: Debt) {
  const nextDebts = [...getStoredDebts(), debt];
  writeStoredValue(STORAGE_KEYS.debts, nextDebts);
}

export function getAppGoals() {
  return [...mockGoals, ...getStoredGoals()];
}

export function addStoredGoal(goal: Goal) {
  const nextGoals = [...getStoredGoals(), goal];
  writeStoredValue(STORAGE_KEYS.goals, nextGoals);
}

export function getAppTransactions() {
  return [...mockTransactions, ...getStoredTransactions()].sort((left, right) =>
    right.date.localeCompare(left.date)
  );
}

export function addStoredTransaction(transaction: Transaction) {
  const nextTransactions = [...getStoredTransactions(), transaction];
  writeStoredValue(STORAGE_KEYS.transactions, nextTransactions);
}

export function getCategoryOptions() {
  const categorySettings = getCategorySettings();
  return [...categorySettings.expense, ...categorySettings.income];
}

export function getCategoryNames() {
  return Array.from(
    new Set(getCategoryOptions().map((category) => category.name))
  );
}

function getReferenceDate(transactions: Transaction[]) {
  if (!transactions.length) {
    return new Date();
  }

  const [year, month] = transactions[0].date.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function getAppDashboardSummary() {
  const accounts = getAppAccounts();
  const budgets = getAppBudgets();
  const transactions = getAppTransactions();
  const referenceMonthKey = getMonthKey(getReferenceDate(transactions));

  const totalBalance = accounts.reduce(
    (accountBalanceTotal, account) => accountBalanceTotal + account.balance,
    0
  );
  const monthlyIncome = transactions
    .filter(
      (transaction) =>
        transaction.type === "income" &&
        transaction.date.startsWith(referenceMonthKey)
    )
    .reduce(
      (incomeTotal, transaction) => incomeTotal + transaction.amount,
      0
    );
  const monthlyExpense = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense" &&
        transaction.date.startsWith(referenceMonthKey)
    )
    .reduce(
      (expenseTotal, transaction) => expenseTotal + transaction.amount,
      0
    );
  const emergencyRunway =
    monthlyExpense > 0
      ? Number((Math.max(totalBalance, 0) / monthlyExpense).toFixed(1))
      : 0;

  return {
    accountCount: accounts.length,
    cashflow: monthlyIncome - monthlyExpense,
    cashflowStatus: monthlyIncome > monthlyExpense ? "surplus" : "deficit",
    emergencyRunway,
    monthlyExpense,
    monthlyIncome,
    totalBalance,
    totalBudgetLimit: budgets.reduce(
      (budgetLimitTotal, budget) => budgetLimitTotal + budget.limit,
      0
    ),
    totalBudgetUsed: budgets.reduce(
      (budgetSpentTotal, budget) => budgetSpentTotal + budget.spent,
      0
    ),
  };
}

export function getMonthlyCashflowSeries(
  monthCount = 6
): CashflowSeriesPoint[] {
  const transactions = getAppTransactions();

  if (!transactions.length) {
    return mockMonthlyCashflow;
  }

  const referenceDate = getReferenceDate(transactions);
  const series = Array.from({ length: monthCount }, (_, index) => {
    const monthDate = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth() - (monthCount - index - 1),
      1
    );

    return {
      expense: 0,
      income: 0,
      key: getMonthKey(monthDate),
      month: monthDate.toLocaleString("id-ID", { month: "short" }),
    };
  });

  const seriesMap = new Map(series.map((entry) => [entry.key, entry]));

  transactions.forEach((transaction) => {
    const entry = seriesMap.get(transaction.date.slice(0, 7));

    if (!entry) {
      return;
    }

    if (transaction.type === "income") {
      entry.income += transaction.amount;
      return;
    }

    if (transaction.type === "expense") {
      entry.expense += transaction.amount;
    }
  });

  return series.map((entry) => ({
    expense: entry.expense,
    income: entry.income,
    month: entry.month,
  }));
}

export function getExpenseCategorySeries(
  limit = 6
): ExpenseCategorySeriesPoint[] {
  const categoryLookup = new Map(
    getCategoryOptions().map((category) => [category.name, category])
  );
  const expenseTotals = new Map<string, ExpenseCategorySeriesPoint>();

  getAppTransactions()
    .filter((transaction) => transaction.type === "expense")
    .forEach((transaction) => {
      const categoryConfig = categoryLookup.get(transaction.categoryName);
      const existingCategory = expenseTotals.get(transaction.categoryName);

      if (existingCategory) {
        existingCategory.value += transaction.amount;
        return;
      }

      expenseTotals.set(transaction.categoryName, {
        color: categoryConfig?.color ?? "#a3a3a3",
        icon: categoryConfig?.icon ?? transaction.categoryIcon,
        name: transaction.categoryName,
        value: transaction.amount,
      });
    });

  const series = Array.from(expenseTotals.values()).sort(
    (left, right) => right.value - left.value
  );

  return series.length > 0 ? series.slice(0, limit) : mockExpenseByCategory;
}

export function buildMockAppExport() {
  return {
    exportedAt: new Date().toISOString(),
    settings: {
      categories: getCategorySettings(),
      notifications: getNotificationSettings(),
      profile: getProfileSettings(),
    },
    data: {
      accounts: getAppAccounts(),
      budgets: getAppBudgets(),
      debts: getAppDebts(),
      goals: getAppGoals(),
      transactions: getAppTransactions(),
    },
  };
}

export function downloadTextFile(
  fileName: string,
  content: string,
  mimeType: string
) {
  if (!isBrowser()) {
    return;
  }

  const blob = new Blob([content], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(objectUrl);
}
