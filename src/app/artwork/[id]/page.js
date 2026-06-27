"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { API_URL } from "@/lib/constants";
import { ShoppingCart, Calendar, ShieldCheck, Loader2, Download } from "lucide-react";
import { toast } from "react-hot-toast";

// 🚀 মডুলার সাব-কম্পোনেন্ট সমূহ
import CommentSection from "@/components/comment/CommentSection";
import WishlistButton from "@/components/wishlist/WishlistButton";
import ReviewSection from "@/components/review/ReviewSection";

export default function ArtworkDetailsPage() {
  const { id } = useParams(); 
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyLoading, setBuyLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const initPageData = async () => {
      try {
        const userRes = await fetch(`${API_URL}/auth/me`, { method: "GET", credentials: "include" });
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.success) setCurrentUser(userData.user);
        }

        const artRes = await fetch(`${API_URL}/content/${id}`, { method: "GET", credentials: "include" });
        if (artRes.ok) {
          const artData = await artRes.json();
          if (artData.success) {
            setArtwork(artData.data);
          }
        }
      } catch (error) {
        console.error("Initialization Error:", error);
        toast.error("Failed to load artwork specifications.");
      } finally {
        setLoading(false);
      }
    };

    if (id) initPageData();
  }, [id]);

  // ==========================================
  // 💳 ২. লাইভ স্ট্রাইক ওয়ান-টাইম পেমেন্ট ইঞ্জিন
  // ==========================================
  const handleBuyArtwork = async () => {
    if (currentUser && artwork && artwork.author?._id === currentUser._id) {
      toast.error("Security Block: You cannot purchase your own uploaded artwork!");
      return;
    }

    setBuyLoading(true);
    const stripeToast = toast.loading("Connecting secure checkout pipeline... 💳");
    
    try {
      // 🚀 আমাদের নতুন তৈরি করা এক্সপ্রেস এপিআই এন্ডপয়েন্টে হিট করা হচ্ছে
      const res = await fetch(`${API_URL}/stripe/create-single-purchase-session`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artworkId: artwork._id,
          price: artwork.price,
          title: artwork.title
        })
      });

      const responseData = await res.json();

      if (res.ok && responseData.success && responseData.url) {
        toast.success("Redirecting to Stripe security vault... ✨", { id: stripeToast });
        // 🌍 স্ট্রাইপ পেমেন্ট সিকিউর পেজে রিডাইরেক্ট
        window.location.href = responseData.url;
      } else {
        toast.error(responseData.message || "Checkout execution route failed.", { id: stripeToast });
      }
    } catch (error) {
      console.error("Purchase Error:", error);
      toast.error("Payment gateway communication failed.", { id: stripeToast });
    } finally {
      setBuyLoading(false);
    }
  };

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

  const isAuthor = currentUser && artwork.author?._id === currentUser._id;

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 text-slate-800">
      
      <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
        
        {/* 🖼️ বাম পাশ: ইমেজ গ্যালারি */}
        <div className="w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden bg-slate-50 border relative">
          <img src={artwork.featuredImage} alt={artwork.title} className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300" />
          
          {artwork.isSold ? (
            <span className="absolute top-4 left-4 bg-rose-600 text-white font-black text-xs px-4 py-1.5 rounded-xl shadow-md uppercase tracking-wider animate-pulse">
              🔴 SOLD OUT
            </span>
          ) : artwork.isPremiumOnly && (
            <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-black text-xs px-4 py-1.5 rounded-xl shadow-md uppercase tracking-wider">
              👑 PRO ACCESS
            </span>
          )}
        </div>

        {/* 📝 ডান পাশ: স্পেসিফিকেশন */}
        <div className="flex flex-col justify-between py-2">
          <div>
            <div className="flex items-center justify-between w-full">
              <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                {artwork.category}
              </span>
              <WishlistButton artworkId={id} />
            </div>

            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3 capitalize">{artwork.title}</h1>
            
            <div className="flex items-center gap-2.5 mt-4 pb-4 border-b border-slate-100">
              <img src={artwork.author?.profileImage || "https://i.ibb.co/4pDNDk1/avatar.png"} alt={artwork.author?.name} className="w-8 h-8 rounded-full object-cover border" />
              <p className="text-xs font-bold text-slate-500">Created by <span className="text-slate-800 font-extrabold capitalize">{artwork.author?.name || "Artisan"}</span></p>
            </div>

            <p className="text-slate-600 text-sm mt-6 leading-relaxed whitespace-pre-line">{artwork.description}</p>
          </div>

          <div className="mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asset Commercial Value</p>
                <p className="text-3xl font-black text-slate-900 mt-0.5">${artwork.price || "0"} <span className="text-xs text-slate-400 font-medium">USD</span></p>
              </div>
              <div className="text-right text-xs font-bold text-slate-400 space-y-0.5">
                <p className="flex items-center gap-1 justify-end text-emerald-600"><ShieldCheck size={14} /> Verified Original</p>
                <p className="flex items-center gap-1 justify-end"><Calendar size={14} /> Published 2026</p>
              </div>
            </div>

            {/* 👑 কন্ডিশনাল বাটন রেন্ডারিং মেকানিজম (ফিক্সড) */}
            {artwork.price === 0 || artwork.isFree ? (
              <a 
                href={artwork.downloadUrl || "#"} 
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Download size={16} /> Download Free Resource 📥
              </a>
            ) : (
              <button
                onClick={handleBuyArtwork}
                disabled={buyLoading || artwork.isSold || isAuthor}
                className={`w-full font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm ${
                  artwork.isSold || isAuthor
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                    : "bg-slate-900 hover:bg-slate-800 text-white hover:scale-[1.01] active:scale-[0.99]"
                }`}
              >
                {buyLoading ? (
                  <><Loader2 size={16} className="animate-spin text-amber-400" /> Connecting Stripe Gate...</>
                ) : artwork.isSold ? (
                  "Artwork Unavailable (Sold)"
                ) : isAuthor ? (
                  "Your Own Artwork"
                ) : (
                  <><ShoppingCart size={16} /> Instant Secure Purchase 🛒</>
                )}
              </button>
            )}

            <p className="text-[10px] text-center text-slate-400 mt-3">Payments encrypted securely. 100% Artist Proceeds Royalty Protected.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-2 sm:px-4 space-y-10">
        <ReviewSection artworkId={id} />
        <CommentSection artworkId={id} />
      </div>

    </div>
  );
}