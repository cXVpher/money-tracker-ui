"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "@/shared/_components/icons/phosphor";
import { Button } from "@/shared/_components/ui/button";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import type { Account } from "@/shared/_types/finance";
import { getAppAccounts } from "@/shared/_utils/mock-client-store";
import { AccountCard } from "./account-card";
import { AccountDialog } from "./account-dialog";
import { AccountTotalCard } from "./account-total-card";
import { getAccountsTotalBalance } from "../_utils/account-summary";

export function AccountsPageContent() {
  const [accounts, setAccounts] = useState<Account[]>(() =>
    USE_MOCK_DATA ? getAppAccounts() : []
  );
  const totalBalance = useMemo(
    () => getAccountsTotalBalance(accounts),
    [accounts]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Bank, e-wallet, tunai, dan kartu kredit</p>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
            Akun
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-full"
            disabled={!USE_MOCK_DATA}
          >
            <ArrowLeftRight className="h-4 w-4" />
            Transfer
          </Button>
          {USE_MOCK_DATA ? (
            <AccountDialog
              onAccountCreated={(account) =>
                setAccounts((currentAccounts) => [...currentAccounts, account])
              }
            />
          ) : (
            <Button className="rounded-full" disabled>
              Tambah Akun
            </Button>
          )}
        </div>
      </div>

      {!USE_MOCK_DATA ? (
        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Akun finansial belum tersedia untuk akun ini.
        </div>
      ) : null}

      <AccountTotalCard accountCount={accounts.length} totalBalance={totalBalance} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {accounts.length ? accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        )) : (
          <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
            Belum ada akun finansial.
          </div>
        )}
      </div>
    </div>
  );
}

