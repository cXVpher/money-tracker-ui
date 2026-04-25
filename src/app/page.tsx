import { ComparisonTable } from "@/features/landing/_components/comparison-table";
import { FAQ } from "@/features/landing/_components/faq";
import { Features } from "@/features/landing/_components/feature-grid";
import { Footer } from "@/features/landing/_components/footer";
import { Hero } from "@/features/landing/_components/hero";
import { Navbar } from "@/features/landing/_components/navbar";
import { Pricing } from "@/features/landing/_components/pricing";
import { Testimonials } from "@/features/landing/_components/testimonials";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <ComparisonTable />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
