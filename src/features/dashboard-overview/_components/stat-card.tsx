import type { LucideIcon } from "lucide-react";
import { Badge } from "@/shared/_components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { cn } from "@/shared/_utils/cn";

type StatCardProps = {
  title: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  badge?: string;
  tone?: "default" | "success" | "warning" | "danger";
};

const toneClasses = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
};

export function StatCard({
  title,
  value,
  helper,
  icon: Icon,
  badge,
  tone = "default",
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            toneClasses[tone]
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </CardHeader>
      <CardContent>
        <div className="font-[family-name:var(--font-heading)] text-2xl font-bold">
          {value}
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">{helper}</p>
          {badge ? <Badge variant="outline">{badge}</Badge> : null}
        </div>
      </CardContent>
    </Card>
  );
}
