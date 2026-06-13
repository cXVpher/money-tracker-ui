import type { ReactNode } from "react";
import { Card, CardContent } from "@/shared/_components/ui/card";
import { cn } from "@/shared/_utils/cn";

export function EmptyState({
  action,
  className,
  description,
  icon,
  title,
}: {
  action?: ReactNode;
  className?: string;
  description: string;
  icon?: ReactNode;
  title: string;
}) {
  return (
    <Card className={cn("border border-dashed border-border bg-muted/20", className)}>
      <CardContent className="flex flex-col items-center justify-center px-6 py-10 text-center">
        {icon ? (
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        ) : null}
        <h2 className="font-[family-name:var(--font-heading)] text-base font-semibold">
          {title}
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
        {action ? <div className="mt-5">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
