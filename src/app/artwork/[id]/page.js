"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

// 👑 কাস্টম লজিক এবং স্টেট ম্যানেজার হুক ইম্পোর্ট
import { useArtworkDetails } from "@/hooks/useArtworkDetails";

// 🧩 আমাদের তৈরি করা অণু-পরমাণু সাব-কম্পোনেন্টস সমূহ
import ArtworkGallery from "@/components/artwork/ArtworkGallery";
import ArtworkMetadata from "@/components/artwork/ArtworkMetadata";
import ArtworkPurchaseCard from "@/components/artwork/ArtworkPurchaseCard";
import ArtworkLockGuard from "@/components/artwork/ArtworkLockGuard";

// 🌍 গ্লোবাল মডিউলার প্লাগইনস
import CommentSection from "@/components/comment/CommentSection";
import ReviewSection from "@/components/review/ReviewSection";

export default function ArtworkDetailsPage() {
  const { id } = useParams();
  
  // ⚡ হুক থেকে এক লাইনে সমস্ত ডেটা এবং ফাংশন এক্সট্রাক্ট করা হলো
  const { artwork, loading, buyLoading, isAuthor, canComment, handleBuyArtwork } = useArtworkDetails(id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-bold">
        Artwork not found or has been archived.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 text-slate-800">
      
      {/* 🖼️ ১. আর্টওয়ার্ক মেইন শোকেস গ্রিড কার্ড */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
        
        {/* বাম কলাম: ইমেজ পার্ট */}
        <ArtworkGallery artwork={artwork} />

        {/* ডান কলাম: মেটাডাটা ও কমার্শিয়াল বাটন পার্ট */}
        <div className="flex flex-col justify-between py-2">
          <ArtworkMetadata artwork={artwork} />
          <ArtworkPurchaseCard 
            artwork={artwork}
            buyLoading={buyLoading}
            isAuthor={isAuthor}
            handleBuyArtwork={handleBuyArtwork}
          />
        </div>
      </div>

      {/* 💬 ২. সোশ্যাল রিভিউ এবং কন্ডিশনাল কমেন্ট বাউন্ডারি */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 space-y-10 mt-8">
        <ReviewSection artworkId={id} />
        {canComment ? <CommentSection artworkId={id} /> : <ArtworkLockGuard />}
      </div>

    </div>
  );
}