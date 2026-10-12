"use client";

import Link from "next/link";
import { Check, Crown, Sparkles } from "lucide-react";

export default function PricingSection() {
  const tiers = [
    {
      name: "Starter Spark",
      price: "$0",
      period: "forever",
      features: ["3 acquisitions / month", "3 studio uploads", "Comment & review"],
      cta: "Get Started",
      href: "/register",
      highlight: false,
    },
    {
      name: "VIP Premium Pro",
      price: "$29",
      period: "/month",
      features: ["25 acquisitions / month", "Unlimited premium downloads", "25 studio uploads", "Verified profile badge"],
      cta: "Go Premium",
      href: "/premium",
      highlight: true,
    },
    {
      name: "Studio Enterprise",
      price: "$99",
      period: "/month",
      features: ["Unlimited acquisitions", "Unlimited uploads & downloads", "Direct API gateway", "Dedicated node manager"],
      cta: "Scale the Studio",
      href: "/premium",
      highlight: false,
    },
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-center mb-2">Simple Pricing</h2>
      <p className="text-slate-500 dark:text-zinc-400 text-sm text-center mb-2">Start free, upgrade whenever your workflow needs more.</p>
      <p className="text-[11px] text-slate-400 dark:text-zinc-500 text-center mb-10 max-w-2xl mx-auto leading-relaxed">
        Membership unlocks your <span className="font-black">monthly acquisition slots</span> — every masterpiece is still
        purchased separately at its own price.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`rounded-3xl border p-8 shadow-sm transition-transform hover:-translate-y-1 ${
              t.highlight
                ? "bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900"
                : "bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 text-slate-900 dark:text-white"
            }`}
          >
            <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${t.highlight ? "bg-amber-400/20 text-amber-400 dark:text-amber-600" : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400"}`}>
              {t.highlight ? <Crown size={10} /> : <Sparkles size={10} />} {t.name}
            </span>
            <p className="text-4xl font-black mt-4">{t.price}<span className="text-sm font-bold opacity-60">{t.period}</span></p>
            <ul className="mt-6 space-y-2.5">
              {t.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm opacity-90">
                  <Check size={14} className={t.highlight ? "text-emerald-400 dark:text-emerald-600" : "text-emerald-500"} /> {f}
                </li>
              ))}
            </ul>
            <Link href={t.href} className={`mt-8 block text-center font-black text-sm py-3 rounded-2xl transition ${t.highlight ? "bg-amber-400 text-slate-950 hover:bg-amber-300" : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90"}`}>
              {t.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
