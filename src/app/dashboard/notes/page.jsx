"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ArrowRight, Loader2, MessageSquare, Star, StickyNote } from "lucide-react";
import { toast } from "react-hot-toast";

import { API_URL } from "@/lib/constants";

const TABS = [
  { key: "reviews", label: "Curator Reviews", icon: Star },
  { key: "comments", label: "Guestbook Notes", icon: MessageSquare },
];

export default function CuratorialNotesPage() {
  const [tab, setTab] = useState("reviews");
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [revRes, comRes] = await Promise.all([
          axios.get(`${API_URL}/review/my`, { withCredentials: true }),
          axios.get(`${API_URL}/comment/my`, { withCredentials: true }),
        ]);
        if (!alive) return;
        if (revRes.data.success) setReviews(revRes.data.data);
        if (comRes.data.success) setComments(comRes.data.data);
      } catch (error) {
        console.error("Curatorial notes load failed:", error);
        toast.error("Failed to load your curatorial notes.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const rows =
    tab === "reviews"
      ? reviews.map((r) => ({ id: r._id, art: r.artworkId, body: r.comment, at: r.createdAt, rating: r.rating }))
      : comments.map((c) => ({ id: c._id, art: c.artworkId, body: c.text, at: c.createdAt, rating: null }));

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#5a6b48] dark:text-emerald-400" size={32} />
        <p className="text-xs font-bold text-slate-400">Gathering your notes…</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-slate-800 dark:text-zinc-100">
      {/* Header */}
      <div>
        <span className="inline-flex items-center gap-1.5 bg-[#e9f0dc] dark:bg-emerald-950/50 text-[#4a5a3e] dark:text-emerald-300
                         text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
          <StickyNote size={11} /> Provenance &amp; Dialog
        </span>
        <h1 className="font-display text-3xl sm:text-4xl tracking-tight mt-2">My Curatorial Notes</h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
          Every review and guestbook impression you have left across the gallery, gathered in one archive.
        </p>
      </div>

      {/* Tabs */}
      <div className="inline-flex bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full p-1.5 shadow-sm">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-2 text-xs font-black px-4 py-2.5 rounded-full transition-all ${
              tab === key
                ? "bg-[#5a6b48] text-white shadow-md shadow-[#5a6b48]/25"
                : "text-slate-500 dark:text-zinc-400 hover:text-[#5a6b48]"
            }`}
          >
            <Icon size={13} /> {label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === key ? "bg-white/20" : "bg-slate-100 dark:bg-zinc-800"}`}>
              {key === "reviews" ? reviews.length : comments.length}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {rows.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-700 p-14 text-center shadow-sm">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#e9f0dc] dark:bg-emerald-950/40 text-[#5a6b48] dark:text-emerald-300 mb-4">
            <StickyNote size={24} />
          </span>
          <p className="font-black text-sm">No notes recorded yet</p>
          <p className="text-slate-400 dark:text-zinc-500 text-xs mt-1.5 max-w-sm mx-auto leading-relaxed">
            Open any acquired masterpiece and leave a review or guestbook impression — it will be archived here.
          </p>
          <Link
            href="/dashboard/acquired"
            className="inline-flex items-center gap-1.5 mt-6 text-xs font-black bg-[#5a6b48] hover:bg-[#4c5b3d] text-white
                       px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#5a6b48]/25 active:scale-95"
          >
            Open your collection <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-4 shadow-sm
                         flex items-start gap-4 hover:border-[#5a6b48]/30 transition-all"
            >
              {row.art?.featuredImage ? (
                <img
                  src={row.art.featuredImage}
                  alt={row.art.title}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-100 dark:border-zinc-700 flex-shrink-0"
                />
              ) : (
                <span className="w-16 h-16 rounded-2xl bg-[#e9f0dc] dark:bg-emerald-950/40 text-[#5a6b48] dark:text-emerald-300
                                 flex items-center justify-center flex-shrink-0">
                  <StickyNote size={20} />
                </span>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={row.art?._id ? `/artwork/${row.art._id}` : "#"}
                    className="font-black text-sm hover:text-[#5a6b48] transition-colors capitalize truncate"
                  >
                    {row.art?.title || "Archived artwork"}
                  </Link>
                  {row.rating != null && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={11} fill={i < row.rating ? "currentColor" : "none"} strokeWidth={2} />
                      ))}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1.5 leading-relaxed">{row.body}</p>

                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-2">
                  {new Date(row.at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </p>
              </div>

              <Link
                href={row.art?._id ? `/artwork/${row.art._id}` : "/browse"}
                className="text-[11px] font-black text-[#5a6b48] inline-flex items-center gap-1 flex-shrink-0 hover:gap-1.5 transition-all"
              >
                View <ArrowRight size={12} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
