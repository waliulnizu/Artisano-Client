"use client";

import Link from "next/link";
import { Crown, Check } from "lucide-react";

export default function VipCtaSection() {
  const perks = [
    "Unlimited access to premium-only assets",
    "Early releases from top artists",
    "High-resolution commercial license",
    "Support independent creators directly",
  ];
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="rounded-3xl bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-950 dark:to-orange-950 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-lg">
          <span className="inline-flex items-center gap-1.5 text-amber-950 dark:text-amber-300 bg-white/30 dark:bg-white/5 border border-white/30 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest">
            <Crown size={12} /> VIP Premium
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white mt-4 tracking-tight">Unlock the full gallery</h2>
          <ul className="mt-4 space-y-2">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-2 text-white/90 text-sm font-medium">
                <Check size={14} className="text-white" /> {p}
              </li>
            ))}
          </ul>
        </div>
        <Link href="/premium" className="flex-shrink-0 bg-white text-amber-700 font-black px-8 py-4 rounded-2xl shadow-lg hover:scale-[1.05] transition-transform text-sm">
          Become a Member
        </Link>
      </div>
    </section>
  );
}
