"use client";

import { Download } from "@/shared/_components/icons/phosphor";
import { toast } from "sonner";
import { Button } from "@/shared/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import {
  buildMockAppExport,
  downloadTextFile,
} from "@/shared/_utils/mock-client-store";

export function ExportSettingsCard() {
  function handleExportJson() {
    downloadTextFile(
      "duitku-backup.json",
      JSON.stringify(buildMockAppExport(), null, 2),
      "application/json"
    );
    toast.success("Backup JSON berhasil dibuat.");
  }

  function handleExportCsv() {
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
      <CardContent className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleExportCsv}>
          Export CSV
        </Button>
        <Button variant="outline" onClick={handleExportPdf}>
          Export PDF
        </Button>
        <Button variant="outline" onClick={handleExportJson}>
          Backup JSON
        </Button>
      </CardContent>
    </Card>
  );
}

