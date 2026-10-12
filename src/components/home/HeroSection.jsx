"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SLIDES = [
  {
    tagline: "EXPLORE CURATED DIGITAL ART",
    title: "Discover & Buy",
    accent: "Original Art",
    desc: "Explore a curated selection of global masterpieces from independent creators to world-renowned masters, handpicked to inspire your unique artistic taste and vision.",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1600&auto=format&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=800&auto=format&fit=crop",
  },
  {
    tagline: "EXPLORE CURATED DIGITAL ART",
    title: "Support",
    accent: "Creative Minds",
    desc: "Every purchase you make directly empowers the artist behind the work. Join our vibrant community that values transparency, creative freedom, and sustainable growth.",
    image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1600&auto=format&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?q=80&w=800&auto=format&fit=crop",
  },
  {
    tagline: "EXPLORE CURATED DIGITAL ART",
    title: "Collect",
    accent: "Timeless Pieces",
    desc: "From bold contemporary styles to classic brushwork, find artworks that speak to you and bring them home today.",
    image: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=1600&auto=format&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=800&auto=format&fit=crop",
  },
];

export default function HeroSection({ currentUser = null }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  // Swapping card stack state
  const [topCard, setTopCard] = useState(0); // which card is in front

  useEffect(() => {
    const id = setInterval(() => setTopCard((t) => (t === 0 ? 1 : 0)), 7000);
    return () => clearInterval(id);
  }, []);

  const cards = [
    {
      image: slide.cardImage,
      z: topCard === 0 ? 2 : 1,
      x: topCard === 0 ? 0 : -28,
      y: topCard === 0 ? 0 : 14,
      r: topCard === 0 ? 4 : -8,
      s: topCard === 0 ? 1 : 0.94,
    },
    {
      image: slide.image,
      z: topCard === 1 ? 2 : 1,
      x: topCard === 1 ? 0 : -28,
      y: topCard === 1 ? 0 : 14,
      r: topCard === 1 ? 4 : -8,
      s: topCard === 1 ? 1 : 0.94,
    },
  ];

  return (
    <section className="relative overflow-hidden text-white">
      {/* Background image + dark overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${slide.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#14101f]/95 via-[#1c1430]/80 to-[#1c1430]/40" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in-up">
          <p className="text-[11px] font-black tracking-[0.35em] text-violet-400 uppercase mb-5">{slide.tagline}</p>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-[1.05]">
            {slide.title}
            <br />
            <span className="bg-gradient-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">{slide.accent}</span>
          </h1>
          <p className="mt-6 text-slate-300/90 text-sm sm:text-base max-w-md leading-relaxed">{slide.desc}</p>

          <div className="mt-9 flex flex-col sm:flex-row gap-4">
            <Link
              href="/browse"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-fuchsia-900/40 transition-transform hover:scale-[1.03]"
            >
              Browse Artworks <ArrowRight size={16} />
            </Link>
            <Link
              href={currentUser ? "/dashboard/upload" : "/register"}
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur text-white font-bold px-8 py-4 rounded-full transition"
            >
              Join as Artist
            </Link>
          </div>
        </div>

        {/* Floating preview cards stacked on the right with auto-swapping animation */}
        <div className="hidden md:flex justify-end items-center relative h-80 pr-6">
          <div className="relative w-72 h-80 animate-float-bounce">
            {cards.map((card, i) => (
              <div
                key={card.image + i}
                className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-[1200ms] ease-in-out"
                style={{
                  zIndex: card.z,
                  transform: `translate(${card.x}px, ${card.y}px) rotate(${card.r}deg) scale(${card.s})`,
                  border: card.z === 2 ? "4px solid rgba(255,255,255,0.85)" : "4px solid rgba(255,255,255,0.25)",
                }}
              >
                <img src={card.image} alt="Gallery art" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Carousel dots */}
      <div className="relative flex justify-center gap-2 pb-8">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${i === index ? "w-8 h-2 bg-fuchsia-500" : "w-2 h-2 bg-white/30 hover:bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
