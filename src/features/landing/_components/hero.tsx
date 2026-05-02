"use client";

import { Target } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from "@/shared/_components/icons/phosphor";
import Link from "next/link";
import { AppIcon } from "@/shared/_components/icons/app-icon";
import { Button } from "@/shared/_components/ui/button";
import { formatRupiah } from "@/shared/_utils/formatters";

function FloatingCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

const previewTransactions = [
  { account: "BCA", amount: -65_000, icon: "food", name: "Kopi Starbucks" },
  { account: "BCA", amount: 12_000_000, icon: "salary", name: "Gaji April" },
  { account: "GoPay", amount: -25_000, icon: "transport", name: "Grab ke kantor" },
] as const;

function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="rounded-2xl border border-border bg-card p-4 shadow-2xl shadow-primary/5 sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Total Saldo</p>
            <p className="font-[family-name:var(--font-heading)] text-2xl font-bold sm:text-3xl">
              {formatRupiah(24_150_000)}
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
            <TrendingUp className="h-3 w-3" />
            +12.5%
          </div>
        </div>

        <div className="mb-4 flex h-20 items-end gap-1.5">
          {[40, 55, 35, 65, 50, 75, 45, 80, 60, 70, 55, 85].map((height, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: 0.6 + index * 0.05, duration: 0.5 }}
              className={`flex-1 rounded-sm ${
                index === 11
                  ? "bg-primary"
                  : index >= 9
                    ? "bg-primary/60"
                    : "bg-primary/20"
              }`}
            />
          ))}
        </div>

        <div className="space-y-2">
          {previewTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.15 }}
              className="flex items-center justify-between rounded-lg bg-accent/50 px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-primary">
                  <AppIcon name={transaction.icon} size={18} weight="fill" />
                </span>
                <div>
                  <p className="text-sm font-medium">{transaction.name}</p>
                  <p className="text-xs text-muted-foreground">{transaction.account}</p>
                </div>
              </div>
              <span
                className={`font-[family-name:var(--font-geist-mono)] text-sm font-semibold ${
                  transaction.amount > 0 ? "text-success" : "text-destructive"
                }`}
              >
                {transaction.amount > 0 ? "+" : ""}
                {formatRupiah(Math.abs(transaction.amount))}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <FloatingCard
        delay={1.2}
        className="absolute -right-4 -top-4 z-10 sm:-right-8 sm:-top-6"
      >
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium shadow-lg">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10">
            <TrendingUp className="h-3 w-3 text-success" />
          </span>
          Surplus bulan ini!
        </div>
      </FloatingCard>

      <FloatingCard
        delay={1.5}
        className="absolute -bottom-4 -left-4 z-10 sm:-bottom-6 sm:-left-8"
      >
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium shadow-lg">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Target size={14} weight="fill" />
          </span>
          Target 65% tercapai
        </div>
      </FloatingCard>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-lime/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
          >
            <Sparkles className="h-4 w-4" />
            Pencatatan keuangan yang simpel & powerful
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-6 font-[family-name:var(--font-heading)] text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl"
          >
            Kelola Keuanganmu,
            <br />
            <span className="bg-gradient-to-r from-primary to-lime bg-clip-text text-transparent">
              Tanpa Ribet.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Catat pemasukan & pengeluaran, lacak budget, pantau investasi, dan
            capai tujuan finansialmu. Semua di satu tempat.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Link href="/register">
              <Button
                size="lg"
                className="h-12 gap-2 rounded-full bg-primary px-8 text-base font-semibold hover:bg-primary/90"
              >
                Mulai Gratis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#fitur">
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full px-8 text-base font-semibold"
              >
                Lihat Fitur
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Data terenkripsi
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Setup 5 menit
            </div>
            <div className="hidden h-4 w-px bg-border sm:block" />
            <div className="hidden items-center gap-2 sm:flex">
              <TrendingUp className="h-4 w-4 text-primary" />
              1.000+ pengguna
            </div>
          </motion.div>
        </div>

        <DashboardPreview />
      </div>
    </section>
  );
}

