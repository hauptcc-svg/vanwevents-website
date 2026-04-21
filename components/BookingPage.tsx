"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import type { Cruise } from "@/lib/cruises";
import { parsePriceZAR, formatZAR } from "@/lib/cruises";

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

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

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
      setApiError("Network error. Please try again or contact us directly.");
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: FormData) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const PaystackPop = (window as any).PaystackPop;
    if (!scriptReady || !PaystackPop) {
      setApiError("Payment system not ready. Please refresh the page and try again.");
      return;
    }
    setPaymentCancelled(false);
    setApiError("");
    setIsSubmitting(true);
    const ref = `VWE-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: data.email,
      amount: deposit * 100,
      currency: "ZAR",
      ref,
      label: `VanWEvents - ${cruise.name} - Instalment 1 of 3`,
      onClose: () => { setPaymentCancelled(true); setIsSubmitting(false); },
      callback: (response: { reference: string }) => { submitBooking(data, response.reference); },
    }).openIframe();
  };

  /* ─── Success ─── */
  if (success) {
    return (
      <div className="min-h-[80vh] bg-[#001A4D] flex items-center justify-center px-6 py-24">
        <div className="max-w-lg w-full text-center">
          <div className="w-24 h-24 rounded-full bg-[#C9A84C]/10 border-2 border-[#C9A84C]/40 flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="inline-block text-[#C9A84C] text-[10px] tracking-widest uppercase font-sans border border-[#C9A84C]/30 px-4 py-1.5 mb-6">
            Booking Confirmed
          </span>
          <h1 className="font-serif text-white text-4xl font-bold mb-4">{cruise.name}</h1>
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-[#C9A84C] font-serif font-bold text-2xl">{formatZAR(deposit)}</div>
              <div className="text-white/40 text-xs font-sans mt-1">Instalment 1 paid</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-white font-mono text-sm">{bookingRef}</div>
              <div className="text-white/40 text-xs font-sans mt-1">Reference</div>
            </div>
          </div>
          <p className="text-white/60 font-sans leading-relaxed mb-10">
            A confirmation email is on its way to you. Our team will be in touch within 24 hours with your full booking details and instalment schedule.
          </p>
          <Link href="/" className="btn-gold inline-flex">Return to Home</Link>
        </div>
      </div>
    );
  }

  /* ─── Main ─── */
  return (
    <div className="bg-[#001A4D] min-h-screen">

      {/* ── Hero ── */}
      <div className="relative h-[55vh] min-h-[380px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cruise.imageSrc} alt={cruise.name} className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001A4D] via-[#001A4D]/60 to-[#001A4D]/10" />
        {/* Badge */}
        {cruise.badge && (
          <div className="absolute top-8 left-8">
            <span className="bg-[#C9A84C] text-[#001A4D] text-[10px] font-bold tracking-widest uppercase px-3 py-1.5">
              {cruise.badge}
            </span>
          </div>
        )}
        {/* Text */}
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-10">
          <div className="max-w-6xl mx-auto">
            <span className="text-[#C9A84C] text-[10px] tracking-widest uppercase font-sans">{cruise.region}</span>
            <h1 className="font-serif text-white text-4xl md:text-6xl font-bold leading-tight mt-1 mb-3">
              {cruise.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-white/50 font-sans text-sm">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {cruise.ship}
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {cruise.duration}
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Departing {cruise.embarkation}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Back link ── */}
      <div className="max-w-6xl mx-auto px-8 md:px-16 pt-7 pb-2">
        <Link href="/#cruises" className="text-white/35 text-[11px] font-sans uppercase tracking-widest hover:text-[#C9A84C] transition-colors inline-flex items-center gap-2">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All Voyages
        </Link>
      </div>

      {/* ── Content grid ── */}
      <div className="max-w-6xl mx-auto px-8 md:px-16 py-10 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 items-start">

        {/* LEFT */}
        <div>

          {/* About */}
          <div className="mb-12">
            <span className="section-rule" />
            <h2 className="font-serif text-white text-3xl font-bold mb-5">About This Voyage</h2>
            <p className="text-white/65 font-sans leading-[1.85] text-[15px]">{cruise.blurb}</p>
          </div>

          {/* Highlights */}
          <div className="mb-12">
            <h3 className="text-[#C9A84C] text-[10px] tracking-widest uppercase font-sans mb-5">What&apos;s Included</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cruise.highlights.map((h) => (
                <div key={h} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-sm px-4 py-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] flex-shrink-0" />
                  <span className="text-white/70 text-sm font-sans">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment plan */}
          <div>
            <h3 className="text-[#C9A84C] text-[10px] tracking-widest uppercase font-sans mb-6">Payment Plan</h3>
            <div className="space-y-px">
              {/* Step 1 */}
              <div className="flex items-stretch bg-[#C9A84C]/8 border border-[#C9A84C]/25 rounded-t-sm overflow-hidden">
                <div className="w-14 bg-[#C9A84C]/15 flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-[#C9A84C] text-xl font-bold">01</span>
                </div>
                <div className="flex-1 flex items-center justify-between px-5 py-4">
                  <div>
                    <div className="text-white font-sans text-sm font-semibold">Due Today — Secures your booking</div>
                    <div className="text-white/40 text-xs font-sans mt-0.5">Paid now via Paystack</div>
                  </div>
                  <div className="text-[#C9A84C] font-serif font-bold text-xl ml-4 flex-shrink-0">{formatZAR(deposit)}</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-stretch bg-white/[0.03] border border-white/[0.07] overflow-hidden">
                <div className="w-14 bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-white/30 text-xl font-bold">02</span>
                </div>
                <div className="flex-1 flex items-center justify-between px-5 py-4">
                  <div>
                    <div className="text-white/70 font-sans text-sm">Approximately 60 days after booking</div>
                    <div className="text-white/35 text-xs font-sans mt-0.5">Payment link sent to you by VanWEvents</div>
                  </div>
                  <div className="text-white/55 font-serif text-lg ml-4 flex-shrink-0">{formatZAR(instalment2)}</div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-stretch bg-white/[0.03] border border-white/[0.07] rounded-b-sm overflow-hidden">
                <div className="w-14 bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-white/30 text-xl font-bold">03</span>
                </div>
                <div className="flex-1 flex items-center justify-between px-5 py-4">
                  <div>
                    <div className="text-white/70 font-sans text-sm">30 days before departure — Final balance</div>
                    <div className="text-white/35 text-xs font-sans mt-0.5">Payment link sent to you by VanWEvents</div>
                  </div>
                  <div className="text-white/55 font-serif text-lg ml-4 flex-shrink-0">{formatZAR(instalment3)}</div>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between mt-4 px-1">
              <span className="text-white/35 text-xs font-sans uppercase tracking-wider">Total per person from</span>
              <span className="text-white font-serif font-bold text-xl">{cruise.priceFrom}</span>
            </div>
          </div>

        </div>

        {/* RIGHT — Booking form */}
        <div className="lg:sticky lg:top-8">

          {/* Deposit callout */}
          <div className="bg-[#C9A84C] px-6 py-4 flex items-center justify-between rounded-t-sm">
            <div>
              <div className="text-[#001A4D] text-[10px] font-bold tracking-widest uppercase font-sans">Instalment 1 of 3</div>
              <div className="text-[#001A4D] text-[11px] font-sans opacity-70 mt-0.5">Secure your cabin today</div>
            </div>
            <div className="text-[#001A4D] font-serif font-bold text-3xl">{formatZAR(deposit)}</div>
          </div>

          {/* Form card */}
          <div className="bg-[#002575] border border-[#C9A84C]/20 border-t-0 rounded-b-sm p-7">

            <h2 className="font-serif text-white text-xl font-semibold mb-6">Your Details</h2>

            {/* Alerts */}
            {paymentCancelled && (
              <div className="mb-5 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-sm flex items-start gap-3">
                <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-amber-400 text-sm font-sans">Payment window closed. Try again below.</p>
              </div>
            )}
            {apiError && (
              <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-sm flex items-start gap-3">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p className="text-red-400 text-sm font-sans">{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="form-label">Full Name</label>
                <input {...register("fullName")} className="form-input" placeholder="Jane Smith" autoComplete="name" />
                {errors.fullName && <p className="form-error">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="form-label">Email Address</label>
                <input {...register("email")} type="email" className="form-input" placeholder="jane@example.com" autoComplete="email" />
                {errors.email && <p className="form-error">{errors.email.message}</p>}
              </div>

              <div>
                <label className="form-label">Phone Number</label>
                <input {...register("phone")} type="tel" className="form-input" placeholder="+27 60 000 0000" autoComplete="tel" />
                {errors.phone && <p className="form-error">{errors.phone.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Cabin Type</label>
                  <select {...register("cabinPreference")} className="form-input">
                    <option value="">Select</option>
                    <option value="Interior">Interior</option>
                    <option value="Ocean View">Ocean View</option>
                    <option value="Balcony">Balcony</option>
                    <option value="Suite">Suite</option>
                  </select>
                  {errors.cabinPreference && <p className="form-error">{errors.cabinPreference.message}</p>}
                </div>
                <div>
                  <label className="form-label">Guests</label>
                  <select {...register("partySize")} className="form-input">
                    <option value="">Select</option>
                    {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                      <option key={n} value={String(n)}>{n} {n === 1 ? "guest" : "guests"}</option>
                    ))}
                  </select>
                  {errors.partySize && <p className="form-error">{errors.partySize.message}</p>}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !scriptReady}
                  className="w-full bg-[#C9A84C] hover:bg-[#E8C96A] disabled:opacity-40 disabled:cursor-not-allowed text-[#001A4D] font-sans font-bold text-sm tracking-widest uppercase px-6 py-4 transition-colors duration-200 flex items-center justify-center gap-3 rounded-sm"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay {formatZAR(deposit)} Deposit
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Trust row */}
            <div className="mt-6 pt-5 border-t border-white/[0.08] grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <svg className="w-5 h-5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-white/40 text-[10px] font-sans leading-tight">Secure<br/>Payment</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <svg className="w-5 h-5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-white/40 text-[10px] font-sans leading-tight">MSC<br/>Authorised</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <svg className="w-5 h-5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-white/40 text-[10px] font-sans leading-tight">Confirmed<br/>by Email</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
