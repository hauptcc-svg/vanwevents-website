"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import type { Cruise } from "@/lib/cruises";
import { parsePriceZAR, formatZAR } from "@/lib/cruises";

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: PaystackOptions) => { openIframe: () => void };
    };
  }
}

interface PaystackOptions {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  label?: string;
  onClose: () => void;
  callback: (response: { reference: string }) => void;
}

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("A valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  cabinPreference: z.string().min(1, "Please select a cabin type"),
  partySize: z.string().min(1, "Please select number of guests"),
});

type FormData = z.infer<typeof schema>;

export default function BookingPage({ cruise }: { cruise: Cruise }) {
  const [scriptReady, setScriptReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const [apiError, setApiError] = useState("");

  const priceZAR = parsePriceZAR(cruise.priceFrom);
  const deposit = Math.round(priceZAR * 0.33);
  const instalment2 = Math.round(priceZAR * 0.33);
  const instalment3 = priceZAR - deposit - instalment2;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Load Paystack JS once
  useEffect(() => {
    if (document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]')) {
      setScriptReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setScriptReady(true);
    document.body.appendChild(script);
  }, []);

  const submitBooking = async (data: FormData, reference: string) => {
    setApiError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          cruiseInterest: cruise.name,
          cabinPreference: data.cabinPreference,
          partySize: data.partySize,
          message: "",
          paystackReference: reference,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setApiError(json.error ?? "Something went wrong. Please contact us directly.");
        setIsSubmitting(false);
        return;
      }

      setBookingRef(reference);
      setSuccess(true);
    } catch {
      setApiError("Network error — please try again or contact us directly.");
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: FormData) => {
    if (!scriptReady || !window.PaystackPop) {
      setApiError("Payment system not ready. Please refresh the page and try again.");
      return;
    }

    setPaymentCancelled(false);
    setApiError("");
    setIsSubmitting(true);

    const ref = `VWE-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email: data.email,
      amount: deposit * 100, // kobo
      currency: "ZAR",
      ref,
      label: `VanWEvents – ${cruise.name} · Instalment 1 of 3`,
      onClose: () => {
        setPaymentCancelled(true);
        setIsSubmitting(false);
      },
      callback: (response) => {
        submitBooking(data, response.reference);
      },
    }).openIframe();
  };

  /* ─── Success screen ─── */
  if (success) {
    return (
      <div className="min-h-[70vh] bg-[#001A4D] flex items-center justify-center px-6 py-24">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-serif text-white text-4xl font-bold mb-3">Booking Secured!</h1>
          <p className="text-[#C9A84C] text-xs tracking-widest uppercase font-sans mb-6">
            Instalment 1 of 3 paid · {formatZAR(deposit)}
          </p>
          <p className="text-white/70 font-sans leading-relaxed mb-3">
            Thank you for booking{" "}
            <span className="text-white font-semibold">{cruise.name}</span>. A
            confirmation email is on its way with your booking reference and
            instalment schedule.
          </p>
          <p className="text-white/40 text-xs font-mono mb-10">Ref: {bookingRef}</p>
          <Link href="/" className="btn-gold inline-flex">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  /* ─── Main page ─── */
  return (
    <div className="bg-[#001A4D] min-h-screen">
      {/* Hero image */}
      <div className="relative h-72 md:h-[420px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cruise.imageSrc}
          alt={cruise.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001A4D] via-[#001A4D]/40 to-transparent" />
        <div className="absolute bottom-8 left-6 right-6 md:left-12">
          {cruise.badge && (
            <span className="inline-block bg-[#C9A84C] text-[#001A4D] text-[10px] font-bold tracking-widest uppercase px-3 py-1 mb-3">
              {cruise.badge}
            </span>
          )}
          <div className="text-[#C9A84C] text-xs tracking-widest uppercase font-sans mb-1">
            {cruise.region}
          </div>
          <h1 className="font-serif text-white text-4xl md:text-5xl font-bold leading-tight">
            {cruise.name}
          </h1>
          <p className="text-white/60 font-sans text-sm mt-2">
            {cruise.ship} &nbsp;·&nbsp; {cruise.duration} &nbsp;·&nbsp; Departing {cruise.embarkation}
          </p>
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <Link href="/#cruises" className="text-white/40 text-xs font-sans uppercase tracking-wider hover:text-[#C9A84C] transition-colors inline-flex items-center gap-2">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All Voyages
        </Link>
      </div>

      {/* Two-column content */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-14 items-start">

        {/* LEFT: blurb + highlights + payment terms */}
        <div>
          <h2 className="font-serif text-white text-2xl font-semibold mb-4">About This Voyage</h2>
          <p className="text-white/70 font-sans leading-relaxed text-base mb-10">
            {cruise.blurb}
          </p>

          <h3 className="text-[#C9A84C] text-[10px] tracking-widest uppercase font-sans mb-4">
            Highlights
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
            {cruise.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-white/70 text-sm font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] mt-1.5 flex-shrink-0" />
                {h}
              </li>
            ))}
          </ul>

          {/* Payment terms box */}
          <div className="border border-[#C9A84C]/25 rounded-sm p-6 bg-[#C9A84C]/5">
            <h3 className="text-[#C9A84C] text-[10px] tracking-widest uppercase font-sans mb-6">
              Payment Plan — 3 Easy Instalments
            </h3>

            <div className="space-y-5">
              {/* Instalment 1 */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-sans text-sm font-semibold">
                    Instalment 1 — Due Today
                  </div>
                  <div className="text-white/45 text-xs font-sans mt-0.5">
                    Secures your cabin &amp; confirms booking
                  </div>
                </div>
                <div className="text-[#C9A84C] font-serif font-bold text-xl ml-4">
                  {formatZAR(deposit)}
                </div>
              </div>

              <div className="border-t border-white/10" />

              {/* Instalment 2 */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/70 font-sans text-sm">
                    Instalment 2 — ~60 days after booking
                  </div>
                  <div className="text-white/40 text-xs font-sans mt-0.5">
                    Payment link sent by VanWEvents
                  </div>
                </div>
                <div className="text-white/70 font-serif text-lg ml-4">
                  {formatZAR(instalment2)}
                </div>
              </div>

              <div className="border-t border-white/10" />

              {/* Instalment 3 */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/70 font-sans text-sm">
                    Instalment 3 — 30 days before departure
                  </div>
                  <div className="text-white/40 text-xs font-sans mt-0.5">
                    Final balance — payment link sent by VanWEvents
                  </div>
                </div>
                <div className="text-white/70 font-serif text-lg ml-4">
                  {formatZAR(instalment3)}
                </div>
              </div>

              <div className="border-t border-[#C9A84C]/20 pt-4">
                <div className="flex items-center justify-between">
                  <div className="text-white/50 text-xs font-sans uppercase tracking-wider">
                    Total per person from
                  </div>
                  <div className="text-white font-serif font-bold text-xl">
                    {cruise.priceFrom}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: booking form */}
        <div className="lg:sticky lg:top-8">
          <div className="bg-[#002066] border border-white/10 rounded-sm p-8">
            <div className="mb-6">
              <h2 className="font-serif text-white text-2xl font-semibold mb-1">
                Secure Your Spot
              </h2>
              <p className="text-white/50 text-sm font-sans">
                Pay {formatZAR(deposit)} deposit today to confirm your booking.
              </p>
            </div>

            {/* Warnings */}
            {paymentCancelled && (
              <div className="mb-5 p-4 bg-amber-500/10 border border-amber-500/30 rounded-sm">
                <p className="text-amber-400 text-sm font-sans">
                  Payment window was closed. You can try again below.
                </p>
              </div>
            )}
            {apiError && (
              <div className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-sm">
                <p className="text-red-400 text-sm font-sans">{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="form-label">Full Name</label>
                <input
                  {...register("fullName")}
                  className="form-input"
                  placeholder="Jane Smith"
                  autoComplete="name"
                />
                {errors.fullName && (
                  <p className="form-error">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Email Address</label>
                <input
                  {...register("email")}
                  type="email"
                  className="form-input"
                  placeholder="jane@example.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="form-error">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Phone Number</label>
                <input
                  {...register("phone")}
                  type="tel"
                  className="form-input"
                  placeholder="+27 60 000 0000"
                  autoComplete="tel"
                />
                {errors.phone && (
                  <p className="form-error">{errors.phone.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Cabin Type</label>
                  <select {...register("cabinPreference")} className="form-input">
                    <option value="">Select</option>
                    <option value="Interior">Interior</option>
                    <option value="Ocean View">Ocean View</option>
                    <option value="Balcony">Balcony</option>
                    <option value="Suite">Suite</option>
                  </select>
                  {errors.cabinPreference && (
                    <p className="form-error">{errors.cabinPreference.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Guests</label>
                  <select {...register("partySize")} className="form-input">
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={String(n)}>
                        {n} {n === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                  {errors.partySize && (
                    <p className="form-error">{errors.partySize.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !scriptReady}
                className="w-full btn-gold justify-center py-4 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Processing…"
                  : `Pay ${formatZAR(deposit)} Deposit & Book`}
              </button>

              <p className="text-white/30 text-[11px] font-sans text-center leading-relaxed">
                Secure payment via Paystack · Card details never stored by VanWEvents
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
