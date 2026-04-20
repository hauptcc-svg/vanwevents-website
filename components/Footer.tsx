"use client";

import { motion } from "framer-motion";

const scrollTo = (id: string) => {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#001030] border-t border-[#C9A84C]/15">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 border border-[#C9A84C]/60 flex items-center justify-center">
                <span className="font-serif text-[#C9A84C] text-lg font-bold">V</span>
              </div>
              <div>
                <div className="font-serif text-white text-base font-semibold tracking-widest">
                  VANWEVENTS
                </div>
                <div className="text-[#C9A84C] text-[9px] tracking-[0.3em] uppercase font-sans">
                  MSC Cruise Collection
                </div>
              </div>
            </div>
            <p className="text-white/40 text-sm font-sans leading-relaxed mb-6 max-w-xs">
              Premium MSC Cruise packages, expertly curated for South African travellers.
              Your voyage of a lifetime starts here.
            </p>
            <div className="flex items-center gap-1">
              <div className="w-6 h-px bg-[#C9A84C]/40" />
              <span className="text-white/25 text-[10px] tracking-widest uppercase font-sans">
                Authorised MSC Reseller
              </span>
            </div>
          </motion.div>

          {/* Navigation col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h4 className="text-[#C9A84C] text-[11px] tracking-[0.3em] uppercase font-sans font-medium mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Explore Voyages", href: "#cruises" },
                { label: "Why Book With Us", href: "#why-us" },
                { label: "Enquire Now", href: "#enquiry" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <button
                    onClick={() => scrollTo(href)}
                    className="text-white/50 hover:text-[#C9A84C] text-sm font-sans transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-4 h-px bg-[#C9A84C] transition-all duration-300" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h4 className="text-[#C9A84C] text-[11px] tracking-[0.3em] uppercase font-sans font-medium mb-6">
              Get In Touch
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:bookings@vanwevents.co.za"
                  className="group flex items-start gap-3 text-white/50 hover:text-white transition-colors duration-300"
                >
                  <svg className="w-4 h-4 mt-0.5 text-[#C9A84C] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <span className="text-sm font-sans">bookings@vanwevents.co.za</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+27605062333"
                  className="group flex items-start gap-3 text-white/50 hover:text-white transition-colors duration-300"
                >
                  <svg className="w-4 h-4 mt-0.5 text-[#C9A84C] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span className="text-sm font-sans">+27 60 506 2333</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/27605062333"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-white/50 hover:text-[#C9A84C] transition-colors duration-300"
                >
                  <svg className="w-4 h-4 mt-0.5 text-[#C9A84C] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.557 4.126 1.533 5.862L.054 23.446a.5.5 0 00.606.606l5.584-1.479A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.52-5.165-1.426l-.371-.22-3.853 1.02 1.02-3.741-.242-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  <span className="text-sm font-sans">WhatsApp: +27 60 506 2333</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/50">
                <svg className="w-4 h-4 mt-0.5 text-[#C9A84C] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="text-sm font-sans">South Africa</span>
              </li>
            </ul>

            <div className="mt-8">
              <button
                onClick={() => scrollTo("#enquiry")}
                className="btn-gold text-xs"
              >
                Start Your Enquiry
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs font-sans text-center md:text-left">
            © {year} VanWEvents (Pty) Ltd · All rights reserved · vanwevents.co.za
          </p>
          <div className="flex items-center gap-6">
            {["Terms & Conditions", "Privacy Policy", "Cancellation Policy"].map((item) => (
              <span
                key={item}
                className="text-white/20 text-xs font-sans cursor-pointer hover:text-white/40 transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
