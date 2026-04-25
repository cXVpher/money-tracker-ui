import { useMemo, useState } from "react";
import type { Transaction } from "@/features/transactions/_types/transaction";

export function useTransactionFilters(transactions: Transaction[]) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [account, setAccount] = useState("all");
  const [type, setType] = useState("all");

  const data = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return transactions.filter((transaction) => {
      const matchesQuery =
        !normalized ||
        transaction.description.toLowerCase().includes(normalized) ||
        transaction.categoryName.toLowerCase().includes(normalized) ||
        transaction.accountName.toLowerCase().includes(normalized);
      const matchesCategory =
        category === "all" || transaction.categoryName === category;
      const matchesAccount = account === "all" || transaction.accountName === account;
      const matchesType = type === "all" || transaction.type === type;

      return matchesQuery && matchesCategory && matchesAccount && matchesType;
    });
  }, [account, category, query, transactions, type]);

  return {
    account,
    category,
    data,
    query,
    setAccount,
    setCategory,
    setQuery,
    setType,
    type,
  };
}
