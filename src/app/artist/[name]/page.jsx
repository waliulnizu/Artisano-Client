"use client";

import { useState, useEffect, use } from "react";
import axios from "axios";
import Link from "next/link";
import { API_URL } from "@/lib/constants";
import { Crown, Lock, ExternalLink, ArrowLeft } from "lucide-react";

export default function ArtistProfilePage({ params }) {
  const { name } = use(params);
  const decodedName = decodeURIComponent(name);

  const [assets, setAssets] = useState([]);
  const [artistImage, setArtistImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_URL}/content/public-data`);
        if (res.data.success) {
          const all = res.data.data || [];
          const mine = all.filter(
            (a) => (a.author?.name || "Admin").trim().toLowerCase() === decodedName.trim().toLowerCase()
          );
          setAssets(mine);
          const withImage = mine.find((a) => a.author?.profileImage);
          if (withImage) setArtistImage(withImage.author.profileImage);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [decodedName]);

  const free = assets.filter((a) => !a.isPremiumOnly);
  const pro = assets.filter((a) => a.isPremiumOnly);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 transition-colors">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition mb-6">
          <ArrowLeft size={14} /> Back to Home
        </Link>

        {/* Profile header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12">
          <img
            src={artistImage || "https://i.ibb.co/4pDNDk1/avatar.png"}
            alt={decodedName}
            className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-lg"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white capitalize">{decodedName}</h1>
            <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">
              {free.length} free · {pro.length} premium assets
            </p>
            <div className="flex gap-2 mt-4 justify-center sm:justify-start">
              <span className="text-[11px] font-black bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-3 py-1 rounded-full text-slate-600 dark:text-zinc-300">
                {assets.length} total
              </span>
              {pro.length > 0 && (
                <span className="text-[11px] font-black bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                  <Crown size={11} /> VIP content
                </span>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-slate-400 dark:text-zinc-500 py-20">Loading artist portfolio...</p>
        ) : assets.length === 0 ? (
          <p className="text-center text-slate-400 dark:text-zinc-500 py-20 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
            No assets published by this artist yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {assets.map((art) => (
              <div key={art._id} className="group bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-500/40 transition-all duration-300">
                <div className="relative aspect-square bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                  <img src={art.featuredImage} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {art.isPremiumOnly && (
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center text-white">
                      <div className="bg-slate-900/80 p-2.5 rounded-full">
                        <Lock size={20} className="text-amber-400" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{art.category}</span>
                    {art.isPremiumOnly ? (
                      <span className="text-[10px] font-black bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 px-2 py-0.5 rounded flex items-center gap-1"><Crown size={10} /> PRO</span>
                    ) : (
                      <span className="text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded">FREE</span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{art.title}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-black text-slate-900 dark:text-white">${Number(art.price || 0).toFixed(2)}</span>
                    <Link href={`/artwork/${art._id}`} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                      Open <ExternalLink size={11} />
                    </Link>
                  </div>
                  {art.isPremiumOnly && (
                    <Link href="/premium" className="mt-3 block text-center text-[11px] font-black bg-amber-500 hover:bg-amber-600 text-slate-950 py-2 rounded-xl transition">
                      Unlock with Premium 👑
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
