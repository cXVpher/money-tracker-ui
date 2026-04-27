import { useMemo, useState } from "react";
import type { Transaction } from "@/features/transactions/_types/transaction";

export function useTransactionFilters(transactions: Transaction[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [selectedTransactionType, setSelectedTransactionType] = useState("all");

  const filteredTransactions = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();
    return transactions.filter((transaction) => {
      const matchesQuery =
        !normalizedSearchQuery ||
        transaction.description.toLowerCase().includes(normalizedSearchQuery) ||
        transaction.categoryName.toLowerCase().includes(normalizedSearchQuery) ||
        transaction.accountName.toLowerCase().includes(normalizedSearchQuery);
      const matchesCategory =
        selectedCategory === "all" || transaction.categoryName === selectedCategory;
      const matchesAccount =
        selectedAccount === "all" || transaction.accountName === selectedAccount;
      const matchesType =
        selectedTransactionType === "all" ||
        transaction.type === selectedTransactionType;

      return matchesQuery && matchesCategory && matchesAccount && matchesType;
    });
  }, [searchQuery, selectedCategory, selectedAccount, selectedTransactionType, transactions]);

  return {
    filteredTransactions,
    searchQuery,
    selectedAccount,
    selectedCategory,
    selectedTransactionType,
    setSearchQuery,
    setSelectedAccount,
    setSelectedCategory,
    setSelectedTransactionType,
  };
}
