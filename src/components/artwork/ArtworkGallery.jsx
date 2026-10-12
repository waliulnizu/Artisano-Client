import React from "react";
import { Users } from "lucide-react";

export default function ArtworkGallery({ artwork, acquired }) {
  const isSoldOut = artwork.status === "sold" && !acquired;
  const collectorCount = artwork.collectorCount || 0;

  const statusLabel = acquired ? "Acquired" : isSoldOut ? "Sold Out" : "Available";
  const statusClass = acquired
    ? "bg-[#5a6b48]"
    : isSoldOut
      ? "bg-rose-600"
      : "bg-emerald-500";

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[28px] p-3 shadow-sm">
      <div className="relative h-[360px] sm:h-[520px] rounded-3xl overflow-hidden bg-slate-50 dark:bg-zinc-800">
        <img
          src={artwork.featuredImage}
          alt={artwork.title}
          className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
        />

        {/* Category pill */}
        <span className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm text-white text-[10px]
                         font-black uppercase tracking-widest px-3.5 py-1.5 rounded-lg shadow-sm">
          {artwork.category}
        </span>

        {/* Availability pill */}
        <span className={`absolute top-4 right-4 ${statusClass} text-white text-[10px]
                         font-black uppercase tracking-widest px-3.5 py-1.5 rounded-lg shadow-sm`}>
          {statusLabel}
        </span>

        {/* Social proof strip: how many collectors already own this edition */}
        {collectorCount > 0 && (
          <span className="absolute bottom-4 left-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm
                           text-slate-700 dark:text-zinc-200 text-[10px] font-black uppercase tracking-widest
                           px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
            <Users size={12} className="text-[#5a6b48]" />
            {collectorCount} Collector{collectorCount === 1 ? "" : "s"} Own This Edition
          </span>
        )}
      </div>
    </div>
  );
}
