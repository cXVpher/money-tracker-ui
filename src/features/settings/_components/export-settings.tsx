import { Download } from "lucide-react";
import { Button } from "@/shared/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";

export function ExportSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button variant="outline">Export CSV</Button>
        <Button variant="outline">Export PDF</Button>
        <Button variant="outline">Backup JSON</Button>
      </CardContent>
    </Card>
  );
}
