export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  categoryIcon: string;
  status: "pending" | "paid" | "overdue";
}
