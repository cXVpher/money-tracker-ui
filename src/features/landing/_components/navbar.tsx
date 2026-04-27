"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon, Wallet } from "lucide-react";
import { Button } from "@/shared/_components/ui/button";
import { APP_NAME } from "@/shared/_constants/brand";
import { NAV_ITEMS } from "@/features/landing/_utils/landing-navigation";

const subscribeToMountState = () => () => {};
const getMountedClientSnapshot = () => true;
const getUnmountedServerSnapshot = () => false;

function useIsMounted() {
  return useSyncExternalStore(
    subscribeToMountState,
    getMountedClientSnapshot,
    getUnmountedServerSnapshot
  );
}

export function Navbar() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isMounted = useIsMounted();

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hasScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-110">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {isMounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}
            <Link href="/login">
              <Button variant="ghost" className="font-medium">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button className="font-medium bg-primary hover:bg-primary/90 rounded-full px-6">
                Daftar Gratis
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            {isMounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
          >
            <div className="px-4 py-4 space-y-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 space-y-2">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button className="w-full rounded-full">Daftar Gratis</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
