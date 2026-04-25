"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";
import { Button } from "@/shared/_components/ui/button";
import Link from "next/link";

const plans = [
  {
    name: "Gratis",
    badge: "Mulai Sekarang",
    badgeIcon: null,
    price: "Rp0",
    priceNote: "Selamanya",
    description: "Catat keuangan tanpa biaya",
    cta: "Mulai Gratis",
    ctaVariant: "outline" as const,
    highlighted: false,
    features: [
      { text: "50 transaksi / bulan", included: true },
      { text: "Dashboard dasar", included: true },
      { text: "3 akun finansial", included: true },
      { text: "Budget tracking", included: true },
      { text: "Analitik mendalam", included: false },
      { text: "AI Assistant", included: false },
      { text: "Scan struk", included: false },
      { text: "Export data", included: false },
    ],
  },
  {
    name: "Pro",
    badge: "Paling Pas",
    badgeIcon: Sparkles,
    price: "Rp49rb",
    priceNote: "/ bulan",
    description: "Untuk yang serius kelola keuangan",
    cta: "Pilih Pro",
    ctaVariant: "default" as const,
    highlighted: true,
    features: [
      { text: "Transaksi unlimited", included: true },
      { text: "Dashboard lengkap", included: true },
      { text: "Akun finansial unlimited", included: true },
      { text: "Budget & target tabungan", included: true },
      { text: "Analitik & laporan lengkap", included: true },
      { text: "Kelola hutang & tagihan", included: true },
      { text: "Kalender keuangan", included: true },
      { text: "Export CSV & PDF", included: true },
    ],
  },
  {
    name: "Pro+",
    badge: "Power User",
    badgeIcon: Zap,
    price: "Rp89rb",
    priceNote: "/ bulan",
    description: "Semua fitur Pro + AI canggih",
    cta: "Pilih Pro+",
    ctaVariant: "outline" as const,
    highlighted: false,
    features: [
      { text: "Semua fitur Pro", included: true },
      { text: "AI chat catat transaksi", included: true },
      { text: "Scan struk & nota otomatis", included: true },
      { text: "Input suara → transaksi", included: true },
      { text: "AI insight & rekomendasi", included: true },
      { text: "Laporan AI bulanan", included: true },
      { text: "WhatsApp bot integrasi", included: true },
      { text: "Prioritas support", included: true },
    ],
  },
];

export function Pricing() {
  return (
    <section id="harga" className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-4">
            💎 Harga
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] tracking-tight mb-4">
            Investasi Kecil, Manfaat Besar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mulai gratis, upgrade kapan saja. Pilih paket yang sesuai kebutuhanmu.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.highlighted
                  ? "border-primary bg-card shadow-xl shadow-primary/10 scale-[1.02]"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                    Terpopuler
                  </span>
                </div>
              )}

              {/* Badge */}
              <div className="flex items-center gap-2 mb-4">
                {plan.badgeIcon && (
                  <plan.badgeIcon className="h-4 w-4 text-primary" />
                )}
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {plan.badge}
                </span>
              </div>

              {/* Name & Price */}
              <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-1">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold font-[family-name:var(--font-heading)]">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.priceNote}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                {plan.description}
              </p>

              {/* CTA */}
              <Link href="/register">
                <Button
                  variant={plan.ctaVariant}
                  className={`w-full rounded-full font-semibold mb-6 ${
                    plan.highlighted ? "bg-primary hover:bg-primary/90" : ""
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>

              {/* Features */}
              <div className="space-y-3 flex-1">
                {plan.features.map((f) => (
                  <div key={f.text} className="flex items-start gap-2.5">
                    <div
                      className={`mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0 ${
                        f.included
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Check className="h-2.5 w-2.5" />
                    </div>
                    <span
                      className={`text-sm ${
                        f.included
                          ? "text-foreground"
                          : "text-muted-foreground line-through"
                      }`}
                    >
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
