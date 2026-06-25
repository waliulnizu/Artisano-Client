"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function WishlistButton({ artworkId }) {
  const [isWished, setIsWished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // 📥 পেজ লোড হওয়ার সময় ইনিশিয়াল স্ট্যাটাস চেক করা
  useEffect(() => {
    const checkInitialWishStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/wishlist/my-list`, { withCredentials: true });
        if (res.data.success && res.data.data) {
          // 🧠 🚀 ফিক্সড লজিক: নতুন ডাটাবেস আর্কিটেকচার অনুযায়ী ম্যাচিং চেক
          const match = res.data.data.some(item => {
            const idToCompare = item.artworkId?._id || item._id;
            return idToCompare === artworkId;
          });
          setIsWished(match);
        }
      } catch (error) {
        console.error("Wishlist Status Check Error:", error);
      } finally {
        setChecking(false);
      }
    };

    if (artworkId) checkInitialWishStatus();
  }, [artworkId]);

  // ❤️ বাটন ক্লিক করলে টগল করার মূল ফাংশন
  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/wishlist/toggle`,
        { artworkId },
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsWished(res.data.isWished);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Wishlist Toggle Error:", error);
      const errMsg = error.response?.data?.message || "Please login to wishlist this item.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // ইনিশিয়াল চেকিং এর সময় বাটনটি ইন-অ্যাক্টিভ রাখা (Hydration Error এড়াতে)
  if (checking) {
    return (
      <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
        <Loader2 size={16} className="animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-3 rounded-full border transition-all flex items-center justify-center active:scale-90 ${
        isWished
          ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm"
          : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 shadow-sm"
      }`}
      title={isWished ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      <Heart size={18} fill={isWished ? "currentColor" : "none"} className={loading ? "opacity-50" : ""} />
    </button>
  );
}