"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import Link from "next/link";
import { Heart, Loader2, ArrowUpRight } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SavedCollection() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📥 ব্যাকঅ্যান্ড থেকে লগইন থাকা ইউজারের উইশলিস্ট ডাটা নিয়ে আসা
  useEffect(() => {
    const fetchMyWishlist = async () => {
      try {
        const res = await axios.get(`${API_URL}/wishlist/my-list`, { withCredentials: true });
        if (res.data.success && res.data.data) {
          setWishlistItems(res.data.data);
        }
      } catch (error) {
        console.error("Fetch Wishlist Dashboard Error:", error);
        toast.error("Failed to sync your saved collection.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyWishlist();
  }, []);

  // 💔 ড্যাশবোর্ড থেকেই সরাসরি কোনো আইটেম আন-উইশ (Remove) করার হ্যান্ডলার
  const handleRemoveWish = async (e, artworkId) => {
    e.preventDefault(); 
    e.stopPropagation();

    try {
      const res = await axios.post(
        `${API_URL}/wishlist/toggle`,
        { artworkId },
        { withCredentials: true }
      );

      if (res.data.success && !res.data.isWished) {
        toast.success("Removed from your collection");
        
        // 🧠 🚀 UPDATE: নতুন ডাইরেক্ট আইডি স্ট্রাকচার অনুযায়ী অপ্টিমিস্টিক স্টেট ফিল্টার
        setWishlistItems((prev) => prev.filter((item) => item._id !== artworkId));
      }
    } catch (error) {
      console.error("Remove Wishlist Dashboard Error:", error);
      toast.error("Could not update collection.");
    }
  };

  // 🛡️ কন্ডিশনাল রেন্ডারিং: ডাটা লোড হওয়ার সময়ের ভিজ্যুয়াল
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 w-full text-slate-400">
        <Loader2 size={24} className="animate-spin text-slate-900 mb-2" />
        <p className="text-xs font-medium">Syncing your luxury vault...</p>
      </div>
    );
  }

  // 🛡️ কন্ডিশনাল রেন্ডারিং: উইশলিস্ট যদি একদম খালি থাকে
  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-8 max-w-md mx-auto mt-6">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Heart size={20} />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Your Wishlist Vault is Empty</h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Explore the ArtHub gallery and tap the heart icon on any masterpiece to save it here.
        </p>
        <Link href="/" className="inline-flex items-center gap-1 mt-5 text-xs font-black bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all active:scale-95">
          Explore Artworks <ArrowUpRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Saved Masterpieces</h2>
        <p className="text-xs text-slate-400 mt-0.5">A curated catalog of your favorite commercial digital assets ({wishlistItems.length})</p>
      </div>

      {/* 📊 গ্যালারি গ্রিড লেআউট */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => {
          // 🧠 🚀 UPDATE: item-ই এখন সরাসরি আর্টওয়ার্ক অবজেক্ট। ডাবল এক্সট্রাকশনের ঝামেলা নেই।
          const art = item;

          if (!art || !art._id) return null;

          return (
            <Link
              href={`/artwork/${art._id}`}
              key={art._id}
              className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* 🖼️ আর্ট ইমেজ সেকশন */}
              <div className="relative aspect-square w-full bg-slate-50 overflow-hidden border-b border-slate-50">
                <img
                  src={art.featuredImage}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />

                {/* ❤️ ইনস্ট্যান্ট রিমুভ বাটন */}
                <button
                  onClick={(e) => handleRemoveWish(e, art._id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-90"
                  title="Remove from wishlist"
                >
                  <Heart size={15} fill="currentColor" />
                </button>

                {/* 📌 কন্ডিশনাল স্ট্যাটাস ব্যাজ */}
                {art.isSold ? (
                  <span className="absolute bottom-3 left-3 bg-rose-600 text-white font-black text-[9px] px-2.5 py-1 rounded-lg tracking-wider uppercase">
                    Sold Out
                  </span>
                ) : art.isPremiumOnly && (
                  <span className="absolute bottom-3 left-3 bg-amber-500 text-slate-950 font-black text-[9px] px-2.5 py-1 rounded-lg tracking-wider uppercase">
                    Pro
                  </span>
                )}
              </div>

              {/* 📝 আর্ট ইনফো সেকশন */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase text-blue-600 tracking-wider bg-blue-50/60 px-2 py-0.5 rounded-md border border-blue-50">
                    {art.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 tracking-tight mt-2 line-clamp-1 capitalize">
                    {art.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                  <span className="text-xs font-medium text-slate-400">Value</span>
                  <span className="text-sm font-black text-slate-900">${art.price || "15.00"} <span className="text-[10px] text-slate-400 font-medium">USD</span></span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}