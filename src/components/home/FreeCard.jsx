"use client";

import { ExternalLink, Download, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const getCloudinaryOptimizedUrl = (url, width = 600, height = 350) => {
  if (!url || !url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},h_${height},c_fill/`);
};

export default function FreeCard({ item, currentUser, actionLoadingId, onResourceAccess }) {
  if (!item) return null;

  return (
    <div className="group bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 p-4 shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 relative bg-slate-100 dark:bg-zinc-800">
          <Link href={`/artwork/${item._id}`} className="block w-full h-full">
            <Image
              src={getCloudinaryOptimizedUrl(item.featuredImage) || "https://placehold.co/600x400"}
              alt={item.title || "Free Asset"}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
            <Sparkles size={11} /> FREE
          </span>
        </div>

        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">{item.category || "General"}</span>
        <Link href={`/artwork/${item._id}`}>
          <h3 className="text-base font-black text-slate-900 dark:text-white mt-1 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{item.title}</h3>
        </Link>
        <p className="text-slate-400 dark:text-zinc-500 text-xs mt-1 line-clamp-2">{item.description}</p>
        <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-bold mt-2">By <span className="text-slate-600 dark:text-zinc-300 capitalize">{item.author?.name || "Admin"}</span></p>
      </div>

      <button
        onClick={() => onResourceAccess && onResourceAccess(item)}
        disabled={actionLoadingId === item._id}
        className={`mt-4 w-full flex items-center justify-center gap-2 text-xs font-black px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all ${actionLoadingId === item._id ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {actionLoadingId === item._id ? "Opening..." : <>Download Free <Download size={13} /></>}
      </button>
    </div>
  );
}
