import { Button } from "@/shared/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { formatRupiah } from "@/shared/_utils/formatters";
import type { Account } from "@/features/accounts/_types/account";

export function AccountCard({ account }: { account: Account }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-xl">
            {account.icon}
          </span>
          <div>
            <CardTitle>{account.name}</CardTitle>
            <p className="text-xs capitalize text-muted-foreground">
              {account.type.replace("_", " ")}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        <p
          className={
            account.balance < 0
              ? "text-2xl font-bold text-destructive"
              : "text-2xl font-bold"
          }
        >
          {formatRupiah(account.balance)}
        </p>
      </CardContent>
    </Card>
  );
}
