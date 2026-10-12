"use client";

import React, { useState } from "react";
import { ArrowUpRight, Quote } from "lucide-react";
import WishlistButton from "@/components/wishlist/WishlistButton";
import ArtistDossier from "@/components/artwork/ArtistDossier";

const FALLBACK_AVATAR = "https://i.ibb.co/4pDNDk1/avatar.png";

export default function ArtworkMetadata({ artwork }) {
  const [dossierOpen, setDossierOpen] = useState(false);

  const formattedDate = artwork.createdAt
    ? new Date(artwork.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div className="space-y-5">
      {/* Category · date · wishlist */}
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#5a6b48] dark:text-emerald-400">
          <span aria-hidden>✦</span> {artwork.category}
          {formattedDate && (
            <span className="text-slate-400 dark:text-zinc-500 normal-case tracking-normal font-bold">
              · {formattedDate}
            </span>
          )}
        </span>
        <WishlistButton artworkId={artwork._id} />
      </div>

      {/* Title */}
      <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] tracking-tight capitalize break-words">
        {artwork.title}
      </h1>

      {/* Curated creator card */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-4 flex items-center gap-4 shadow-sm">
        <img
          src={artwork.author?.profileImage || artwork.author?.image || FALLBACK_AVATAR}
          alt={artwork.author?.name || "Creator"}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_AVATAR;
          }}
          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-zinc-700 flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
            Curated Creator
          </p>
          <p className="font-black text-lg truncate capitalize">{artwork.author?.name || "Artisan"}</p>
        </div>
        <button
          type="button"
          onClick={() => setDossierOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-black border border-slate-200 dark:border-zinc-700
                     px-3.5 py-2 rounded-full hover:border-[#5a6b48] hover:text-[#5a6b48] hover:bg-[#e9f0dc]/40
                     dark:hover:bg-emerald-950/40 transition-all flex-shrink-0"
        >
          Dossier <ArrowUpRight size={12} />
        </button>
      </div>

      {/* Curatorial statement */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm">
        <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#5a6b48] dark:text-emerald-400 mb-3">
          <Quote size={13} /> Curatorial Statement
        </p>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400 whitespace-pre-line">
          {artwork.description}
        </p>
      </div>

      {/* 🎩 Creator dossier popup */}
      {dossierOpen && (
        <ArtistDossier
          authorId={artwork.author?._id}
          authorName={artwork.author?.name}
          onClose={() => setDossierOpen(false)}
        />
      )}
    </div>
  );
}
