"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cruises, type Cruise } from "@/lib/cruises";

function CruiseCard({
  cruise,
  index,
}: {
  cruise: Cruise;
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
    if (videoRef.current && cruise.videoSrc) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative overflow-hidden cursor-pointer card-glow transition-all duration-500 border border-[#C9A84C]/10 hover:border-[#C9A84C]/40"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Media container */}
      <div className="relative h-64 bg-[#003087] overflow-hidden">
        {/* Primary image (Unsplash) → gradient fallback on error */}
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cruise.imageSrc}
            alt={cruise.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              hovered && cruise.videoSrc ? "opacity-0" : "opacity-100"
            } group-hover:scale-105`}
            onError={() => setImgError(true)}
          />
        ) : (
          /* Fallback gradient when no image available */
          <div className="absolute inset-0 bg-gradient-to-br from-[#003087] to-[#001A4D] flex items-center justify-center">
            <svg className="w-16 h-16 text-[#C9A84C]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
        )}

        {/* Video (plays on hover) */}
        {cruise.videoSrc && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src={cruise.videoSrc} type="video/mp4" />
          </video>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#001A4D]/80 via-transparent to-transparent" />

        {/* Badge */}
        {cruise.badge && (
          <div className="absolute top-4 right-4 bg-[#C9A84C] text-[#001A4D] text-[10px] font-bold tracking-widest uppercase px-3 py-1">
            {cruise.badge}
          </div>
        )}

        {/* Region chip */}
        <div className="absolute bottom-4 left-4">
          <span className="text-[#C9A84C] text-[10px] tracking-widest uppercase font-sans font-medium">
            {cruise.region}
          </span>
        </div>

        {/* Gold corner accent */}
        <div className={`absolute top-0 left-0 w-8 h-8 transition-all duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <div className="absolute top-0 left-0 w-full h-px bg-[#C9A84C]" />
          <div className="absolute top-0 left-0 h-full w-px bg-[#C9A84C]" />
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#002066] p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-serif text-white text-xl font-semibold leading-tight mb-1">
              {cruise.name}
            </h3>
            <p className="text-white/50 text-xs font-sans tracking-wide">
              {cruise.ship}
            </p>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">From</div>
            <div className="text-[#C9A84C] font-serif font-bold text-lg">{cruise.priceFrom}</div>
            <div className="text-white/40 text-[10px]">per person</div>
          </div>
        </div>

        <p className="text-white/60 text-sm mb-2 font-sans">
          {cruise.destination}
        </p>

        <div className="flex items-center gap-1 mb-5">
          <svg className="w-3 h-3 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-white/50 text-xs font-sans">{cruise.duration}</span>
          <span className="text-white/20 mx-2">·</span>
          <svg className="w-3 h-3 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="text-white/50 text-xs font-sans">{cruise.embarkation}</span>
        </div>

        {/* Highlights */}
        <ul className="space-y-1 mb-6">
          {cruise.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex items-center gap-2 text-white/60 text-xs font-sans">
              <span className="w-1 h-1 rounded-full bg-[#C9A84C] flex-shrink-0" />
              {h}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href={`/cruises/${cruise.slug}`}
          className="w-full btn-gold justify-center text-xs"
        >
          Book This Voyage
        </Link>
      </div>
    </motion.article>
  );
}

export default function FeaturedCruises() {
  const scrollToEnquiry = () => {
    const el = document.querySelector("#enquiry");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="cruises" className="bg-[#001A4D] py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 max-w-xl"
        >
          <span className="section-rule" />
          <h2 className="font-serif text-white text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Handpicked Voyages
          </h2>
          <p className="text-white/60 font-sans text-base leading-relaxed">
            Every cruise in our collection is personally selected for quality, value,
            and the experiences that matter most to South African travellers.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cruises.map((cruise, i) => (
            <CruiseCard
              key={cruise.slug}
              cruise={cruise}
              index={i}
            />
          ))}
        </div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center mt-14"
        >
          <p className="text-white/40 text-sm font-sans mb-4">
            Don&apos;t see what you&apos;re looking for? We can source any MSC voyage.
          </p>
          <button
            onClick={() => scrollToEnquiry()}
            className="btn-ghost"
          >
            Request a Custom Voyage
          </button>
        </motion.div>
      </div>
    </section>
  );
}
