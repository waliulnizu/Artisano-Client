"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Image as ImageIcon, Gift, Crown, FolderTree } from "lucide-react";

function CountUp({ end, duration = 900 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.ceil(end / (duration / 16)));
    const id = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(id); }
      else setVal(start);
    }, 16);
    return () => clearInterval(id);
  }, [end, duration]);
  return <>{val}</>;
}

export default function StatsBar({ stats }) {
  const items = [
    { label: "Total Assets", value: stats.total, href: "/browse", icon: <ImageIcon size={18} />, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40" },
    { label: "Free Resources", value: stats.free, href: "/browse?minPrice=0&maxPrice=0", icon: <Gift size={18} />, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
    { label: "Pro Assets", value: stats.premium, href: "/premium", icon: <Crown size={18} />, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40" },
    { label: "Categories", value: stats.categories, href: "/browse", icon: <FolderTree size={18} />, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/40" },
  ];
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((it) => (
          <Link key={it.label} href={it.href} className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-500/40 transition-all duration-300">
            <div className={`p-3 rounded-xl ${it.bg} ${it.color}`}>{it.icon}</div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white leading-none"><CountUp end={it.value} /></p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mt-1">{it.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

