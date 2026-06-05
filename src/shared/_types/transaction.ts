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
