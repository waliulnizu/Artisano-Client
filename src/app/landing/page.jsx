"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Compass, Crown, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  const highlights = [
    { icon: <Sparkles size={18} />, title: "Curated Assets", desc: "Hand-picked brushes, textures, and tutorials from verified creators." },
    { icon: <Crown size={18} />, title: "VIP Access", desc: "Unlock premium commercial-grade resources with one membership." },
    { icon: <ShieldCheck size={18} />, title: "Safe Licensing", desc: "Clear licenses so you can use assets with confidence." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
      <section className="animate-gradient relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_30%,white,transparent_40%)]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 text-center relative">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6">
            Where Artists <br className="hidden sm:block" /> Share Premium Craft
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto mb-10">
            Artisano is the marketplace for digital artists — upload, sell, and collect high-quality art resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/browse" className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-black px-8 py-4 rounded-2xl hover:scale-[1.03] transition-transform">
              <Compass size={16} /> Browse Assets
            </Link>
            <Link href="/register" className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition">
              Join Free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {highlights.map((h) => (
          <div key={h.title} className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">{h.icon}</div>
            <h3 className="font-black text-slate-900 dark:text-white mb-1">{h.title}</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400">{h.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
