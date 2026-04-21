"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Cruises", href: "#cruises" },
  { label: "Why Us", href: "#why-us" },
  { label: "Contact", href: "#enquiry" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (isHome) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    // If not on home, the <Link> href="/#section" handles navigation
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#001A4D]/95 backdrop-blur-md border-b border-[#C9A84C]/20 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo — always goes home */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 border border-[#C9A84C]/60 flex items-center justify-center group-hover:border-[#C9A84C] transition-colors duration-300">
                <span className="font-serif text-[#C9A84C] text-lg font-bold leading-none">V</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-serif text-white text-lg font-semibold tracking-widest leading-none">
                  VANWEVENTS
                </div>
                <div className="text-[#C9A84C] text-[9px] tracking-[0.3em] uppercase font-sans font-light mt-0.5">
                  MSC Cruise Collection
                </div>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={`/${link.href}`}
                  onClick={() => handleNavClick(link.href)}
                  className="text-white/70 hover:text-[#C9A84C] text-sm font-sans font-medium tracking-widest uppercase transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA + hamburger */}
            <div className="flex items-center gap-4">
              <Link
                href="/#enquiry"
                onClick={() => handleNavClick("#enquiry")}
                className="hidden md:inline-flex btn-gold text-xs"
              >
                Book Enquiry
              </Link>

              <button
                className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                <span className={`block w-6 h-px bg-white transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
                <span className={`block w-6 h-px bg-white transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
                <span className={`block w-6 h-px bg-white transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#001A4D] pt-20 flex flex-col"
          >
            <div className="flex flex-col items-center gap-8 mt-16">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={`/${link.href}`}
                  onClick={() => handleNavClick(link.href)}
                  className="text-white text-2xl font-serif font-semibold hover:text-[#C9A84C] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#enquiry"
                onClick={() => handleNavClick("#enquiry")}
                className="btn-gold mt-4"
              >
                Book Enquiry
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
