"use client";

import { ExternalLink, Lock, Crown, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const getCloudinaryOptimizedUrl = (url, width = 600, height = 350) => {
  if (!url || !url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},h_${height},c_fill/`);
};

export default function PremiumCard({ item, currentUser, actionLoadingId, onResourceAccess }) {
  if (!item) return null;

  const authorId = item.author && typeof item.author === "object" ? (item.author._id || item.author.id) : item.author;
  const currentUserId = currentUser ? (currentUser._id || currentUser.id) : null;
  const isIdMatched = authorId && currentUserId && String(authorId).trim().toLowerCase() === String(currentUserId).trim().toLowerCase();
  const isNameMatched = item.author?.name && currentUser?.name && item.author.name.trim().toLowerCase() === currentUser.name.trim().toLowerCase();
  const isOwnAsset = isIdMatched || isNameMatched;
  const isAssetLocked = item.isPremiumOnly && currentUser?.role !== "admin" && !currentUser?.isPremium && !isOwnAsset;

  return (
    <div className="group relative bg-gradient-to-b from-zinc-900 to-zinc-950 text-white rounded-3xl border border-amber-500/30 p-5 shadow-lg shadow-amber-900/20 hover:shadow-amber-900/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl" />

      <div>
        <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden mb-4 relative">
          <Link href={`/artwork/${item._id}`} className="block w-full h-full">
            <Image
              src={getCloudinaryOptimizedUrl(item.featuredImage) || "https://placehold.co/600x400"}
              alt={item.title || "Premium Asset"}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </Link>
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
            <Crown size={11} /> PRO
          </span>
          {isAssetLocked && (
            <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-[2px] flex items-center justify-center">
              <div className="bg-zinc-900/80 p-3 rounded-full">
                <Lock size={20} className="text-amber-400" />
              </div>
            </div>
          )}
        </div>

        <Link href={`/artwork/${item._id}`}>
          <h3 className="text-lg font-black line-clamp-1 group-hover:text-amber-300 transition-colors">{item.title}</h3>
        </Link>
        <p className="text-zinc-400 text-xs mt-1 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-black text-amber-400">${item.price !== undefined ? item.price : "15.00"}</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-400">
            <Star size={12} className="fill-amber-400 text-amber-400" /> Premium
          </span>
        </div>
      </div>

      <button
        onClick={() => onResourceAccess && onResourceAccess(item)}
        disabled={actionLoadingId === item._id}
        className={`mt-5 w-full flex items-center justify-center gap-2 text-xs font-black px-4 py-3 rounded-2xl transition-all ${
          isAssetLocked ? "bg-amber-500 hover:bg-amber-400 text-zinc-950" : "bg-white/10 hover:bg-white/20 border border-white/20 text-white"
        } ${actionLoadingId === item._id ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {actionLoadingId === item._id ? "Verifying..." : isAssetLocked ? "Unlock Resource 🔒" : <>Access Resource <ExternalLink size={12} /></>}
      </button>
    </div>
  );
}
