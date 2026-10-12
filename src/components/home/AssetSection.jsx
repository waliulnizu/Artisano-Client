"use client";

import Link from "next/link";
import ArtCard from "@/components/ArtCard";
import PremiumCard from "./PremiumCard";
import FreeCard from "./FreeCard";

const VARIANTS = { default: ArtCard, premium: PremiumCard, free: FreeCard };

export default function AssetSection({ title, subtitle, items, currentUser, actionLoadingId, onResourceAccess, emptyText, viewAllHref = "/browse", variant = "default" }) {
  const Card = VARIANTS[variant] || ArtCard;
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">{subtitle}</p>
        </div>
        <Link href={viewAllHref} className="text-xs font-black text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-wider">View all →</Link>
      </div>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((asset) => (
            <Card
              key={asset._id}
              item={asset}
              currentUser={currentUser}
              actionLoadingId={actionLoadingId}
              onResourceAccess={onResourceAccess}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-400 dark:text-zinc-500 py-10 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">{emptyText}</p>
      )}
    </section>
  );
}
