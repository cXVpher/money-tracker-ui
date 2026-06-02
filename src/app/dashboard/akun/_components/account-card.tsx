import type { Account } from "@/shared/_types/finance";
import { AppIcon } from "@/shared/_components/icons/app-icon";
import { Button } from "@/shared/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { formatRupiah } from "@/shared/_utils/formatters";

interface AccountCardProps {
  account: Account;
  onDelete?: () => void;
  onEdit?: () => void;
}

export function AccountCard({ account, onDelete, onEdit }: AccountCardProps) {
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
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>Hapus</Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className={account.balance < 0 ? "text-2xl font-bold text-destructive" : "text-2xl font-bold"}>
          {formatRupiah(account.balance)}
        </p>
      </CardContent>
    </Card>
  );
}
