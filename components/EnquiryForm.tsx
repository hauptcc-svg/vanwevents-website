"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { cruises } from "@/lib/cruises";

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  cruiseInterest: z.string().min(1, "Please select a cruise"),
  cabinPreference: z.string().min(1, "Please select a cabin type"),
  partySize: z.string().min(1, "Please enter your party size"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const cabinOptions = [
  { value: "Inside Cabin", label: "Inside Cabin — Best Value" },
  { value: "Oceanview Cabin", label: "Oceanview Cabin — Sea Views" },
  { value: "Balcony Cabin", label: "Balcony Cabin — Private Balcony" },
  { value: "Suite", label: "Suite — Ultimate Luxury" },
];

export default function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong. Please contact us directly.");
      }
      setSubmitted(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="enquiry"
      className="bg-[#001A4D] py-24 px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #C9A84C 0px, #C9A84C 1px, transparent 1px, transparent 40px)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:sticky lg:top-28"
          >
            <span className="section-rule" />
            <h2 className="font-serif text-white text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Start Your
              <br />
              <span className="text-gold-shimmer italic">Voyage</span>
            </h2>
            <p className="text-white/60 font-sans text-base leading-relaxed mb-8">
              Fill in the form and our team will reach out within{" "}
              <span className="text-[#C9A84C]">24 hours</span> with personalised
              pricing, availability, and full itinerary details.
            </p>

            {/* Instalment breakdown */}
            <div className="space-y-3 mb-8">
              {[
                { n: 1, label: "Due on confirmation", note: "33% secures your cabin" },
                { n: 2, label: "Due at 60 days", note: "Sent via payment link" },
                { n: 3, label: "Due at 30 days before departure", note: "Final balance" },
              ].map(({ n, label, note }) => (
                <div key={n} className="flex items-center gap-3 text-sm font-sans">
                  <span className="w-6 h-6 rounded-full border border-[#C9A84C]/50 flex items-center justify-center text-[#C9A84C] text-xs font-bold flex-shrink-0">
                    {n}
                  </span>
                  <span className="text-white/70">
                    <span className="text-white font-medium">Instalment {n}</span>
                    {" · "}{label}{" "}
                    <span className="text-white/40">— {note}</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Contact info */}
            <div className="space-y-4">
              {[
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  ),
                  label: "bookings@vanwevents.co.za",
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  ),
                  label: "WhatsApp: +27 60 506 2333",
                },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-white/50 text-sm font-sans">
                  <svg className="w-5 h-5 text-[#C9A84C] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {icon}
                  </svg>
                  {label}
                </div>
              ))}
            </div>

            {/* Decorative ship */}
            <div className="mt-12 text-white/5 select-none hidden lg:block">
              <svg viewBox="0 0 200 80" className="w-48 fill-current">
                <path d="M10 60 Q100 20 190 60 L190 70 L10 70 Z" />
                <rect x="90" y="20" width="20" height="40" />
                <rect x="100" y="10" width="2" height="20" />
              </svg>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="h-full flex flex-col items-center justify-center text-center py-16 border border-[#C9A84C]/30 px-8"
                >
                  <div className="w-16 h-16 border border-[#C9A84C]/50 flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-white text-2xl font-semibold mb-3">
                    Enquiry Received!
                  </h3>
                  <p className="text-white/60 font-sans text-sm leading-relaxed max-w-xs mb-4">
                    Thank you for reaching out. Our team will be in touch within{" "}
                    <span className="text-[#C9A84C]">24 hours</span> with
                    personalised pricing and availability.
                  </p>
                  <div className="w-12 h-px bg-[#C9A84C]/40 mx-auto mt-2" />
                  <p className="text-white/30 text-xs font-sans mt-4 tracking-wide">
                    Check your inbox for a confirmation email
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                  noValidate
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[#C9A84C] text-[11px] tracking-widest uppercase font-sans mb-2">
                        Full Name *
                      </label>
                      <input
                        {...register("fullName")}
                        placeholder="Jane Smith"
                        className="input-luxury"
                      />
                      {errors.fullName && (
                        <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[#C9A84C] text-[11px] tracking-widest uppercase font-sans mb-2">
                        Phone *
                      </label>
                      <input
                        {...register("phone")}
                        placeholder="+27 82 000 0000"
                        className="input-luxury"
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#C9A84C] text-[11px] tracking-widest uppercase font-sans mb-2">
                      Email Address *
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="jane@example.com"
                      className="input-luxury"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#C9A84C] text-[11px] tracking-widest uppercase font-sans mb-2">
                      Cruise Interest *
                    </label>
                    <select
                      {...register("cruiseInterest")}
                      id="cruise-interest"
                      className="input-luxury appearance-none"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select a voyage…
                      </option>
                      {cruises.map((c) => (
                        <option key={c.slug} value={c.name} className="bg-[#001A4D]">
                          {c.name} — {c.destination}
                        </option>
                      ))}
                      <option value="Custom Voyage" className="bg-[#001A4D]">
                        Custom Voyage (Tell us your dream)
                      </option>
                    </select>
                    {errors.cruiseInterest && (
                      <p className="text-red-400 text-xs mt-1">{errors.cruiseInterest.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[#C9A84C] text-[11px] tracking-widest uppercase font-sans mb-2">
                        Cabin Preference *
                      </label>
                      <select
                        {...register("cabinPreference")}
                        className="input-luxury appearance-none"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select cabin…
                        </option>
                        {cabinOptions.map((o) => (
                          <option key={o.value} value={o.value} className="bg-[#001A4D]">
                            {o.label}
                          </option>
                        ))}
                      </select>
                      {errors.cabinPreference && (
                        <p className="text-red-400 text-xs mt-1">{errors.cabinPreference.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[#C9A84C] text-[11px] tracking-widest uppercase font-sans mb-2">
                        Party Size *
                      </label>
                      <select
                        {...register("partySize")}
                        className="input-luxury appearance-none"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Number of guests…
                        </option>
                        {["1", "2", "3", "4", "5", "6", "7", "8+"].map((n) => (
                          <option key={n} value={n} className="bg-[#001A4D]">
                            {n} {n === "1" ? "guest" : "guests"}
                          </option>
                        ))}
                      </select>
                      {errors.partySize && (
                        <p className="text-red-400 text-xs mt-1">{errors.partySize.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#C9A84C] text-[11px] tracking-widest uppercase font-sans mb-2">
                      Additional Message
                    </label>
                    <textarea
                      {...register("message")}
                      rows={3}
                      placeholder="Preferred dates, special requirements, or any questions…"
                      className="input-luxury resize-none"
                    />
                  </div>

                  {serverError && (
                    <p className="text-red-400 text-sm border border-red-400/30 px-4 py-3">
                      {serverError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-gold justify-center py-4 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Enquiry
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="text-white/25 text-xs font-sans text-center">
                    Our team will respond within 24 hours · bookings@vanwevents.co.za
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
