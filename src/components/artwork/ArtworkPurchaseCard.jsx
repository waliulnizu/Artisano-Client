import React from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Crown, Loader2, Lock, ShieldCheck, ShoppingCart, Users } from "lucide-react";

export default function ArtworkPurchaseCard({
  artwork,
  buyLoading,
  isAuthor,
  handleBuyArtwork,
  currentUser,
  hasPurchased,
  totalPurchasedArtworks = 0,
  quotaLimit = 3,
  quotaUnlimited = false,
  quotaResetAt = null,
  tierLabel = "Starter Spark",
}) {
  const isFree = artwork.price === 0 || artwork.isFree;
  const isSoldOut = artwork.status === "sold" && !hasPurchased;
  const collectorCount = artwork.collectorCount || 0;
  const quotaReached = !hasPurchased && !quotaUnlimited && totalPurchasedArtworks >= quotaLimit;
  const slotsLeft = Math.max(quotaLimit - totalPurchasedArtworks, 0);

  // "Slots refresh on November 1" — the quota is a monthly window, never a life ban.
  const resetsOn = quotaResetAt
    ? new Date(quotaResetAt).toLocaleDateString("en-US", { month: "long", day: "numeric" })
    : null;

  const statusPill = hasPurchased
    ? { label: "In Your Collection", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900" }
    : isSoldOut
      ? { label: "Sold Out", className: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900" }
      : { label: "Available to Acquire", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900" };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
            Acquisition Value
          </p>
          <p className="text-4xl font-black tracking-tight mt-1">
            ${artwork.price || 0} <span className="text-xs font-bold text-slate-400">USD</span>
          </p>
        </div>
        <span
          className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border
                      flex items-center gap-1.5 flex-shrink-0 ${statusPill.className}`}
        >
          <ShieldCheck size={12} /> {statusPill.label}
        </span>
      </div>

      {/* ── Owned by this collector → straight into the private vault ── */}
      {hasPurchased ? (
        <Link
          href="/dashboard/acquired"
          className="mt-6 w-full bg-[#5a6b48] hover:bg-[#4c5b3d] text-white font-black py-4 rounded-2xl
                     flex items-center justify-center gap-2 text-sm shadow-md shadow-[#5a6b48]/25 transition-all"
        >
          <BadgeCheck size={16} /> View in Your Collection <ArrowRight size={15} />
        </Link>
      ) : isFree ? (
        /* ── Free resource ── */
        <a
          href={artwork.resourceLink || "#"}
          target="_blank"
          rel="noreferrer"
          className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl
                     flex items-center justify-center gap-2 text-sm transition-all"
        >
          Download Free Resource
        </a>
      ) : quotaReached ? (
        /* ── Monthly acquisition quota exhausted ── */
        <div className="mt-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl p-4 text-center">
          <p className="text-xs font-black text-amber-700 dark:text-amber-300 flex items-center justify-center gap-1.5">
            <Crown size={13} /> Monthly acquisition quota reached ({totalPurchasedArtworks}/{quotaLimit})
          </p>
          <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-1.5 leading-relaxed">
            You are on <span className="font-black">{tierLabel}</span>.
            {resetsOn ? ` Your ${quotaLimit} slots refresh on ${resetsOn}` : " Upgrade your node for more slots"} — or
            upgrade now to keep collecting.
          </p>
          <Link
            href="/premium"
            className="mt-3 inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white
                       font-black text-xs px-4 py-2.5 rounded-full transition-all"
          >
            <Crown size={13} /> Upgrade Membership
          </Link>
        </div>
      ) : (
        /* ── Ready to acquire ── */
        <button
          onClick={handleBuyArtwork}
          disabled={buyLoading || isSoldOut || isAuthor}
          className={`mt-6 w-full font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all
            ${isSoldOut || isAuthor
              ? "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-500"
              : "bg-[#5a6b48] hover:bg-[#4c5b3d] text-white shadow-md shadow-[#5a6b48]/25 hover:scale-[1.01] active:scale-[0.99]"}`}
        >
          {buyLoading ? (
            <><Loader2 size={16} className="animate-spin" /> Connecting Secure Checkout…</>
          ) : isSoldOut ? (
            <><Lock size={15} /> Already Sold</>
          ) : isAuthor ? (
            "Your Own Artwork"
          ) : (
            <><ShoppingCart size={16} /> Purchase Artworks</>
          )}
        </button>
      )}

      {/* ── Reassurance line + edition / quota meta ── */}
      <p className="text-[11px] text-center text-slate-400 dark:text-zinc-500 mt-3.5 flex items-center justify-center gap-1.5 flex-wrap">
        <Lock size={11} /> Secure checkout via Stripe · Authenticity Guarantee · Fully Insured
      </p>

      {!isFree && !hasPurchased && (
        <div className="mt-4 pt-4 border-t border-slate-50 dark:border-zinc-800 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Users size={12} className="text-[#5a6b48]" />
            {collectorCount === 0 ? "No collector owns this edition yet" : `Owned by ${collectorCount} collector${collectorCount === 1 ? "" : "s"}`}
          </span>
          {currentUser && (
            <span className="flex items-center gap-1">
              {quotaUnlimited ? (
                <>
                  <Crown size={12} className="text-amber-500" />
                  <span className="font-black text-slate-700 dark:text-zinc-200">Unlimited slots</span>
                </>
              ) : (
                <>
                  Slots left: <span className="font-black text-slate-800 dark:text-zinc-100">{slotsLeft}</span>
                  {resetsOn && <span className="text-slate-400 dark:text-zinc-500">· resets {resetsOn}</span>}
                </>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
