"use client";

import { Search, Download, BadgeCheck } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    { icon: <Search size={20} />, title: "1. Browse the Gallery", desc: "Explore curated assets from professional creators across every category." },
    { icon: <BadgeCheck size={20} />, title: "2. Pick Your Plan", desc: "Grab free resources instantly or unlock everything with a VIP membership." },
    { icon: <Download size={20} />, title: "3. Download & Create", desc: "Access your resource and bring your next masterpiece to life." },
  ];
  return (
    <section className="bg-white dark:bg-zinc-900/40 border-y border-slate-100 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.title} className="text-center p-6">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">{s.icon}</div>
              <h3 className="font-black text-slate-900 dark:text-white mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
