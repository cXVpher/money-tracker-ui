import { Tags } from "lucide-react";
import { Button } from "@/shared/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { DEFAULT_CATEGORIES } from "@/features/settings/_utils/category-config";

export function CategorySettingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tags className="h-4 w-4" />
          Kategori
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[...DEFAULT_CATEGORIES.expense, ...DEFAULT_CATEGORIES.income].slice(0, 12).map((category) => (
          <div key={category.name} className="flex items-center justify-between rounded-lg border border-border p-3">
            <span className="text-sm">{category.icon} {category.name}</span>
            <Button variant="ghost" size="sm">Edit</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
