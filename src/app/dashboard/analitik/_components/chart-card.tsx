import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import type { ChartCardProps } from "../_types/analytics";

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
