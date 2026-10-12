"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Share2, Link2, Loader2, ShieldAlert, Sparkles, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";

import { useArtworkDetails } from "@/hooks/useArtworkDetails";

import ArtworkGallery from "@/components/artwork/ArtworkGallery";
import ArtworkMetadata from "@/components/artwork/ArtworkMetadata";
import ArtworkPurchaseCard from "@/components/artwork/ArtworkPurchaseCard";
import TrustStrip from "@/components/artwork/TrustStrip";
import RelatedMasterpieces from "@/components/artwork/RelatedMasterpieces";
import ArtworkLockGuard from "@/components/artwork/ArtworkLockGuard";

import CommentSection from "@/components/comment/CommentSection";
import ReviewSection from "@/components/review/ReviewSection";

export default function ArtworkDetailsPage() {
  const { id } = useParams();

  const {
    artwork,
    loading,
    buyLoading,
    isAuthor,
    canComment,
    handleBuyArtwork,
    currentUser,
    hasPurchased,
    totalPurchasedArtworks,
    quotaLimit,
    quotaUnlimited,
    quotaResetAt,
    tierLabel,
  } = useArtworkDetails(id);

  const [shareLoading, setShareLoading] = useState(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    setShareLoading(true);
    try {
      if (navigator.share) {
        await navigator.share({ title: artwork?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Gallery link copied to clipboard 🔗");
      }
    } catch {
      /* user dismissed the native share sheet */
    } finally {
      setShareLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#5a6b48] dark:text-emerald-400" size={40} />
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-center px-4">
        <ShieldAlert size={38} className="text-rose-500" />
        <p className="font-black text-slate-700 dark:text-zinc-200">Artwork not found or has been archived.</p>
        <Link href="/browse" className="text-xs font-black text-[#5a6b48] hover:underline">
          Back to the gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-16 text-slate-800 dark:text-zinc-100">

      {/* ── Top bar: back · share · breadcrumb ───────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700
                     hover:border-[#5a6b48] dark:hover:border-emerald-500 text-slate-700 dark:text-zinc-200
                     text-xs font-black px-4 py-2.5 rounded-full shadow-sm transition-all"
        >
          <ArrowLeft size={14} /> Back to Collection
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={handleShare}
            disabled={shareLoading}
            className="inline-flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700
                       hover:border-[#5a6b48] text-slate-600 dark:text-zinc-300 text-xs font-black px-3.5 py-2
                       rounded-full shadow-sm transition-all disabled:opacity-60"
          >
            {shareLoading ? <Loader2 size={13} className="animate-spin" /> : <Link2 size={13} />} Share
          </button>

          <nav className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-zinc-500">
            <Link href="/" className="hover:text-[#5a6b48] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/browse" className="hover:text-[#5a6b48] transition-colors">Artworks</Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-zinc-100 font-black capitalize">{artwork.title}</span>
          </nav>
        </div>
      </div>

      {/* ── Main two-column block ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ArtworkGallery artwork={artwork} acquired={hasPurchased} />

        <div className="flex flex-col gap-6">
          <ArtworkMetadata artwork={artwork} />
          <ArtworkPurchaseCard
            artwork={artwork}
            buyLoading={buyLoading}
            isAuthor={isAuthor}
            handleBuyArtwork={handleBuyArtwork}
            currentUser={currentUser}
            hasPurchased={hasPurchased}
            totalPurchasedArtworks={totalPurchasedArtworks}
            quotaLimit={quotaLimit}
            quotaUnlimited={quotaUnlimited}
            quotaResetAt={quotaResetAt}
            tierLabel={tierLabel}
          />
        </div>
      </div>

      {/* ── Trust strip ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <TrustStrip />
      </div>

      {/* ── Related masterpieces ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <RelatedMasterpieces
          currentId={id}
          category={artwork.category}
          authorId={artwork.author?._id}
          excludeSoldOut={false}
        />
      </div>

      {/* ── Provenance & dialog: reviews + collector guestbook ───────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-14 space-y-10">
        <section>
          <p className="text-[11px] font-black uppercase tracking-widest text-[#5a6b48] dark:text-emerald-400">
            Curator Reviews
          </p>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight mt-1 mb-5 flex items-center gap-2">
            <Sparkles size={22} className="text-[#5a6b48]" /> Critical Reception
          </h2>
          <ReviewSection artworkId={id} />
        </section>

        <section>
          <p className="text-[11px] font-black uppercase tracking-widest text-[#5a6b48] dark:text-emerald-400">
            Provenance &amp; Dialog
          </p>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight mt-1 mb-2 flex items-center gap-2">
            <MessageSquare size={22} className="text-[#5a6b48]" /> Collector Guestbook
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mb-5">
            Leave your appreciation, provenance queries, or critical impressions.
          </p>

          {canComment ? (
            <CommentSection artworkId={id} />
          ) : (
            <ArtworkLockGuard />
          )}
        </section>
      </div>

    </div>
  );
}
