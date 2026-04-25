import type { Account } from "@/shared/_types/finance";

export function getAccountsTotalBalance(accounts: Account[]) {
  return accounts.reduce((sum, account) => sum + account.balance, 0);
}
