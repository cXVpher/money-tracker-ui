"use client";

import { Download } from "@/shared/_components/icons/phosphor";
import { toast } from "sonner";
import { Button } from "@/shared/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import {
  buildMockAppExport,
  downloadTextFile,
} from "@/shared/_utils/mock-client-store";

export function ExportSettingsCard() {
  function handleExportJson() {
    if (!USE_MOCK_DATA) {
      toast.error("Export data belum tersedia.");
      return;
    }

    downloadTextFile(
      "duitku-backup.json",
      JSON.stringify(buildMockAppExport(), null, 2),
      "application/json"
    );
    toast.success("Backup JSON berhasil dibuat.");
  }

  function handleExportCsv() {
    if (!USE_MOCK_DATA) {
      toast.error("Export data belum tersedia.");
      return;
    }

    const transactions = buildMockAppExport().data.transactions;
    const csvLines = [
      [
        "id",
        "date",
        "type",
        "account",
        "category",
        "amount",
        "description",
      ].join(","),
      ...transactions.map((transaction) =>
        [
          transaction.id,
          transaction.date,
          transaction.type,
          `"${transaction.accountName}"`,
          `"${transaction.categoryName}"`,
          transaction.amount,
          `"${transaction.description.replaceAll('"', '""')}"`,
        ].join(",")
      ),
    ];

    downloadTextFile("duitku-transactions.csv", csvLines.join("\n"), "text/csv");
    toast.success("Export CSV berhasil dibuat.");
  }

  function handleExportPdf() {
    if (!USE_MOCK_DATA) {
      toast.error("Export data belum tersedia.");
      return;
    }

    const exportSnapshot = buildMockAppExport();
    const printWindow = window.open("", "_blank", "noopener,noreferrer");

    if (!printWindow) {
      toast.error("Popup diblokir browser. Izinkan popup untuk export PDF.");
      return;
    }

    const summaryRows = [
      ["Akun", String(exportSnapshot.data.accounts.length)],
      ["Transaksi", String(exportSnapshot.data.transactions.length)],
      ["Budget", String(exportSnapshot.data.budgets.length)],
      ["Target", String(exportSnapshot.data.goals.length)],
      ["Hutang / Piutang", String(exportSnapshot.data.debts.length)],
    ]
      .map(
        ([label, value]) =>
          `<tr><td style="padding:8px;border:1px solid #ddd;">${label}</td><td style="padding:8px;border:1px solid #ddd;">${value}</td></tr>`
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>DuitKu Export</title>
        </head>
        <body style="font-family: Arial, sans-serif; padding: 24px;">
          <h1>DuitKu Export Ringkas</h1>
          <p>Dibuat: ${new Date(exportSnapshot.exportedAt).toLocaleString("id-ID")}</p>
          <table style="border-collapse: collapse; width: 100%; max-width: 480px;">
            ${summaryRows}
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    toast.success("Jendela print dibuka untuk simpan sebagai PDF.");
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
        {!USE_MOCK_DATA ? (
          <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            Export data belum tersedia untuk akun ini.
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleExportCsv} disabled={!USE_MOCK_DATA}>
          Export CSV
        </Button>
        <Button variant="outline" onClick={handleExportPdf} disabled={!USE_MOCK_DATA}>
          Export PDF
        </Button>
        <Button variant="outline" onClick={handleExportJson} disabled={!USE_MOCK_DATA}>
          Backup JSON
        </Button>
        </div>
      </CardContent>
    </Card>
  );
}

