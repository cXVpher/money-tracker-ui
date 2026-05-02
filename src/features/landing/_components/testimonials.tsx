"use client";

import { ChatCircleText } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { Star } from "@/shared/_components/icons/phosphor";

const testimonials = [
  {
    handle: "@rakapra****",
    name: "Raka P.",
    rating: 5,
    text: "Pindah dari Excel ke DuitKu, tracking harian jadi lebih konsisten. Nggak drama rumus lagi.",
  },
  {
    handle: "@alyah****",
    name: "Alya H.",
    rating: 5,
    text: "Buat cashflow bulanan, DuitKu enak banget dibaca. Tetap pegang kontrol, tapi nggak capek input ulang.",
  },
  {
    handle: "@dimasn****",
    name: "Dimas N.",
    rating: 5,
    text: "Paling kepake pas review cashflow mingguan, nggak perlu susun data dari nol lagi.",
  },
  {
    handle: "@nadia****",
    name: "Nadia S.",
    rating: 5,
    text: "Yang saya suka, alurnya jelas. Tinggal catat, sisanya langsung kebaca di dashboard.",
  },
  {
    handle: "@sintama****",
    name: "Sinta M.",
    rating: 5,
    text: "Flow budget bulanan jadi lebih kebaca, jadi lebih gampang nentuin prioritas pengeluaran.",
  },
  {
    handle: "@farhan****",
    name: "Farhan R.",
    rating: 5,
    text: "Buat catat transaksi cepat di HP, ini lebih praktis daripada buka sheet terus-terusan.",
  },
  {
    handle: "@ashaf****",
    name: "Asha F.",
    rating: 5,
    text: "Tampilannya clean, fiturnya cukup, dan nggak overwhelmed walau dipakai tiap hari.",
  },
  {
    handle: "@rizky****",
    name: "Rizky M.",
    rating: 5,
    text: "Gue udah ga pake spreadsheet lagi, karena pake DuitKu jauh lebih sat-set.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-accent/30 py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <ChatCircleText size={16} weight="fill" />
            Testimoni
          </div>
          <h2 className="mb-4 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Kata Mereka
          </h2>
          <p className="text-lg text-muted-foreground">
            Ini kata mereka ya, bukan minbu.
          </p>
        </motion.div>

        <div className="space-y-4 overflow-hidden">
          <div className="relative">
            <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-20 bg-gradient-to-r from-background to-transparent dark:from-[oklch(0.12_0.005_240)]" />
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-20 bg-gradient-to-l from-background to-transparent dark:from-[oklch(0.12_0.005_240)]" />
            <motion.div
              animate={{ x: [0, -1200] }}
              transition={{
                x: { duration: 40, ease: "linear", repeat: Infinity, repeatType: "loop" },
              }}
              className="flex gap-4"
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </motion.div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-20 bg-gradient-to-r from-background to-transparent dark:from-[oklch(0.12_0.005_240)]" />
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-20 bg-gradient-to-l from-background to-transparent dark:from-[oklch(0.12_0.005_240)]" />
            <motion.div
              animate={{ x: [-1200, 0] }}
              transition={{
                x: { duration: 45, ease: "linear", repeat: Infinity, repeatType: "loop" },
              }}
              className="flex gap-4"
            >
              {[...testimonials.slice(4), ...testimonials.slice(0, 4), ...testimonials].map(
                (testimonial, index) => (
                  <TestimonialCard key={index} {...testimonial} />
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
  handle,
  name,
  rating,
  text,
}: {
  handle: string;
  name: string;
  rating: number;
  text: string;
}) {
  return (
    <div className="w-[320px] flex-shrink-0 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/20">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-lime text-sm font-bold text-primary-foreground">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-muted-foreground">{handle}</p>
        </div>
      </div>
      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
        &ldquo;{text}&rdquo;
      </p>
      <div className="flex gap-0.5">
        {Array.from({ length: rating }).map((_, index) => (
          <Star
            key={index}
            className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
          />
        ))}
      </div>
    </div>
  );
}

