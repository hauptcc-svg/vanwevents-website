"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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

// Cabin pricing: each tier is 20% more than the previous (Interior → Ocean View → Balcony → Suite)
const CABIN_MULTIPLIERS: Record<string, number> = {
  Interior: 1.0,
  "Ocean View": 1.2,
  Balcony: 1.44,
  Suite: 1.728,
};

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

  const basePriceZAR = parsePriceZAR(cruise.priceFrom);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Watch cabin + guests to compute live price
  const watchedCabin = useWatch({ control, name: "cabinPreference", defaultValue: "" });
  const watchedGuests = useWatch({ control, name: "partySize", defaultValue: "" });

  const cabinMultiplier = CABIN_MULTIPLIERS[watchedCabin] ?? 1;
  const numGuests = parseInt(watchedGuests || "1", 10) || 1;
  const totalPriceZAR = Math.round(basePriceZAR * cabinMultiplier * numGuests);
  const deposit = Math.round(totalPriceZAR * 0.33);
  const instalment2 = Math.round(totalPriceZAR * 0.33);
  const instalment3 = totalPriceZAR - deposit - instalment2;

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
          message: `Total: ${formatZAR(totalPriceZAR)} · Deposit: ${formatZAR(deposit)}`,
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
      amount: deposit * 100, // kobo/cents
      currency: "ZAR",
      ref,
      label: `VanWEvents – ${cruise.name} · ${data.cabinPreference} · ${data.partySize} guest(s) · Instalment 1 of 3`,
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
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001A4D] via-[#001A4D]/50 to-transparent" />
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
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-white/60 text-sm font-sans">
              <svg className="w-3.5 h-3.5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {cruise.duration}
            </span>
            <span className="text-white/20">·</span>
            <span className="flex items-center gap-1.5 text-white/60 text-sm font-sans">
              <svg className="w-3.5 h-3.5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              Departing {cruise.embarkation}
            </span>
            <span className="text-white/20">·</span>
            <span className="text-white/60 text-sm font-sans">{cruise.ship}</span>
          </div>
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
          <span className="section-rule" />
          <h2 className="font-serif text-white text-3xl font-bold mb-5">About This Voyage</h2>
          <p className="text-white/70 font-sans leading-relaxed text-base mb-10">
            {cruise.blurb}
          </p>

          <h3 className="text-[#C9A84C] text-[10px] tracking-widest uppercase font-sans mb-4">
            Highlights
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
            {cruise.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.06] px-4 py-3 text-white/70 text-sm font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] mt-1.5 flex-shrink-0" />
                {h}
              </li>
            ))}
          </ul>

          {/* Payment terms box */}
          <div className="border border-[#C9A84C]/25 p-6 bg-[#C9A84C]/5">
            <h3 className="text-[#C9A84C] text-[10px] tracking-widest uppercase font-sans mb-6">
              Payment Plan — 3 Easy Instalments
            </h3>

            {/* Live price note */}
            {watchedCabin && watchedGuests && (
              <div className="mb-5 px-4 py-2 bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-[#C9A84C] text-xs font-sans">
                Showing price for <span className="font-semibold">{watchedCabin}</span> cabin · <span className="font-semibold">{watchedGuests} {parseInt(watchedGuests) === 1 ? "guest" : "guests"}</span>
              </div>
            )}

            <div className="space-y-5">
              {/* Instalment 1 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 flex-shrink-0 bg-[#C9A84C] flex items-center justify-center">
                  <span className="text-[#001A4D] text-[10px] font-bold font-sans">01</span>
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <div className="text-white font-sans text-sm font-semibold">Due Today</div>
                    <div className="text-white/45 text-xs font-sans mt-0.5">Secures your cabin &amp; confirms booking</div>
                  </div>
                  <div className="text-[#C9A84C] font-serif font-bold text-xl ml-4">
                    {formatZAR(deposit)}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10" />

              {/* Instalment 2 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 flex-shrink-0 bg-white/10 flex items-center justify-center">
                  <span className="text-white/50 text-[10px] font-bold font-sans">02</span>
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <div className="text-white/70 font-sans text-sm">~60 days after booking</div>
                    <div className="text-white/40 text-xs font-sans mt-0.5">Payment link sent by VanWEvents</div>
                  </div>
                  <div className="text-white/70 font-serif text-lg ml-4">{formatZAR(instalment2)}</div>
                </div>
              </div>

              <div className="border-t border-white/10" />

              {/* Instalment 3 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 flex-shrink-0 bg-white/10 flex items-center justify-center">
                  <span className="text-white/50 text-[10px] font-bold font-sans">03</span>
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <div className="text-white/70 font-sans text-sm">30 days before departure</div>
                    <div className="text-white/40 text-xs font-sans mt-0.5">Final balance — payment link sent by VanWEvents</div>
                  </div>
                  <div className="text-white/70 font-serif text-lg ml-4">{formatZAR(instalment3)}</div>
                </div>
              </div>

              <div className="border-t border-[#C9A84C]/20 pt-4">
                <div className="flex items-center justify-between">
                  <div className="text-white/50 text-xs font-sans uppercase tracking-wider">
                    {watchedCabin && watchedGuests ? "Total booking value" : "Base price per person from"}
                  </div>
                  <div className="text-white font-serif font-bold text-xl">
                    {watchedCabin && watchedGuests ? formatZAR(totalPriceZAR) : cruise.priceFrom}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: booking form */}
        <div className="lg:sticky lg:top-24">
          <div className="overflow-hidden border border-white/10">
            {/* Form header */}
            <div className="bg-[#C9A84C] px-8 py-5">
              <div className="text-[#001A4D] text-[10px] font-sans font-bold tracking-widest uppercase mb-1">
                Instalment 1 of 3
              </div>
              <div className="font-serif text-[#001A4D] text-3xl font-bold">
                {formatZAR(deposit)}
              </div>
              <div className="text-[#001A4D]/60 text-xs font-sans mt-0.5">
                deposit to secure your booking
              </div>
            </div>

            <div className="bg-[#002575] p-8">
              <h2 className="font-serif text-white text-xl font-semibold mb-6">
                Secure Your Spot
              </h2>

              {/* Cabin pricing guide */}
              <div className="mb-6 p-4 bg-white/[0.04] border border-white/[0.08]">
                <div className="text-[#C9A84C] text-[9px] tracking-widest uppercase font-sans mb-3">
                  Cabin pricing (per person)
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {Object.entries(CABIN_MULTIPLIERS).map(([cabin, mult]) => (
                    <div key={cabin} className="flex items-center justify-between">
                      <span className={`text-xs font-sans ${watchedCabin === cabin ? "text-[#C9A84C] font-semibold" : "text-white/50"}`}>
                        {cabin}
                      </span>