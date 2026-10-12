import React from "react";
import { FileCheck2, ShieldCheck, Truck } from "lucide-react";

const ITEMS = [
  {
    icon: FileCheck2,
    tint: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300",
    title: "Certificate Included",
    desc: "Signed provenance document with encrypted identity seal.",
  },
  {
    icon: ShieldCheck,
    tint: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300",
    title: "Authenticity Assured",
    desc: "Verified original directly from the creator workshop.",
  },
  {
    icon: Truck,
    tint: "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300",
    title: "White-Glove Logistics",
    desc: "Fully insured global shipping & fine-art packaging.",
  },
];

export default function TrustStrip() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7
                    grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
      {ITEMS.map(({ icon: Icon, tint, title, desc }) => (
        <div key={title} className="flex gap-3.5">
          <span className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center ${tint}`}>
            <Icon size={18} />
          </span>
          <div className="min-w-0">
            <p className="font-black text-sm">{title}</p>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mt-1">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
