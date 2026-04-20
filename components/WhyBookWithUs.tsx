"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: "Expert Curation",
    description:
      "Each MSC package in our collection is personally vetted for quality, value, and unforgettable experiences tailored to South African travellers.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: "Local Support",
    description:
      "We're a proudly South African team offering ZAR pricing, local knowledge, and support in your time zone — from first enquiry to boarding day.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Secure Booking",
    description:
      "Your booking and payment details are processed with industry-standard security. Peace of mind is included in every package we offer.",
    badge: "Payment gateway coming soon",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    title: "All-Inclusive Value",
    description:
      "Our packages are transparent — no hidden fees, no surprises. What you see is what you pay, and we always negotiate the best available rates.",
  },
];

export default function WhyBookWithUs() {
  return (
    <section id="why-us" className="bg-[#002066] py-24 px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-5 pointer-events-none">
        <div className="w-full h-full rounded-full border-[60px] border-[#C9A84C] translate-x-1/2 -translate-y-1/4" />
      </div>
      <div className="absolute bottom-0 left-0 w-64 h-64 opacity-5 pointer-events-none">
        <div className="w-full h-full rounded-full border-[40px] border-[#C9A84C] -translate-x-1/2 translate-y-1/4" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <span className="section-rule mx-auto" />
          <h2 className="font-serif text-white text-4xl md:text-5xl font-bold mb-4">
            The VanWEvents Difference
          </h2>
          <p className="text-white/60 font-sans text-base leading-relaxed">
            We&apos;re not just a booking service — we&apos;re your dedicated cruise concierge,
            guiding you from dream to departure.
          </p>
        </motion.div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group relative p-8 border border-[#C9A84C]/10 hover:border-[#C9A84C]/40 transition-all duration-500 bg-[#001A4D]/40 hover:bg-[#001A4D]/80"
            >
              {/* Icon */}
              <div className="text-[#C9A84C] mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                {pillar.icon}
              </div>

              {/* Title */}
              <h3 className="font-serif text-white text-xl font-semibold mb-3">
                {pillar.title}
              </h3>

              {/* Description */}
              <p className="text-white/55 text-sm font-sans leading-relaxed">
                {pillar.description}
              </p>

              {/* Optional badge */}
              {pillar.badge && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 border border-[#C9A84C]/30 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
                  <span className="text-[#C9A84C] text-[10px] tracking-wider uppercase">
                    {pillar.badge}
                  </span>
                </div>
              )}

              {/* Corner gold accent */}
              <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[24px] border-b-[24px] border-r-[#C9A84C]/20 border-b-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Partner strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-px bg-[#C9A84C]/50" />
            <p className="text-white/40 text-sm font-sans tracking-wide">
              Authorised MSC Cruises Reseller · South Africa
            </p>
          </div>
          <div className="flex items-center gap-8">
            {["MSC Cruises", "PayFast", "Verified Reseller"].map((item) => (
              <span key={item} className="text-white/25 text-xs font-sans tracking-widest uppercase">
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
