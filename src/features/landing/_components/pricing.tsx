"use client";

import { DiamondsFour } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "@/shared/_components/icons/phosphor";
import Link from "next/link";
import { Button } from "@/shared/_components/ui/button";

const plans = [
  {
    badge: "Mulai Sekarang",
    badgeIcon: null,
    cta: "Mulai Gratis",
    ctaVariant: "outline" as const,
    description: "Catat keuangan tanpa biaya",
    features: [
      { included: true, text: "50 transaksi / bulan" },
      { included: true, text: "Dashboard dasar" },
      { included: true, text: "3 akun finansial" },
      { included: true, text: "Budget tracking" },
      { included: false, text: "Analitik mendalam" },
      { included: false, text: "AI Assistant" },
      { included: false, text: "Scan struk" },
      { included: false, text: "Export data" },
    ],
    highlighted: false,
    name: "Gratis",
    price: "Rp0",
    priceNote: "Selamanya",
  },
  {
    badge: "Paling Pas",
    badgeIcon: Sparkles,
    cta: "Pilih Pro",
    ctaVariant: "default" as const,
    description: "Untuk yang serius kelola keuangan",
    features: [
      { included: true, text: "Transaksi unlimited" },
      { included: true, text: "Dashboard lengkap" },
      { included: true, text: "Akun finansial unlimited" },
      { included: true, text: "Budget & target tabungan" },
      { included: true, text: "Analitik & laporan lengkap" },
      { included: true, text: "Kelola hutang & tagihan" },
      { included: true, text: "Kalender keuangan" },
      { included: true, text: "Export CSV & PDF" },
    ],
    highlighted: true,
    name: "Pro",
    price: "Rp49rb",
    priceNote: "/ bulan",
  },
  {
    badge: "Power User",
    badgeIcon: Zap,
    cta: "Pilih Pro+",
    ctaVariant: "outline" as const,
    description: "Semua fitur Pro + AI canggih",
    features: [
      { included: true, text: "Semua fitur Pro" },
      { included: true, text: "AI chat catat transaksi" },
      { included: true, text: "Scan struk & nota otomatis" },
      { included: true, text: "Input suara -> transaksi" },
      { included: true, text: "AI insight & rekomendasi" },
      { included: true, text: "Laporan AI bulanan" },
      { included: true, text: "WhatsApp bot integrasi" },
      { included: true, text: "Prioritas support" },
    ],
    highlighted: false,
    name: "Pro+",
    price: "Rp89rb",
    priceNote: "/ bulan",
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
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <DiamondsFour size={16} weight="fill" />
            Harga
          </div>
          <h2 className="mb-4 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Investasi Kecil, Manfaat Besar
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Mulai gratis, upgrade kapan saja. Pilih paket yang sesuai kebutuhanmu.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                plan.highlighted
                  ? "scale-[1.02] border-primary bg-card shadow-xl shadow-primary/10"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                    Terpopuler
                  </span>
                </div>
              )}

              <div className="mb-4 flex items-center gap-2">
                {plan.badgeIcon && <plan.badgeIcon className="h-4 w-4 text-primary" />}
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {plan.badge}
                </span>
              </div>

              <h3 className="mb-1 font-[family-name:var(--font-heading)] text-xl font-bold">
                {plan.name}
              </h3>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="font-[family-name:var(--font-heading)] text-3xl font-bold">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">{plan.priceNote}</span>
              </div>
              <p className="mb-6 text-sm text-muted-foreground">{plan.description}</p>

              <Link href="/register">
                <Button
                  variant={plan.ctaVariant}
                  className={`mb-6 w-full rounded-full font-semibold ${
                    plan.highlighted ? "bg-primary hover:bg-primary/90" : ""
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>

              <div className="flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature.text} className="flex items-start gap-2.5">
                    <div
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                        feature.included
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Check className="h-2.5 w-2.5" />
                    </div>
                    <span
                      className={`text-sm ${
                        feature.included
                          ? "text-foreground"
                          : "text-muted-foreground line-through"
                      }`}
                    >
                      {feature.text}
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

