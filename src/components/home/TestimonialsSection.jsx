"use client";

import { Star } from "lucide-react";

const TESTIMONIALS = [
  { name: "Rafiq Ahmed", role: "Digital Artist", text: "Uploading my brush packs on Artisano tripled my audience within a month. The dashboard is effortless." },
  { name: "Mina Chowdhury", role: "UI Designer", text: "The VIP membership pays for itself — I saved hours sourcing textures and got a fair commercial license." },
  { name: "Tanvir Hasan", role: "Game Developer", text: "Clean UI, fast downloads, and the free asset section is gold. This is now my first stop for art resources." },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-white dark:bg-zinc-900/40 border-y border-slate-100 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-center mb-10">Loved by Creators</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-zinc-300 mb-4">“{t.text}”</p>
              <p className="font-black text-slate-900 dark:text-white text-sm">{t.name}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
