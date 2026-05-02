"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Target,
  BarChart3,
  Wallet,
  CalendarDays,
  HandCoins,
  Bot,
  Camera,
  Cloud,
  Mic,
} from "@/shared/_components/icons/phosphor";

const features = [
  {
    icon: LayoutDashboard,
    title: "Dashboard All-in-One",
    description:
      "Total saldo, cashflow, grafik pertumbuhan, distribusi pengeluaran, dan transaksi terakhir. Semua dalam satu layar.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: ArrowLeftRight,
    title: "Catat Transaksi",
    description:
      "Input cepat pemasukan, pengeluaran, dan transfer. Filter, cari, dan kelola riwayat dengan mudah.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Wallet,
    title: "Multi Akun Finansial",
    description:
      "Bank, e-wallet, tunai, kartu kredit — semua terhubung di satu tempat. Lihat distribusi saldomu.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: PieChart,
    title: "Budget Tracker",
    description:
      "Set limit pengeluaran per kategori. Pantau sisa budget secara real-time, hindari pengeluaran berlebih.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: Target,
    title: "Target Tabungan",
    description:
      "Pasang target tabungan dan lihat progres. Estimasi waktu tercapai dihitung otomatis.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    icon: BarChart3,
    title: "Analitik Mendalam",
    description:
      "Cashflow bulanan, breakdown kategori, perbandingan antar bulan, dan tren pertumbuhan dengan grafik interaktif.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    icon: HandCoins,
    title: "Kelola Hutang",
    description:
      "Tracking hutang dan piutang. Tidak ada yang terlewat, lengkap dengan status pembayaran.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: CalendarDays,
    title: "Kalender Keuangan",
    description:
      "Lihat cashflow harian di kalender. Warna hijau surplus, merah defisit. Timeline keuangan yang jelas.",
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description:
      'Catat transaksi lewat chat AI. Cukup ketik "beli kopi 25rb" dan otomatis tercatat dengan kategori yang tepat.',
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Camera,
    title: "Scan Struk",
    description:
      "Foto struk atau nota belanja, AI baca total dan kategori otomatis. Tidak perlu input manual.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: Mic,
    title: "Input Suara",
    description:
      "Cukup bicara untuk mencatat transaksi. Rekam suara, AI proses dan catat otomatis.",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    description:
      "Sinkronisasi real-time di semua perangkat. Ubah di HP, muncul di laptop. Data aman di cloud.",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Features() {
  return (
    <section id="fitur" className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-4">
            ✨ Fitur
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] tracking-tight mb-4">
            Semua yang Kamu Butuhkan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Alat lengkap untuk mencapai financial freedom. Kalkulasi otomatis,
            akses di mana saja.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group p-5 rounded-2xl border border-border bg-card hover:bg-accent/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${feature.bg} mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className={`h-5 w-5 ${feature.color}`} />
              </div>
              <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

