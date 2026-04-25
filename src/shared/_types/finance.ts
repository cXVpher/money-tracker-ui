export interface Account {
  id: string;
  name: string;
  type: "bank" | "ewallet" | "cash" | "credit_card";
  balance: number;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  type: "income" | "expense" | "transfer";
  amount: number;
  description: string;
  date: string;
  categoryName: string;
  categoryIcon: string;
  accountName: string;
}

export interface Budget {
  id: string;
  categoryName: string;
  categoryIcon: string;
  limit: number;
  spent: number;
  color: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
}

export interface Debt {
  id: string;
  type: "owed" | "receivable";
  personName: string;
  amount: number;
  remainingAmount: number;
  dueDate: string;
  description: string;
  status: "active" | "paid";
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  categoryIcon: string;
  status: "pending" | "paid" | "overdue";
}
