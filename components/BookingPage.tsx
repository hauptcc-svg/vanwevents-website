"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import type { Cruise } from "@/lib/cruises";
import { parsePriceZAR, formatZAR } from "@/lib/cruises";

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

const inputCls =
  "w-full bg-[#001A4D] border border-white/15 text-white placeholder:text-white/30 " +
  "px-4 py-3 font-sans text-sm outline-none transition-all duration-200 " +
  "focus:border-[#C9A84C] focus:bg-[#C9A84C]/5";

const labelCls = "block text-[10px] font-sans font-semibold tracking-widest uppercase text-white/50 mb-1.5";
const errorCls = "mt-1 text-[11px] text-red-400 font-sans";

export default function BookingPage({ cruise }: { cruise: Cruise }) {
  const [scriptReady, setScriptReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const [apiError, setApiError] = useState("");

  const basePriceZAR = parsePriceZAR(cruise.priceFrom);

  const { register, handleSubmit, control, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const watchedCabin = useWatch({ control, name: "cabinPreference", defaultValue: "" });
  const watchedGuests = useWatch({ control, name: "partySize", defaultValue: "" });

  const cabinMult = CABIN_MULTIPLIERS[watchedCabin] ?? 1;
  const numGuests = parseInt(watchedGuests || "1", 10) || 1;
  const totalPrice = Math.round(basePriceZAR * cabinMult * numGuests);
  const deposit = Math.round(totalPrice * 0.33);
  const inst2 = Math.round(totalPrice * 0.33);
  const inst3 = totalPrice - deposit - inst2;
  const hasSelection = !!watchedCabin && !!watchedGuests;

  useEffect(() => {
    if (document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]')) {
      setScriptReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://js.paystack.co/v1/inline.js";
    s.async = true;
    s.onload = () => setScriptReady(true);
    document.body.appendChild(s);
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
          message: `Total: ${formatZAR(totalPrice)} · Deposit: ${formatZAR(deposit)}`,
          paystackReference: reference,
        }),
      });
      const json = await res.json();
      if (!res.ok) { setApiError(json.error ?? "Something went wrong."); setIsSubmitting(false); return; }
      setBookingRef(reference);
      setSuccess(true);
    } catch {
      setApiError("Network error — please try again or contact us directly.");
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: FormData) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Paystack = (window as any).PaystackPop;
    if (!scriptReady || !Paystack) { setApiError("Payment system not ready. Please refresh the page."); return; }
    setPaymentCancelled(false);
    setApiError("");
    setIsSubmitting(true);
    const ref = `VWE-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    Paystack.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: data.email,
      amount: deposit * 100,
      currency: "ZAR",
      ref,
      label: `${cruise.name} · ${data.cabinPreference} · ${data.partySize} guest(s)`,
      onClose: () => { setPaymentCancelled(true); setIsSubmitting(false); },
      callback: (response: { reference: string }) => { submitBooking(data, response.reference); },
    }).openIframe();
  };

  /* ─── Success ─── */
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
            Thank you for booking <span className="text-white font-semibold">{cruise.name}</span>.
            A confirmation email is on its way with your booking reference and instalment schedule.
          </p>
          <p className="text-white/40 text-xs font-mono mb-10">Ref: {bookingRef}</p>
          <Link href="/" className="btn-gold inline-flex">Back to Home</Link>
        </div>
      </div>
    );
  }

  /* ─── Main ─── */
  return (
    <div className="bg-[#001A4D] min-h-screen">

      {/* Hero */}
      <div className="relative h-[50vh] min-h-[320px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cruise.imageSrc} alt={cruise.name} className="w-full h-full object-cover scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001A4D] via-[#001A4D]/60 to-[#001A4D]/10" />

        {/* Back button top-left */}
        <div className="absolute top-6 left-6">
          <Link href="/#cruises" className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-white/20 hover:border-[#C9A84C]/60 text-white/70 hover:text-[#C9A84C] text-[11px] font-sans uppercase tracking-wider px-4 py-2 transition-all duration-200">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Voyages
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:px-12">
          <div className="max-w-6xl mx-auto">
            {cruise.badge && (
              <span className="inline-block bg-[#C9A84C] text-[#001A4D] text-[10px] font-bold tracking-widest uppercase px-3 py-1 mb-3">
                {cruise.badge}
              </span>
            )}
            <div className="text-[#C9A84C] text-[10px] tracking-widest uppercase font-sans mb-2">{cruise.region}</div>
            <h1 className="font-serif text-white text-4xl md:text-5xl font-bold leading-tight mb-3">
              {cruise.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              <span className="flex items-center gap-1.5 text-white/55 text-xs font-sans">
                <svg className="w-3 h-3 text-[#C9A84C]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {cruise.duration}
              </span>
              <span className="flex items-center gap-1.5 text-white/55 text-xs font-sans">
                <svg className="w-3 h-3 text-[#C9A84C]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Departing {cruise.embarkation}
              </span>
              <span className="text-white/55 text-xs font-sans">{cruise.ship}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">

        {/* LEFT */}
        <div>
          <span className="section-rule" />
          <h2 className="font-serif text-white text-3xl font-bold mb-5">About This Voyage</h2>
          <p className="text-white/65 font-sans leading-relaxed text-base mb-10">{cruise.blurb}</p>

          <div className="text-[#C9A84C] text-[10px] tracking-widest uppercase font-sans mb-4">Highlights</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-12">
            {cruise.highlights.map((h) => (
              <div key={h} className="flex items-start gap-3 bg-white/[0.025] border border-white/[0.07] px-4 py-3">
                <span className="w-1 h-1 rounded-full bg-[#C9A84C] mt-2 flex-shrink-0" />
                <span className="text-white/65 text-sm font-sans">{h}</span>
              </div>
            ))}
          </div>

          {/* Payment plan */}
          <div className="border border-[#C9A84C]/20 bg-[#C9A84C]/[0.04]">
            <div className="border-b border-[#C9A84C]/20 px-6 py-4 flex items-center justify-between">
              <span className="text-[#C9A84C] text-[10px] tracking-widest uppercase font-sans">3-Instalment Payment Plan</span>
              {hasSelection && (
                <span className="text-white/40 text-[10px] font-sans">
                  {watchedCabin} · {watchedGuests} {parseInt(watchedGuests) === 1 ? "guest" : "guests"}
                </span>
              )}
            </div>
            <div className="p-6 space-y-0">
              {/* Row 1 */}
              <div className="flex items-stretch">
                <div className="w-12 flex-shrink-0 flex flex-col items-center pt-1">
                  <div className="w-6 h-6 bg-[#C9A84C] flex items-center justify-center">
                    <span className="text-[#001A4D] text-[9px] font-bold">01</span>
                  </div>
                  <div className="w-px flex-1 bg-white/10 my-2" />
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-white font-sans text-sm font-semibold">Due Today</div>
                      <div className="text-white/40 text-xs mt-0.5">Secures your cabin &amp; confirms booking</div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-[#C9A84C] font-serif font-bold text-2xl leading-none">{formatZAR(deposit)}</div>
                      {hasSelection && <div className="text-white/30 text-[10px] mt-0.5">33% of total</div>}
                    </div>
                  </div>
                </div>
              </div>
              {/* Row 2 */}
              <div className="flex items-stretch">
                <div className="w-12 flex-shrink-0 flex flex-col items-center pt-1">
                  <div className="w-6 h-6 bg-white/10 flex items-center justify-center">
                    <span className="text-white/40 text-[9px] font-bold">02</span>
                  </div>
                  <div className="w-px flex-1 bg-white/10 my-2" />
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-white/60 font-sans text-sm">~60 days after booking</div>
                      <div className="text-white/30 text-xs mt-0.5">Payment link sent by VanWEvents</div>
                    </div>
                    <div className="text-white/55 font-serif text-xl ml-4">{formatZAR(inst2)}</div>
                  </div>
                </div>
              </div>
              {/* Row 3 */}
              <div className="flex items-stretch">
                <div className="w-12 flex-shrink-0 flex flex-col items-center pt-1">
                  <div className="w-6 h-6 bg-white/10 flex items-center justify-center">
                    <span className="text-white/40 text-[9px] font-bold">03</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-white/60 font-sans text-sm">30 days before departure</div>
                      <div className="text-white/30 text-xs mt-0.5">Final balance</div>
                    </div>
                    <div className="text-white/55 font-serif text-xl ml-4">{formatZAR(inst3)}</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#C9A84C]/15 pt-5 mt-5 flex items-center justify-between">
                <span className="text-white/40 text-xs uppercase tracking-wider font-sans">
                  {hasSelection ? "Total booking value" : "Base price per person from"}
                </span>
                <span className="text-white font-serif font-bold text-xl">
                  {hasSelection ? formatZAR(totalPrice) : cruise.priceFrom}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — booking form */}
        <div className="lg:sticky lg:top-24">

          {/* Price header */}
          <div className="bg-gradient-to-r from-[#B8933F] to-[#D4AF50] p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[#001A4D]/70 text-[10px] font-sans font-bold tracking-widest uppercase mb-1">
                    Instalment 1 of 3
                  </div>
                  <div className="font-serif text-[#001A4D] text-4xl font-bold leading-none">
                    {formatZAR(deposit)}
                  </div>
                  <div className="text-[#001A4D]/60 text-xs font-sans mt-1">
                    {hasSelection
                      ? `${watchedCabin} · ${watchedGuests} ${parseInt(watchedGuests) === 1 ? "guest" : "guests"}`
                      : "Select cabin & guests below"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[#001A4D]/50 text-[10px] font-sans uppercase tracking-wider">Total from</div>
                  <div className="font-serif text-[#001A4D]/80 text-lg font-bold">
                    {hasSelection ? formatZAR(totalPrice) : cruise.priceFrom}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cabin pricing grid */}
          <div className="bg-[#001A4D] border border-[#C9A84C]/15 border-t-0">
            <div className="px-6 pt-5 pb-4">
              <div className="text-[#C9A84C] text-[9px] tracking-widest uppercase font-sans mb-3">
                Cabin prices (per person · {numGuests > 1 ? `×${numGuests} guests` : "1 guest"})
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {Object.entries(CABIN_MULTIPLIERS).map(([cabin, mult]) => {
                  const isSelected = watchedCabin === cabin;
                  return (
                    <div key={cabin} className={`flex items-center justify-between py-1 border-b ${isSelected ? "border-[#C9A84C]/30" : "border-white/5"}`}>
                      <span className={`text-xs font-sans ${isSelected ? "text-[#C9A84C] font-semibold" : "text-white/45"}`}>
                        {cabin}
                      </span>
                      <span className={`text-xs font-mono font-medium ${isSelected ? "text-[#C9A84C]" : "text-white/35"}`}>
                        {formatZAR(Math.round(basePriceZAR * mult))}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <div className="px-6 pb-6">

              {paymentCancelled && (
                <div className="mb-4 px-4 py-3 bg-amber-500/10 border border-amber-500/25 flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-amber-300 text-xs font-sans">Payment window closed — you can try again below.</p>
                </div>
              )}
              {apiError && (
                <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/25">
                  <p className="text-red-400 text-xs font-sans">{apiError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Cabin Type</label>
                    <select
                      {...register("cabinPreference")}
                      className={inputCls}
                      style={{ backgroundColor: "#001A4D" }}
                    >
                      <option value="" style={{ backgroundColor: "#001A4D" }}>Select…</option>
                      <option value="Interior" style={{ backgroundColor: "#001A4D" }}>Interior</option>
                      <option value="Ocean View" style={{ backgroundColor: "#001A4D" }}>Ocean View</option>
                      <option value="Balcony" style={{ backgroundColor: "#001A4D" }}>Balcony</option>
                      <option value="Suite" style={{ backgroundColor: "#001A4D" }}>Suite</option>
                    </select>
                    {errors.cabinPreference && <p className={errorCls}>{errors.cabinPreference.message}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Guests</label>
                    <select
                      {...register("partySize")}
                      className={inputCls}
                      style={{ backgroundColor: "#001A4D" }}
                    >
                      <option value="" style={{ backgroundColor: "#001A4D" }}>Select…</option>
                      {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                        <option key={n} value={String(n)} style={{ backgroundColor: "#001A4D" }}>
                          {n} {n === 1 ? "guest" : "guests"}
                        </option>
                      ))}
                    </select>
                    {errors.partySize && <p className={errorCls}>{errors.partySize.message}</p>}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <input {...register("fullName")} className={inputCls} placeholder="Jane Smith" autoComplete="name" />
                    {errors.fullName && <p className={errorCls}>{errors.fullName.message}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Email Address</label>
                  <input {...register("email")} type="email" className={inputCls} placeholder="jane@example.com" autoComplete="email" />
                  {errors.email && <p className={errorCls}>{errors.email.message}</p>}
                </div>

                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input {...register("phone")} type="tel" className={inputCls} placeholder="+27 60 000 0000" autoComplete="tel" />
                  {errors.phone && <p className={errorCls}>{errors.phone.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !scriptReady}
                  className="w-full btn-gold justify-center py-4 text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing…
                    </>
                  ) : (
                    <>
                      Pay {formatZAR(deposit)} Deposit &amp; Book
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-around pt-3">
                  {[
                    { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", label: "Secure Payment" },
                    { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", label: "MSC Authorised" },
                    { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label: "Email Confirmed" },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1.5">
                      <svg className="w-4 h-4 text-[#C9A84C]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                      </svg>
                      <span className="text-white/25 text-[10px] font-sans text-center leading-tight">{label}</span>
                    </div>
                  ))}
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
