"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/_components/ui/accordion";

const faqs = [
  {
    value: "start",
    question: "Apakah DuitKu bisa dipakai gratis?",
    answer:
      "Bisa. Paket Gratis cocok untuk mulai mencatat transaksi harian, melihat dashboard dasar, dan mengatur beberapa akun finansial tanpa biaya.",
  },
  {
    value: "manual",
    question: "Apakah transaksi harus diinput manual?",
    answer:
      "Untuk versi awal, transaksi dicatat manual agar datanya tetap rapi dan mudah dicek. Fitur AI, scan struk, dan input suara sudah disiapkan sebagai bagian dari paket Pro+.",
  },
  {
    value: "accounts",
    question: "Bisa mencatat banyak rekening dan e-wallet?",
    answer:
      "Bisa. DuitKu dirancang untuk memisahkan saldo bank, e-wallet, tunai, dan kartu kredit sehingga total saldo dan arus kas tetap terbaca jelas.",
  },
  {
    value: "privacy",
    question: "Apakah data keuangan saya aman?",
    answer:
      "DuitKu memakai pendekatan privacy-first. Data sensitif ditampilkan seperlunya, akses akun dilindungi autentikasi, dan integrasi backend dapat memakai enkripsi saat produksi.",
  },
  {
    value: "excel",
    question: "Apa bedanya dengan spreadsheet?",
    answer:
      "Spreadsheet fleksibel, tetapi butuh rumus, struktur, dan perawatan sendiri. DuitKu memberi alur siap pakai dari catat transaksi, budget, target, sampai laporan visual.",
  },
  {
    value: "export",
    question: "Apakah data bisa diekspor?",
    answer:
      "Ya. Paket Pro direncanakan mendukung ekspor CSV dan PDF agar laporan bulanan tetap bisa disimpan atau dibagikan di luar aplikasi.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 lg:py-32 bg-accent/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            FAQ
          </div>
          <h2 className="mb-4 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Pertanyaan yang Sering Muncul
          </h2>
          <p className="max-w-xl text-lg text-muted-foreground">
            Jawaban singkat untuk hal penting sebelum kamu mulai mengelola
            keuangan dengan DuitKu.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-3 shadow-lg shadow-primary/5"
        >
          <Accordion defaultValue={["start"]} className="gap-1">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.value}
                value={faq.value}
                className="rounded-xl border-b-0 px-4 data-[open]:bg-accent/50"
              >
                <AccordionTrigger className="py-5 text-base font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 pr-6 text-sm leading-7 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
