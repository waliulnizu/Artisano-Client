"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ArrowRight, Layers, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";

import { API_URL } from "@/lib/constants";

export default function AcquiredArtworksPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // 🔁 Reconcile a receipt that could not be verified earlier (e.g. the collector
        //    was signed out when Stripe bounced them back). The endpoint is idempotent,
        //    so a sealed purchase simply no-ops here.
        const pending = window.localStorage.getItem("artisano:pendingReceipt");
        if (pending) {
          try {
            await axios.post(
              `${API_URL}/stripe/verify-single-purchase`,
              { sessionId: pending },
              { withCredentials: true }
            );
            window.localStorage.removeItem("artisano:pendingReceipt");
            toast.success("Pending acquisition sealed into your vault ✨");
          } catch (pendingError) {
            // Still not verifiable — keep it parked for the next visit.
            if (pendingError.response?.status !== 401) console.error("Receipt reconciliation failed:", pendingError);
          }
        }

        const [acquiredRes, meRes] = await Promise.all([
          axios.get(`${API_URL}/transactions/acquired`, { withCredentials: true }),
          axios.get(`${API_URL}/auth/me`, { withCredentials: true }),
        ]);
        if (!alive) return;
        if (acquiredRes.data.success) setItems(acquiredRes.data.data);
        if (meRes.data.success) setViewer(meRes.data.user);
      } catch (error) {
        console.error("Acquired artworks load failed:", error);
        toast.error("Failed to load your private collection.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#5a6b48] dark:text-emerald-400" size={32} />
        <p className="text-xs font-bold text-slate-400">Unlocking your private vault…</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-800 dark:text-zinc-100">
      {/* Page header */}
      <div>
        <span className="inline-flex items-center gap-1.5 bg-[#e9f0dc] dark:bg-emerald-950/50 text-[#4a5a3e] dark:text-emerald-300
                         text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
          <Sparkles size={11} /> Private Collection
        </span>
        <h1 className="font-display text-3xl sm:text-4xl tracking-tight mt-2">Acquired Masterpieces</h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
          Your permanent exhibition archive. Every masterpiece includes lifetime provenance certificates.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-700 p-14 text-center shadow-sm">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#e9f0dc] dark:bg-emerald-950/40 text-[#5a6b48] dark:text-emerald-300 mb-4">
            <Layers size={24} />
          </span>
          <p className="font-black text-sm">Your vault is still empty</p>
          <p className="text-slate-400 dark:text-zinc-500 text-xs mt-1.5 max-w-sm mx-auto leading-relaxed">
            Acquire your first masterpiece and its provenance certificate will be preserved here forever.
          </p>

          {/* Make account mix-ups obvious: this vault only lists purchases made by THIS account. */}
          {viewer?.email && (
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-4 mx-auto max-w-sm leading-relaxed">
              You are signed in as <span className="font-black text-slate-600 dark:text-zinc-300">{viewer.email}</span>.
              <br />
              Acquired artworks are tied to the exact account used at checkout — if you purchased with a different
              email or Google account, sign in with that account to see its collection.
            </p>
          )}
          <Link
            href="/browse"
            className="inline-flex items-center gap-1.5 mt-6 text-xs font-black bg-[#5a6b48] hover:bg-[#4c5b3d] text-white
                       px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#5a6b48]/25 active:scale-95"
          >
            Browse the Gallery <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map(({ artwork: art, acquiredValue, currency, acquiredAt }) => (
            <div
              key={art._id}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[28px] overflow-hidden shadow-sm
                         hover:shadow-md hover:border-[#5a6b48]/30 transition-all flex flex-col"
            >
              <div className="relative h-56 bg-slate-50 dark:bg-zinc-800">
                <img src={art.featuredImage} alt={art.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm text-emerald-700 dark:text-emerald-300
                                 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck size={12} /> Certified Provenance
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-display text-xl text-[#5a6b48] dark:text-emerald-300 capitalize">{art.title}</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">By {art.author?.name || "Artisan"}</p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 dark:border-zinc-800 text-sm">
                  <span className="text-slate-400 dark:text-zinc-500 font-bold">Acquired Value</span>
                  <span className="font-black">${acquiredValue} {currency}</span>
                </div>

                {acquiredAt && (
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-2">
                    Acquired on {new Date(acquiredAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                )}

                <Link
                  href={`/artwork/${art._id}`}
                  className="mt-4 w-full bg-slate-50 dark:bg-zinc-800 hover:bg-[#e9f0dc] dark:hover:bg-emerald-950/40
                             border border-slate-100 dark:border-zinc-700 hover:border-[#5a6b48]/40
                             font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  Details <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
