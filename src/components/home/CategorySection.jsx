"use client";

import Link from "next/link";
import { LayoutGrid, ArrowUpRight, Palette, Wrench, BookOpen, Layers, PenTool, Box, Sparkles } from "lucide-react";

const CONFIG = {
  tool:      { icon: <Wrench size={18} />,     grad: "from-blue-500/15 to-indigo-500/5",     text: "text-blue-500",   ring: "group-hover:border-blue-400/50 group-hover:shadow-blue-500/10" },
  sculpture: { icon: <Box size={18} />,        grad: "from-amber-500/15 to-orange-500/5",     text: "text-amber-500",  ring: "group-hover:border-amber-400/50 group-hover:shadow-amber-500/10" },
  digital:   { icon: <Sparkles size={18} />,   grad: "from-fuchsia-500/15 to-pink-500/5",     text: "text-fuchsia-500",ring: "group-hover:border-fuchsia-400/50 group-hover:shadow-fuchsia-500/10" },
  resource:  { icon: <Layers size={18} />,     grad: "from-emerald-500/15 to-teal-500/5",     text: "text-emerald-500",ring: "group-hover:border-emerald-400/50 group-hover:shadow-emerald-500/10" },
  tutorial:  { icon: <BookOpen size={18} />,   grad: "from-violet-500/15 to-purple-500/5",    text: "text-violet-500", ring: "group-hover:border-violet-400/50 group-hover:shadow-violet-500/10" },
  painting:  { icon: <Palette size={18} />,    grad: "from-rose-500/15 to-red-500/5",         text: "text-rose-500",   ring: "group-hover:border-rose-400/50 group-hover:shadow-rose-500/10" },
  article:   { icon: <PenTool size={18} />,    grad: "from-cyan-500/15 to-sky-500/5",         text: "text-cyan-500",   ring: "group-hover:border-cyan-400/50 group-hover:shadow-cyan-500/10" },
  fallback:  { icon: <LayoutGrid size={18} />, grad: "from-slate-500/15 to-gray-500/5",       text: "text-slate-500",  ring: "group-hover:border-slate-400/50 group-hover:shadow-slate-500/10" },
};

export default function CategorySection({ categories }) {
  if (!categories.length) return null;
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Browse by Category</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">Find exactly the kind of asset you need.</p>
        </div>
        <LayoutGrid className="text-slate-300 dark:text-zinc-700" size={28} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const cfg = CONFIG[cat.name.toLowerCase()] || CONFIG.fallback;
          return (
            <Link
              key={cat.name}
              href={`/browse?category=${encodeURIComponent(cat.name)}`}
              className={`group relative overflow-hidden bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-xl ${cfg.ring} hover:-translate-y-1.5 transition-all duration-300`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cfg.grad} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative flex items-center justify-between mb-4">
                <span className={`inline-flex p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 ${cfg.text} group-hover:scale-110 transition-transform duration-300`}>
                  {cfg.icon}
                </span>
                <ArrowUpRight size={16} className="text-slate-300 dark:text-zinc-700 group-hover:text-slate-500 dark:group-hover:text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </div>

              <p className="relative font-black text-slate-900 dark:text-white capitalize">{cat.name}</p>
              <p className="relative text-xs text-slate-400 dark:text-zinc-500 font-bold mt-1">{cat.count} asset{cat.count !== 1 ? "s" : ""}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
