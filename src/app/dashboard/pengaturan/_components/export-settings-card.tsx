"use client";

import { Download } from "@/shared/_components/icons/phosphor";
import { toast } from "sonner";
import { Button } from "@/shared/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";


export function ExportSettingsCard() {
  function handleExportJson() {
    toast.error("Export data belum tersedia.");
    return;


  }

  function handleExportCsv() {
    toast.error("Export data belum tersedia.");
    return;


  }

  function handleExportPdf() {
    toast.error("Export data belum tersedia.");
    return;


  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Export data belum tersedia untuk akun ini.
        </div>
        <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleExportCsv} disabled>
          Export CSV
        </Button>
        <Button variant="outline" onClick={handleExportPdf} disabled>
          Export PDF
        </Button>
        <Button variant="outline" onClick={handleExportJson} disabled>
          Backup JSON
        </Button>
        </div>
      </CardContent>
    </Card>
  );
}

