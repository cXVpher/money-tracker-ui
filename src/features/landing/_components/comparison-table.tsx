"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const rows = [
  {
    aspect: "Input transaksi",
    spreadsheet: "Buka file, cari baris, ketik manual",
    notes: "Cepat tapi gak terstruktur",
    other: "Bolak-balik buka app",
    duitku: "Satu klik, otomatis terkategori",
    duitkuPositive: true,
  },
  {
    aspect: "Struktur data",
    spreadsheet: "Kamu setup & rawat sendiri",
    notes: "Chat & catatan sering terpisah",
    other: "Tidak terstruktur",
    duitku: "Otomatis rapi per kategori",
    duitkuPositive: true,
  },
  {
    aspect: "Nyaman di HP",
    spreadsheet: "Zoom & geser kolom",
    notes: "Cepat coret, rawan berantakan",
    other: "Bolak-balik app",
    duitku: "Satu layar, fokus",
    duitkuPositive: true,
  },
  {
    aspect: "Ringkasan & visual",
    spreadsheet: "Buat rumus & chart sendiri",
    notes: "Hitung manual",
    other: "UI ringkasan tipis",
    duitku: "Dashboard & total siap",
    duitkuPositive: true,
  },
  {
    aspect: "Satu alur utuh",
    spreadsheet: "Terpisah file & konteks",
    notes: "Bukan satu produk UI",
    other: "Bukan untuk audit rutin",
    duitku: "Catat → rapi → kebaca",
    duitkuPositive: true,
  },
  {
    aspect: "Budget tracking",
    spreadsheet: "Bikin formula kompleks",
    notes: "Tidak ada",
    other: "Terbatas",
    duitku: "Set limit, otomatis terlacak",
    duitkuPositive: true,
  },
  {
    aspect: "Multi akun",
    spreadsheet: "Sheet berbeda, repot",
    notes: "Campur semua jadi satu",
    other: "Kadang bayar ekstra",
    duitku: "Bank, e-wallet, tunai, CC",
    duitkuPositive: true,
  },
];

export function ComparisonTable() {
  return (
    <section id="perbandingan" className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-4">
            📊 Perbandingan
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] tracking-tight mb-4">
            Masih Pakai Excel?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bukan soal tampil keren. Soal workflow yang stabil, gampang
            dilanjutkan, dan minim error.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground w-[18%]">
                  Aspek
                </th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground w-[20%]">
                  📊 Spreadsheet
                </th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground w-[20%]">
                  📝 Notes / Chat
                </th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground w-[20%]">
                  📱 App Lain
                </th>
                <th className="text-left py-4 px-4 w-[22%]">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    💚 DuitKu
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-t border-border hover:bg-accent/30 transition-colors"
                >
                  <td className="py-4 px-4 text-sm font-medium">
                    {row.aspect}
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <X className="h-3.5 w-3.5 text-destructive shrink-0" />
                      {row.spreadsheet}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <X className="h-3.5 w-3.5 text-destructive shrink-0" />
                      {row.notes}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <X className="h-3.5 w-3.5 text-destructive shrink-0" />
                      {row.other}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm font-medium">
                    <span className="inline-flex items-center gap-1.5 text-primary">
                      <Check className="h-3.5 w-3.5 shrink-0" />
                      {row.duitku}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
