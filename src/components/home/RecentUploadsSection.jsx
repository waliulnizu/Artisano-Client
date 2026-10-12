"use client";

import Link from "next/link";

export default function RecentUploadsSection({ items }) {
  if (!items.length) return null;
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Fresh from the Community</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">The newest assets uploaded by our artists.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((asset) => (
          <Link
            key={asset._id}
            href={`/artwork/${asset._id}`}
            className="group text-left bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="h-32 bg-slate-100 dark:bg-zinc-800 overflow-hidden">
              <img
                src={asset.featuredImage || "https://placehold.co/600x400"}
                alt={asset.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{asset.title}</p>
              <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-zinc-500 mt-0.5">{asset.category || "general"}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
