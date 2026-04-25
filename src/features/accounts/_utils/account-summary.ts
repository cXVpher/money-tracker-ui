import type { Account } from "@/features/accounts/_types/account";

export function getTotalBalance(accounts: Account[]) {
  return accounts.reduce((sum, account) => sum + account.balance, 0);
}
