import type { Account } from "@/shared/_types/finance";
import { AppIcon } from "@/shared/_components/icons/app-icon";
import { Button } from "@/shared/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { formatRupiah } from "@/shared/_utils/formatters";

interface AccountCardProps {
  account: Account;
}

export function AccountCard({ account }: AccountCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-xl">
            <AppIcon name={account.icon} size={22} />
          </span>
          <div>
            <CardTitle>{account.name}</CardTitle>
            <p className="text-xs capitalize text-muted-foreground">
              {account.type.replace("_", " ")}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm">Edit</Button>
      </CardHeader>
      <CardContent>
        <p className={account.balance < 0 ? "text-2xl font-bold text-destructive" : "text-2xl font-bold"}>
          {formatRupiah(account.balance)}
        </p>
      </CardContent>
    </Card>
  );
}
