import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { formatRupiah } from "@/shared/_utils/formatters";

interface AccountTotalCardProps {
  accountCount: number;
  totalBalance: number;
}

export function AccountTotalCard({ accountCount, totalBalance }: AccountTotalCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Saldo</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-[family-name:var(--font-heading)] text-4xl font-bold">
          {formatRupiah(totalBalance)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Terakumulasi dari {accountCount} akun aktif.
        </p>
      </CardContent>
    </Card>
  );
}
