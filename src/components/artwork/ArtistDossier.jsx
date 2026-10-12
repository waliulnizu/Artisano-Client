"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ArrowRight, Award, Calendar, Loader2, Mail, Palette, X } from "lucide-react";

import { API_URL } from "@/lib/constants";

const FALLBACK_AVATAR = "https://i.ibb.co/4pDNDk1/avatar.png";

function formatDate(value) {
  if (!value) return "Not disclosed";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not disclosed";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/**
 * 🎩 Creator dossier — the "Dossier" popup on the artwork detail page.
 * Shows who curated the piece, when they joined, and how much of their
 * catalog collectors have already secured (counts only — never identities).
 */
export default function ArtistDossier({ authorId, authorName, onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!authorId) {
      setLoading(false);
      setFailed(true);
      return;
    }

    let alive = true;
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/content/artist-profile`, {
          params: { authorId },
          withCredentials: true
        });
        if (alive && res.data.success) setProfile(res.data.data);
      } catch (error) {
        console.error("Dossier load failed:", error);
        if (alive) setFailed(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [authorId]);

  // Close on Escape and stop the page behind from scrolling while it's open.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const name = profile?.name || authorName || "Verified Artisan";

  return (
    <div
      className="fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${name} dossier`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800
                      rounded-[32px] p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dossier"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-slate-100
                     dark:border-zinc-700 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-100
                     hover:border-[#5a6b48] flex items-center justify-center transition-all"
        >
          <X size={16} />
        </button>

        {loading ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-[#5a6b48]" size={30} />
            <p className="text-xs font-bold text-slate-400">Retrieving creator dossier…</p>
          </div>
        ) : failed || !profile ? (
          <div className="py-14 text-center">
            <p className="font-black text-sm">Dossier unavailable</p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              This creator&apos;s profile could not be loaded right now.
            </p>
          </div>
        ) : (
          <>
            {/* ── Identity ── */}
            <img
              src={profile.profileImage || FALLBACK_AVATAR}
              alt={name}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_AVATAR;
              }}
              className="w-24 h-24 rounded-3xl object-cover mx-auto border border-slate-100 dark:border-zinc-700 shadow-sm"
            />

            <h3 className="font-display text-3xl text-center mt-5 tracking-tight text-slate-900 dark:text-zinc-50">
              {name}
            </h3>

            <div className="flex justify-center mt-3">
              <span className="inline-flex items-center gap-1.5 bg-[#e9f0dc] dark:bg-emerald-950/50 border border-[#5a6b48]/20
                               text-[#4a5a3e] dark:text-emerald-300 text-[10px] font-black uppercase tracking-widest
                               px-3.5 py-1.5 rounded-full">
                Verified Artisano Creator
              </span>
            </div>

            {/* ── Studio facts ── */}
            <div className="bg-[#f7f9f1] dark:bg-zinc-800/60 border border-[#5a6b48]/10 dark:border-zinc-700
                            rounded-3xl p-5 mt-6 text-left space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={15} className="text-[#5a6b48] dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                    Studio Dispatch
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-zinc-200 truncate">
                    {profile.email || "Private"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar size={15} className="text-[#5a6b48] dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                    Active Since
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-zinc-200">{formatDate(profile.joinedAt)}</p>
                </div>
              </div>
            </div>

            {/* ── Catalog statistics ── */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-700 rounded-3xl p-5 text-center">
                <span className="w-9 h-9 rounded-full bg-[#e9f0dc] dark:bg-emerald-950/50 text-[#5a6b48]
                                 dark:text-emerald-300 mx-auto flex items-center justify-center">
                  <Palette size={16} />
                </span>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mt-3">
                  Total Artworks
                </p>
                <p className="font-display text-3xl mt-1 text-slate-900 dark:text-zinc-50">
                  {profile.totalArtworks}
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-700 rounded-3xl p-5 text-center">
                <span className="w-9 h-9 rounded-full bg-[#e9f0dc] dark:bg-emerald-950/50 text-[#5a6b48]
                                 dark:text-emerald-300 mx-auto flex items-center justify-center">
                  <Award size={16} />
                </span>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mt-3">
                  Acquired Works
                </p>
                <p className="font-display text-3xl mt-1 text-slate-900 dark:text-zinc-50">
                  {profile.acquiredWorks}
                </p>
              </div>
            </div>

            {profile.collectors > 0 && (
              <p className="text-[11px] text-center text-slate-400 dark:text-zinc-500 mt-3 leading-relaxed">
                Secured by {profile.collectors} collector{profile.collectors === 1 ? "" : "s"} across the gallery.
              </p>
            )}

            {/* ── Call to action ── */}
            <Link
              href={`/artist/${encodeURIComponent(name)}`}
              className="mt-6 w-full bg-[#5a6b48] hover:bg-[#4c5b3d] text-white font-black text-sm py-4 rounded-full
                         flex items-center justify-center gap-2 shadow-md shadow-[#5a6b48]/25 transition-all"
            >
              Explore Artist&apos;s Catalog <ArrowRight size={15} />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
