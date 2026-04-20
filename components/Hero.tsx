"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const scrollTo = (id: string) => {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
};

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = 0.85;
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-[#001A4D]">
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => setVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
        poster="/videos/hero-poster.jpg"
      >
        {/* Primary: processed WhatsApp video */}
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Fallback gradient (shown until video loads or if no video) */}
      {!videoLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#001A4D] via-[#003087] to-[#001A4D]">
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 20% 50%, #C9A84C22 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #003087 0%, transparent 50%)",
            }}
          />
        </div>
      )}

      {/* Overlay */}
      <div className="video-overlay" />

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#001A4D] to-transparent" />

      {/* Gold side accent */}
      <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-[#C9A84C]/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Eyebrow */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0.1}
          variants={fadeUp}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <span className="block w-8 h-px bg-[#C9A84C]" />
          <span className="text-[#C9A84C] text-[11px] tracking-[0.4em] uppercase font-sans font-medium">
            Authorised MSC Cruises Reseller
          </span>
          <span className="block w-8 h-px bg-[#C9A84C]" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial="hidden"
          animate="visible"
          custom={0.25}
          variants={fadeUp}
          className="font-serif text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6"
        >
          Sail Into
          <br />
          <span className="text-gold-shimmer italic">Luxury</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial="hidden"
          animate="visible"
          custom={0.45}
          variants={fadeUp}
          className="font-sans text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12"
        >
          Premium MSC Cruise packages, personally curated for South Africa.
          From East African shores to Mediterranean dreams — your voyage begins here.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0.6}
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => scrollTo("#cruises")}
            className="btn-gold"
          >
            Explore Voyages
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <button
            onClick={() => scrollTo("#enquiry")}
            className="btn-ghost"
          >
            Enquire Now
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0.8}
          variants={fadeUp}
          className="flex items-center justify-center gap-8 sm:gap-16 mt-16 pt-12 border-t border-white/10"
        >
          {[
            { value: "6+", label: "Destinations" },
            { value: "MSC", label: "Partner" },
            { value: "ZAR", label: "Local Pricing" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-serif text-[#C9A84C] text-2xl font-bold">{value}</div>
              <div className="text-white/50 text-xs tracking-widest uppercase font-sans mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => scrollTo("#cruises")}
      >
        <span className="text-white/30 text-[10px] tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#C9A84C]/60 to-transparent animate-float" />
      </motion.div>
    </section>
  );
}
