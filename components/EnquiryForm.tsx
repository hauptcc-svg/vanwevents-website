"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { cruises, getDepositZAR, formatZAR } from "@/lib/cruises";

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: PaystackSetupOptions) => { openIframe: () => void };
    };
  }
}

interface PaystackSetupOptions {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  label?: string;
  metadata?: Record<string, unknown>;
  onClose: () => void;
  callback: (response: { reference: string }) => void;
}

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
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const selectedCruise = useWatch({ control, name: "cruiseInterest" });
  const depositZAR = selectedCruise ? getDepositZAR(selectedCruise) : null;

  // Load Paystack inline script once on mount
  useEffect(() => {
    const src = "https://js.paystack.co/v1/inline.js";
    if (document.querySelector(`script[src="${src}"]`)) {
      setScriptReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => setScriptReady(true);
    document.body.appendChild(script);
  }, []);

  const submitEnquiry = async (data: FormData, paystackReference: string) => {
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, paystackReference }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body.error ?? "Something went wrong. Please contact us directly."
        );
      }
      setSubmitted(true);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: FormData) => {
    if (!scriptReady || !window.PaystackPop) {
      setServerError(
        "Payment system not ready. Please refresh the page and try again."
      );
      return;
    }

    setPaymentCancelled(false);
    setServerError(null);
    setIsSubmitting(true);

    const deposit = getDepositZAR(data.cruiseInterest);
    const ref = `VWE-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()}`;

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email: data.email,
      amount: deposit * 100, // kobo
      currency: "ZAR",
      ref,
      label: "VanWEvents – Instalment 1 of 3",
      metadata: {
        custom_fields: [
          { display_name: "Full Name", variable_name: "full_name", value: data.fullName },
          { display_name: "Phone", variable_name: "phone", value: data.phone },
          { display_name: "Cruise", variable_name: "cruise", value: data.cruiseInterest },
          { display_name: "Cabin", variable_name: "cabin", value: data.cabinPreference },
          { display_name: "Party Size", variable_name: "party_size", value: data.partySize },
        ],
      },
      onClose: () => {
        setPaymentCancelled(true);
        setIsSubmitting(false);
      },
      callback: (response: { reference: string }) => {
        submitEnquiry(data, response.reference);
      },
    });

    handler.openIframe();
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
              Complete the form and secure your spot with a{" "}
              <span className="text-[#C9A84C]">33% deposit</span> — paid in
              three easy instalments. Our team will reach out within{" "}
              <span className="text-[#C9A84C]">24 hours</span> with full
              itinerary details.
            </p>

            {/* Instalment breakdown */}
            <div className="space-y-3 mb-8">
              {[
                { n: 1, label: "Due now", note: "Secures your booking" },
                { n: 2, label: "Due at 60 days", note: "Sent via payment link" },
                { n: 3, label: "Due at 30 days", note: "Final balance" },
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
                    Booking Secured!
                  </h3>
                  <p className="text-white/60 font-sans text-sm leading-relaxed max-w-xs mb-4">
                    Your deposit has been received and your spot is confirmed.
                    Our team will be in touch within{" "}
                    <span className="text-[#C9A84C]">24 hours</span> with your
                    full itinerary and instalment schedule.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#C9A84C]/30 rounded-full mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                    <span className="text-[#C9A84C] text-xs tracking-wider uppercase font-sans">
                      Instalment 1 of 3 paid
                    </span>
                  </div>
                  <div className="w-12 h-px bg-[#C9A84C]/40 mx-auto" />
                  <p className="text-white/30 text-xs font-sans mt-4 tracking-wide">
                    Check your inbox for a payment confirmation
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                  noValidate
                >
                  {/* Row 1 */}
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

                  {/* Email */}
                  <div>
                    <label className="block text-[#C9A84C] text-[11px] tracking-widests uppercase font-sans mb-2">
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

                  {/* Cruise Interest */}
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

                  {/* Row 2 */}
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

                  {/* Message */}
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

                  {/* Deposit preview — appears when cruise is selected */}
                  {depositZAR && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between px-4 py-3 border border-[#C9A84C]/25 bg-[#C9A84C]/5"
                    >
                      <div>
                        <p className="text-[#C9A84C] text-[10px] tracking-widest uppercase font-sans">
                          Instalment 1 of 3 · Due now
                        </p>
                        <p className="text-white font-serif text-xl font-semibold mt-0.5">
                          {formatZAR(depositZAR)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-white/40 text-xs font-sans">
                        <svg className="w-4 h-4 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                        Secured by Paystack
                      </div>
                    </motion.div>
                  )}

                  {/* Payment cancelled notice */}
                  {paymentCancelled && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-start gap-3 px-4 py-3 border border-amber-400/30 bg-amber-400/5 text-amber-300 text-sm font-sans"
                    >
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      Payment window closed. Please try again to secure your booking.
                    </motion.div>
                  )}

                  {/* Server error */}
                  {serverError && (
                    <p className="text-red-400 text-sm border border-red-400/30 px-4 py-3">
                      {serverError}
                    </p>
                  )}

                  {/* Submit */}
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
                        Opening Payment…
                      </>
                    ) : (
                      <>
                        {depositZAR
                          ? `Pay ${formatZAR(depositZAR)} Deposit & Book`
                          : "Continue to Payment"}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="text-white/25 text-xs font-sans text-center">
                    Instalment 1 of 3 · Secured by Paystack · ZAR
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
