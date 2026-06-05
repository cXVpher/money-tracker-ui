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
