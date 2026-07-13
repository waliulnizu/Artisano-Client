"use client";

import { ExternalLink, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // 🚀 [PERF]: Lazy loading + WebP auto-convert

// =========================================================================
// 🚀 [PERFORMANCE]: Cloudinary URL → Optimized WebP URL Transformer
// Raw URL-এ /upload/ এর পরে transformation parameter inject করে
// আগে: full 3MB image → এখন: ~80KB WebP (Cloudinary server-এই resize করে)
// =========================================================================
const getCloudinaryOptimizedUrl = (url, width = 600, height = 350) => {
  if (!url || !url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},h_${height},c_fill/`);
};

export default function ArtCard({ item, currentUser, actionLoadingId, onResourceAccess }) {
  
  // 🛡️ ১. ডিফেন্সিভ গার্ড
  if (!item) return null;

  // 👑 ২. আইডি এক্সট্র্যাক্ট করার পাইপライン
  const authorId = item.author && typeof item.author === 'object' 
    ? (item.author._id || item.author.id) 
    : item.author;

  const currentUserId = currentUser ? (currentUser._id || currentUser.id) : null;

  // ক) আইডি ভিত্তিক তুলনা লজিক
  const isIdMatched = authorId && currentUserId && 
    (String(authorId).trim().toLowerCase() === String(currentUserId).trim().toLowerCase());

  // খ) নামের ব্যাকআপ তুলনা লজিক (আইডি টাইপ মিসম্যাচ থাকলেও এটি ওনারশিপ লক ভাঙবে)
  const isNameMatched = item.author?.name && currentUser?.name && 
    (item.author.name.trim().toLowerCase() === currentUser.name.trim().toLowerCase());

  // গ) চূড়ান্ত ওনারশিপ ডিসিশন
  const isOwnAsset = isIdMatched || isNameMatched;

  // ঘ) লকিং কন্ডিশন (ইউজার নিজে মেকার হলে, অ্যাডমিন হলে বা প্রিমিয়াম মেম্বার হলে লক হবে না)
  const isAssetLocked = item.isPremiumOnly && currentUser?.role !== "admin" && !currentUser?.isPremium && !isOwnAsset;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative">
      <div>
        {/* 🖼️ থাম্বনেইল ইমেজ সেকশন (আপডেট ১: এখানে লিংক র‍্যাপ করা হয়েছে) */}
        <div className="w-full h-44 rounded-xl overflow-hidden mb-4 bg-slate-100 relative">
          <Link href={`/artwork/${item._id}`} className="cursor-pointer group block w-full h-full">
            {/* 🚀 [PERF CHANGE]: <img> → <Image> | 3MB → ~80KB | lazy loading built-in */}
            <Image
              src={getCloudinaryOptimizedUrl(item.featuredImage) || "https://placehold.co/600x400"}
              alt={item.title || "Artisano Asset"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              className="object-cover group-hover:scale-105 transition-all duration-300"
              loading="lazy"
            />
          </Link>
          
          {/* ইমেজ লক লেয়ার */}
          {isAssetLocked && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center text-white pointer-events-none">
              {/* 🧠 Note: pointer-events-none দেওয়া হয়েছে যেন লকের ওপর ক্লিক করলেও ইমেজের লিংকে কাজ করে */}
              <div className="bg-slate-900/80 p-2.5 rounded-full shadow-lg">
                <Lock size={20} className="text-amber-400" />
              </div>
            </div>
          )}
        </div>

        {/* Category & Badge */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold uppercase text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            {item.category || "General"}
          </span>
          {item.isPremiumOnly ? (
            <span className="flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200 px-2 rounded-md">
              👑 PRO
            </span>
          ) : (
            <span className="text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 rounded-md">
              FREE
            </span>
          )}
        </div>

        {/* 📝 টাইটেল সেকশন (আপডেট ২: র-টেক্সট সরিয়ে লিংক দিয়ে সাজানো হয়েছে) */}
        <Link href={`/artwork/${item._id}`} className="block group">
          <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>
        </Link>
        <p className="text-slate-500 text-xs mb-2 line-clamp-2">{item.description}</p>
        <div className="mb-4">
          <span className="text-sm font-black text-slate-900">${item.price !== undefined ? item.price : "15.00"} <span className="text-[10px] text-slate-400 font-medium">USD</span></span>
        </div>
      </div>

      {/* Footer Component */}
      <div className="border-t border-slate-50 pt-3 flex justify-between items-center">
        <span className="text-[11px] font-medium text-slate-400">By {item.author?.name || "Admin"}</span>

        <button
          onClick={() => onResourceAccess && onResourceAccess(item)}
          disabled={actionLoadingId === item._id}
          className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${isAssetLocked
            ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
            : "bg-slate-900 hover:bg-slate-800 text-white"
            } ${actionLoadingId === item._id ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {actionLoadingId === item._id ? (
            "Verifying..."
          ) : isAssetLocked ? (
            <>Unlock Resource 🔒</>
          ) : (
            <>Access Resource <ExternalLink size={12} /></>
          )}
        </button>
      </div>
    </div>
  );
}