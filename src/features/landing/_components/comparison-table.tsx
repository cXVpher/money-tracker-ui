"use client";

import {
  ChartBar,
  DeviceMobile,
  NotePencil,
  SealCheck,
  Table,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { Check, X } from "@/shared/_components/icons/phosphor";

const rows = [
  {
    aspect: "Input transaksi",
    duitku: "Satu klik, otomatis terkategori",
    duitkuPositive: true,
    notes: "Cepat tapi gak terstruktur",
    other: "Bolak-balik buka app",
    spreadsheet: "Buka file, cari baris, ketik manual",
  },
  {
    aspect: "Struktur data",
    duitku: "Otomatis rapi per kategori",
    duitkuPositive: true,
    notes: "Chat & catatan sering terpisah",
    other: "Tidak terstruktur",
    spreadsheet: "Kamu setup & rawat sendiri",
  },
  {
    aspect: "Nyaman di HP",
    duitku: "Satu layar, fokus",
    duitkuPositive: true,
    notes: "Cepat coret, rawan berantakan",
    other: "Bolak-balik app",
    spreadsheet: "Zoom & geser kolom",
  },
  {
    aspect: "Ringkasan & visual",
    duitku: "Dashboard & total siap",
    duitkuPositive: true,
    notes: "Hitung manual",
    other: "UI ringkasan tipis",
    spreadsheet: "Buat rumus & chart sendiri",
  },
  {
    aspect: "Satu alur utuh",
    duitku: "Catat -> rapi -> kebaca",
    duitkuPositive: true,
    notes: "Bukan satu produk UI",
    other: "Bukan untuk audit rutin",
    spreadsheet: "Terpisah file & konteks",
  },
  {
    aspect: "Budget tracking",
    duitku: "Set limit, otomatis terlacak",
    duitkuPositive: true,
    notes: "Tidak ada",
    other: "Terbatas",
    spreadsheet: "Bikin formula kompleks",
  },
  {
    aspect: "Multi akun",
    duitku: "Bank, e-wallet, tunai, CC",
    duitkuPositive: true,
    notes: "Campur semua jadi satu",
    other: "Kadang bayar ekstra",
    spreadsheet: "Sheet berbeda, repot",
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
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <ChartBar size={16} weight="fill" />
            Perbandingan
          </div>
          <h2 className="mb-4 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Masih Pakai Excel?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
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
                <th className="w-[18%] px-4 py-4 text-left text-sm font-medium text-muted-foreground">
                  Aspek
                </th>
                <th className="w-[20%] px-4 py-4 text-left text-sm font-medium text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Table size={16} weight="fill" />
                    Spreadsheet
                  </span>
                </th>
                <th className="w-[20%] px-4 py-4 text-left text-sm font-medium text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <NotePencil size={16} weight="fill" />
                    Notes / Chat
                  </span>
                </th>
                <th className="w-[20%] px-4 py-4 text-left text-sm font-medium text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <DeviceMobile size={16} weight="fill" />
                    App Lain
                  </span>
                </th>
                <th className="w-[22%] px-4 py-4 text-left">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
                    <SealCheck size={16} weight="fill" />
                    DuitKu
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={index}
                  className="border-t border-border transition-colors hover:bg-accent/30"
                >
                  <td className="px-4 py-4 text-sm font-medium">{row.aspect}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <X className="h-3.5 w-3.5 shrink-0 text-destructive" />
                      {row.spreadsheet}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <X className="h-3.5 w-3.5 shrink-0 text-destructive" />
                      {row.notes}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <X className="h-3.5 w-3.5 shrink-0 text-destructive" />
                      {row.other}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium">
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

