import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import type { ChartPanelProps } from "../_types/analytics";

export function ChartCard({ title, children }: ChartPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
