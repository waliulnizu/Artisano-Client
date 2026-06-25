"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/constants";
import Link from "next/link";
import { Heart, Loader2, ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SavedCollection() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👑 [NEW STATES]: ক্লায়েন্ট-সাইড ফিল্টারিং এবং সার্চ স্টেট
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // ==========================================
  // 📥 ১. Better-Auth সেশন সিঙ্ক করে উইশলিস্ট ডাটা লোড
  // ==========================================
  useEffect(() => {
    const fetchMyWishlist = async () => {
      try {
        const res = await fetch(`${API_URL}/wishlist`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
          }
        });

        if (res.ok) {
          const responseData = await res.json();
          if (responseData.success && responseData.data) {
            setWishlistItems(responseData.data);
          }
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

  // ==========================================
  // 💔 ২. ড্যাশবোর্ড থেকেই সরাসরি আইটেম আন-উইশ (Remove) করার হ্যান্ডলার
  // ==========================================
  const handleRemoveWish = async (e, artworkId) => {
    e.preventDefault(); 
    e.stopPropagation();

    try {
      const res = await fetch(`${API_URL}/wishlist/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ artworkId })
      });

      const responseData = await res.json();

      if (res.ok && responseData.success) {
        toast.success("Removed from your collection");
        setWishlistItems((prev) => prev.filter((item) => item._id !== artworkId));
      }
    } catch (error) {
      console.error("Remove Wishlist Dashboard Error:", error);
      toast.error("Could not update collection.");
    }
  };

  // ==========================================
  // 👑 🧠 ৩. রিয়েল-টাইম ক্লায়েন্ট ফিল্টার লজিক ইঞ্জিন
  // ==========================================
  // ডাটাবেসে বারবার হিট না করে জমানো কালেকশন থেকেই ইনস্ট্যান্ট ফিল্টার করবে
  const filteredItems = wishlistItems.filter((item) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

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
        <Link href="/browse" className="inline-flex items-center gap-1 mt-5 text-xs font-black bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all active:scale-95">
          Explore Artworks <ArrowUpRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* হেডার পার্ট */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Saved Masterpieces</h2>
          <p className="text-xs text-slate-400 mt-0.5">A curated catalog of your favorite commercial digital assets ({wishlistItems.length})</p>
        </div>

        {/* 👑 🛠️ [NEW UI]: ড্যাশবোর্ড কন্টেন্ট সার্চ ও ক্যাটাগরি ফিল্টার বার */}
        <div className="flex flex-wrap items-center gap-3">
          {/* সার্চ ইনপুট */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search saved arts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-all w-48"
            />
          </div>

          {/* ক্যাটাগরি ফিল্টার ড্রপডাউন */}
          <div className="flex items-center gap-1.5 bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-1.5">
            <SlidersHorizontal size={12} className="text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-600 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">All Saved</option>
              <option value="tutorial">Tutorial</option>
              <option value="tool">Tool / Asset</option>
              <option value="resource">Resource</option>
              <option value="article">Article</option>
              <option value="painting">Painting</option>
              <option value="digital">Digital Art</option>
              <option value="sculpture">Sculpture</option>
            </select>
          </div>
        </div>
      </div>

      {/* 📊 গ্যালারি গ্রিড লেআউট - ফিল্টার করা ডাটা রেন্ডার হবে */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-100 rounded-2xl">
          <p className="text-xs font-bold text-slate-400">No saved items match your filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const art = item;
            if (!art || !art._id) return null;

            return (
              <Link
                href={`/artwork/${art._id}`}
                key={art._id}
                className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* 🖼️া আর্ট ইমেজ সেকশন */}
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
      )}
    </div>
  );
}