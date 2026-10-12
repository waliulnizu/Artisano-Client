"use client";

import Link from "next/link";
import { Trophy, ArrowRight, Palette } from "lucide-react";

export default function ArtistsOfMonthSection({ artists }) {
  if (!artists.length) return null;

  const top = [...artists].sort((a, b) => b.count - a.count).slice(0, 3);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1.5 rounded-full">
          <Trophy size={12} /> Top Creators
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-5">Artists of the Month</h2>
        <p className="text-slate-500 dark:text-zinc-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
          Meet the visionary artists whose works are capturing the most attention and sales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {top.map((a, index) => (
          <div
            key={a.id || a.name}
            className="relative bg-white dark:bg-zinc-900 border border-emerald-100/60 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-2 transition-all duration-300"
          >
            <div className="relative h-40 bg-gradient-to-br from-emerald-200/60 via-teal-100/60 to-lime-100/60 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-lime-950/20">
              <span className="absolute top-4 right-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur text-xs font-black text-slate-700 dark:text-zinc-300 px-3 py-1.5 rounded-full border border-white/60 dark:border-zinc-700 shadow-sm">
                #{index + 1}
              </span>
            </div>

            <div className="px-6 pb-6 -mt-14 text-center">
              <img
                src={a.image || "https://i.ibb.co/4pDNDk1/avatar.png"}
                alt={a.name}
                onError={(e) => { e.currentTarget.src = "https://i.ibb.co/4pDNDk1/avatar.png"; }}
                className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-white dark:border-zinc-900 shadow-lg"
              />
              <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white capitalize">{a.name}</h3>
              <span className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-500/20 px-3 py-1 rounded-full">
                <Palette size={11} /> {a.count} {a.count !== 1 ? "Assets" : "Asset"}
              </span>
              <Link
                href={`/artist/${encodeURIComponent(a.name)}`}
                className="mt-5 flex items-center justify-center gap-2 w-full bg-amber-100/70 dark:bg-amber-950/30 hover:bg-amber-200/70 dark:hover:bg-amber-950/50 text-amber-900 dark:text-amber-300 text-sm font-bold py-3 rounded-2xl transition"
              >
                View Portfolio <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
