"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Raka P.",
    handle: "@rakapra****",
    text: "Pindah dari Excel ke DuitKu, tracking harian jadi lebih konsisten. Nggak drama rumus lagi.",
    rating: 5,
  },
  {
    name: "Alya H.",
    handle: "@alyah****",
    text: "Buat cashflow bulanan, DuitKu enak banget dibaca. Tetap pegang kontrol, tapi nggak capek input ulang.",
    rating: 5,
  },
  {
    name: "Dimas N.",
    handle: "@dimasn****",
    text: "Paling kepake pas review cashflow mingguan, nggak perlu susun data dari nol lagi.",
    rating: 5,
  },
  {
    name: "Nadia S.",
    handle: "@nadia****",
    text: "Yang saya suka, alurnya jelas. Tinggal catat, sisanya langsung kebaca di dashboard.",
    rating: 5,
  },
  {
    name: "Sinta M.",
    handle: "@sintama****",
    text: "Flow budget bulanan jadi lebih kebaca, jadi lebih gampang nentuin prioritas pengeluaran.",
    rating: 5,
  },
  {
    name: "Farhan R.",
    handle: "@farhan****",
    text: "Buat catat transaksi cepat di HP, ini lebih praktis daripada buka sheet terus-terusan.",
    rating: 5,
  },
  {
    name: "Asha F.",
    handle: "@ashaf****",
    text: "Tampilannya clean, fiturnya cukup, dan nggak overwhelmed walau dipakai tiap hari.",
    rating: 5,
  },
  {
    name: "Rizky M.",
    handle: "@rizky****",
    text: "Gue udah ga pake spreadsheet lagi, karena pake DuitKu jauh lebih sat-set. 🚀",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 lg:py-32 bg-accent/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-4">
            💬 Testimoni
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] tracking-tight mb-4">
            Kata Mereka
          </h2>
          <p className="text-lg text-muted-foreground">
            Ini kata mereka ya, bukan minbu.
          </p>
        </motion.div>

        {/* Scrolling rows */}
        <div className="space-y-4 overflow-hidden">
          {/* Row 1 - scrolls left */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none dark:from-[oklch(0.12_0.005_240)]" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none dark:from-[oklch(0.12_0.005_240)]" />
            <motion.div
              animate={{ x: [0, -1200] }}
              transition={{
                x: { repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" },
              }}
              className="flex gap-4"
            >
              {[...testimonials, ...testimonials].map((t, i) => (
                <TestimonialCard key={i} {...t} />
              ))}
            </motion.div>
          </div>

          {/* Row 2 - scrolls right */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none dark:from-[oklch(0.12_0.005_240)]" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none dark:from-[oklch(0.12_0.005_240)]" />
            <motion.div
              animate={{ x: [-1200, 0] }}
              transition={{
                x: { repeat: Infinity, repeatType: "loop", duration: 45, ease: "linear" },
              }}
              className="flex gap-4"
            >
              {[...testimonials.slice(4), ...testimonials.slice(0, 4), ...testimonials].map(
                (t, i) => (
                  <TestimonialCard key={i} {...t} />
                )
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  name,
  handle,
  text,
  rating,
}: {
  name: string;
  handle: string;
  text: string;
  rating: number;
}) {
  return (
    <div className="flex-shrink-0 w-[320px] p-5 rounded-2xl border border-border bg-card hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-lime flex items-center justify-center text-sm font-bold text-primary-foreground">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-muted-foreground">{handle}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        &ldquo;{text}&rdquo;
      </p>
      <div className="flex gap-0.5">
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
          />
        ))}
      </div>
    </div>
  );
}
