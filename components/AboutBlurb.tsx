"use client";

import { motion } from "framer-motion";

export default function AboutBlurb() {
  return (
    <section className="bg-[#001A4D] py-20 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-rule mx-auto" />
          <h2 className="font-serif text-white text-3xl md:text-4xl font-bold mb-6">
            Who We Are
          </h2>
          <p className="text-white/70 font-sans text-lg leading-relaxed mb-6">
            VanW Events is a proudly South African, authorised MSC Cruises reseller — bringing
            world-class ocean voyages to South Africans at local prices. We do the hard work
            so you don&apos;t have to: personally curating the best routes, cabins, and
            all-inclusive packages across East Africa, the Mediterranean, Caribbean, and beyond.
          </p>
          <p className="text-white/50 font-sans text-base leading-relaxed">
            Whether it&apos;s your first cruise or your tenth, our team is here from first
            enquiry to boarding day — with ZAR pricing, no hidden fees, and the kind of
            personal service you simply won&apos;t find on a booking engine.
          </p>

          {/* Divider accent */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <span className="block w-12 h-px bg-[#C9A84C]/40" />
            <span className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase font-sans">
              Authorised MSC Reseller · Est. South Africa
            </span>
            <span className="block w-12 h-px bg-[#C9A84C]/40" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
