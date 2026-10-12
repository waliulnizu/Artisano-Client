"use client";

import Link from "next/link";
import { Palette, ArrowRight } from "lucide-react";

export default function ArtistJoinSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 pt-4">
      <div className="rounded-3xl border border-blue-100 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-950/20 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest">
            <Palette size={12} /> For Creators
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-4">Sell your art on Artisano</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-2 max-w-md">Open your studio in minutes. Upload assets, set prices, and start earning from a global community.</p>
        </div>
        <Link href="/register" className="flex-shrink-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black px-7 py-3.5 rounded-2xl shadow-lg transition text-sm">
          Start Selling <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
