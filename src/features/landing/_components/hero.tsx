"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/shared/_components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Sparkles,
} from "lucide-react";
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

function DashboardPreview() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Main dashboard card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-2xl shadow-primary/5"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Saldo</p>
            <p className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-heading)]">
              {formatRupiah(24_150_000)}
            </p>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">
            <TrendingUp className="h-3 w-3" />
            +12.5%
          </div>
        </div>

        {/* Mini chart bars */}
        <div className="flex items-end gap-1.5 h-20 mb-4">
          {[40, 55, 35, 65, 50, 75, 45, 80, 60, 70, 55, 85].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.6 + i * 0.05, duration: 0.5 }}
              className={`flex-1 rounded-sm ${
                i === 11
                  ? "bg-primary"
                  : i >= 9
                    ? "bg-primary/60"
                    : "bg-primary/20"
              }`}
            />
          ))}
        </div>

        {/* Recent transactions */}
        <div className="space-y-2">
          {[
            { icon: "🍜", name: "Kopi Starbucks", amount: -65_000, account: "BCA" },
            { icon: "💰", name: "Gaji April", amount: 12_000_000, account: "BCA" },
            { icon: "🚗", name: "Grab ke kantor", amount: -25_000, account: "GoPay" },
          ].map((tx, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + i * 0.15 }}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-accent/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{tx.icon}</span>
                <div>
                  <p className="text-sm font-medium">{tx.name}</p>
                  <p className="text-xs text-muted-foreground">{tx.account}</p>
                </div>
              </div>
              <span
                className={`text-sm font-semibold font-[family-name:var(--font-geist-mono)] ${
                  tx.amount > 0 ? "text-success" : "text-destructive"
                }`}
              >
                {tx.amount > 0 ? "+" : ""}
                {formatRupiah(Math.abs(tx.amount))}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating badges */}
      <FloatingCard
        delay={1.2}
        className="absolute -top-4 -right-4 sm:-top-6 sm:-right-8 z-10"
      >
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border shadow-lg text-xs font-medium">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10">
            <TrendingUp className="h-3 w-3 text-success" />
          </span>
          Surplus bulan ini!
        </div>
      </FloatingCard>

      <FloatingCard
        delay={1.5}
        className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-8 z-10"
      >
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border shadow-lg text-xs font-medium">
          <span className="text-base">🎯</span>
          Target 65% tercapai
        </div>
      </FloatingCard>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lime/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12 lg:mb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="h-4 w-4" />
            Pencatatan keuangan yang simpel & powerful
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold font-[family-name:var(--font-heading)] tracking-tight leading-[1.1] mb-6"
          >
            Kelola Keuanganmu,
            <br />
            <span className="bg-gradient-to-r from-primary to-lime bg-clip-text text-transparent">
              Tanpa Ribet.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Catat pemasukan & pengeluaran, lacak budget, pantau investasi, dan
            capai tujuan finansialmu. Semua di satu tempat.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/register">
              <Button
                size="lg"
                className="rounded-full px-8 text-base font-semibold gap-2 bg-primary hover:bg-primary/90 h-12"
              >
                Mulai Gratis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#fitur">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-base font-semibold h-12"
              >
                Lihat Fitur
              </Button>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Data terenkripsi
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Setup 5 menit
            </div>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              1.000+ pengguna
            </div>
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <DashboardPreview />
      </div>
    </section>
  );
}
