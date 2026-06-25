"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { ShoppingCart, Calendar, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

// 🚀 ইম্পোর্ট মডিউল সমূহ
import CommentSection from "@/components/comment/CommentSection";
import WishlistButton from "@/components/wishlist/WishlistButton";
import ReviewSection from "@/components/review/ReviewSection";

export default function ArtworkDetailsPage() {
  const { id } = useParams(); // URL থেকে ডাইনামিক [id] ক্যাচ করা
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyLoading, setBuyLoading] = useState(false);

  // ==========================================
  // 📥 স্টেপ ১: ব্যাকএন্ড থেকে সিঙ্গেল আর্ট ডাটা লোড করা
  // ==========================================
  useEffect(() => {
    const fetchArtworkDetails = async () => {
      try {
        const res = await axios.get(`${API_URL}/content/${id}`, { withCredentials: true });
        if (res.data.success) {
          setArtwork(res.data.data);
        }
      } catch (error) {
        console.error("Fetch Artwork Details Error:", error);
        toast.error("Failed to load artwork specifications.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArtworkDetails();
  }, [id]);

  // ==========================================
  // 💳 স্টেপ ২: লাইভ ডাইনামিক মক রাউট পেমেন্ট হ্যান্ডলার 
  // ==========================================
  const handleBuyArtwork = async () => {
    setBuyLoading(true);
    toast.loading("Connecting secure checkout pipeline... 💳", { id: "buy-art" });
    
    try {
      const res = await axios.post(
        `${API_URL}/payment/buy-artwork/${id}`, 
        {}, 
        { withCredentials: true }
      );

      if (res.data && res.data.success) {
        toast.success(`Stripe Gateway Connected! Target ID: ${res.data.id} ✨`, { id: "buy-art" });
      }
    } catch (error) {
      console.error("Purchase Error:", error);
      const errMsg = error.response?.data?.message || "Payment gateway communication route not found.";
      toast.error(errMsg, { id: "buy-art" });
    } finally {
      setBuyLoading(false);
    }
  };

  // ==========================================
  // 🛡️ স্টেপ ৩: কন্ডিশনাল রেন্ডারিং (Defensive Loading Guards)
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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

  // ==========================================
  // 🖼️ স্টেপ ৪: ফাইনাল ভিজ্যুয়াল রিপ্রেজেন্টেশন (JSX View)
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 text-slate-800">
      {/* 🏢 মেইন ২-কলাম ডিটেইলস গ্রিডカード */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
        
        {/* 🖼️ বাম পাশ: হাই-রেজুলেশন ইমেজ গ্যালারি */}
        <div className="w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden bg-slate-50 border relative">
          <img src={artwork.featuredImage} alt={artwork.title} className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300" />
          
          {/* 📌 কন্ডিশনাল ব্যাজ */}
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

        {/* 📝 ডান পাশ: কন্টেন্ট স্পেসিফিকেশন ও বাই বাটন */}
        <div className="flex flex-col justify-between py-2">
          <div>
            
            {/* 👑 📌 ফিক্সড লেআউট: ক্যাটাগরি এবং উইশলিস্ট বাটন */}
            <div className="flex items-center justify-between w-full">
              <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                {artwork.category}
              </span>
              
              {/* ❤️ লাইভ উইশলিস্ট বাটন রেন্ডার */}
              <WishlistButton artworkId={id} />
            </div>

            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3 capitalize">{artwork.title}</h1>
            
            {/* 🤝 অথর কালেকশন */}
            <div className="flex items-center gap-2.5 mt-4 pb-4 border-b border-slate-100">
              <img src={artwork.author?.profileImage || "https://i.ibb.co/4pDNDk1/avatar.png"} alt={artwork.author?.name} className="w-8 h-8 rounded-full object-cover border" />
              <p className="text-xs font-bold text-slate-500">Created by <span className="text-slate-800 font-extrabold capitalize">{artwork.author?.name || "Artisan"}</span></p>
            </div>

            <p className="text-slate-600 text-sm mt-6 leading-relaxed whitespace-pre-line">{artwork.description}</p>
          </div>

          {/* 💳 পেমেন্ট গেটওয়ে কন্ট্রোল কার্ড */}
          <div className="mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asset Commercial Value</p>
<p className="text-3xl font-black text-slate-900 mt-0.5">${artwork.price || "15.00"} <span className="text-xs text-slate-400 font-medium">USD</span></p>              </div>
              <div className="text-right text-xs font-bold text-slate-400 space-y-0.5">
                <p className="flex items-center gap-1 justify-end text-emerald-600"><ShieldCheck size={14} /> Verified Original</p>
                <p className="flex items-center gap-1 justify-end"><Calendar size={14} /> Published 2026</p>
              </div>
            </div>

            {/* 🛒 কন্ডিশনাল বাই বাটন */}
            <button
              onClick={handleBuyArtwork}
              disabled={buyLoading || artwork.isSold}
              className={`w-full font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm ${
                artwork.isSold 
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                  : "bg-slate-900 hover:bg-slate-800 text-white hover:scale-[1.01] active:scale-[0.99]"
              }`}
            >
              {buyLoading ? (
                <><Loader2 size={16} className="animate-spin text-amber-400" /> Connecting Stripe Gate...</>
              ) : artwork.isSold ? (
                "Artwork Unavailable (Sold)"
              ) : (
                <><ShoppingCart size={16} /> Instant Secure Purchase</>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-3">Payments encrypted securely. 100% Artist Proceeds Royalty Protected.</p>
          </div>
        </div> {/* 👈 ডান পাশের প্রধান flex-col ক্লোজিং ডিভ */}
      </div> {/* 👈 মেইন ২-কলাম গ্রিডের ক্লোজিং ডিভ */}

      {/* 💬 🚀 মডুলার লাইভ কমেন্ট সিস্টেম */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 space-y-10">
        <ReviewSection artworkId={id} />
        <CommentSection artworkId={id} />
      </div>

    </div>
  );
}