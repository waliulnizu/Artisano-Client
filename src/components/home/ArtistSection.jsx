"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const COVERS = [
  "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=800&auto=format&fit=crop",
];

export default function ArtistSection({ artists }) {
  if (!artists.length) return null;
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Featured Artists</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">The creators powering the Artisano community.</p>
        </div>
        <Link href="/artists" className="text-xs font-black text-[#5a6b48] dark:text-emerald-300 bg-[#e9f0dc] dark:bg-emerald-950/30 hover:bg-[#dde7c8] px-4 py-2 rounded-full transition uppercase tracking-wider">
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {artists.slice(0, 8).map((a, index) => (
          <Link
            key={a.id || `${a.name}-${index}`}
            href={`/artist/${encodeURIComponent(a.name)}`}
            className="group relative bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#5a6b48]/10 hover:-translate-y-1.5 hover:border-[#b8c4a0] dark:hover:border-emerald-500/40 transition-all duration-300"
          >
            <div className="relative h-28 overflow-hidden">
              <img
                src={COVERS[index % COVERS.length]}
                alt=""
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <div className="px-5 pb-5 -mt-10 text-center">
              <img
                src={a.image || "https://i.ibb.co/4pDNDk1/avatar.png"}
                alt={a.name}
                onError={(e) => { e.currentTarget.src = "https://i.ibb.co/4pDNDk1/avatar.png"; }}
                className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white dark:border-zinc-900 shadow-lg group-hover:ring-4 group-hover:ring-[#e9f0dc] dark:group-hover:ring-emerald-500/20 transition-all"
              />
              <p className="mt-3 text-base font-black text-slate-900 dark:text-white capitalize truncate">{a.name}</p>
              <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-bold text-[#5a6b48] dark:text-emerald-300 bg-[#e9f0dc] dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-full">
                {a.count} asset{a.count !== 1 ? "s" : ""}
              </span>
              <span className="mt-4 flex items-center justify-center gap-1 text-xs font-black text-[#5a6b48] dark:text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">
                View Portfolio <ArrowRight size={13} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
