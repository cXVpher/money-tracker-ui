export interface Account {
  id: string;
  name: string;
  type: "bank" | "ewallet" | "cash" | "credit_card";
  balance: number;
  icon: string;
  color: string;
}
