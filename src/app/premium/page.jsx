"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../lib/constants";
import { Lock, Crown, CheckCircle, Sparkles, Loader2, Crown as CrownIcon } from "lucide-react"; 
import Link from "next/link";
import { toast } from "react-hot-toast";

// 🚀 ১. আমাদের তৈরি করা অল-রাউন্ডার আর্ট কার্ড কম্পোনেন্টটি ইম্পোর্ট করা হলো
import ArtCard from "@/components/ArtCard";

export default function PremiumPage() {
  const [content, setContent] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isForbidden, setIsForbidden] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // 👑 কারেন্ট ইউজার ট্র্যাকার

  useEffect(() => {
    const fetchPremiumContent = async () => {
      try {
        // 👑 ক) উইথ-ক্রেডেনশিয়ালস সহ কারেন্ট ইউজার ডাটা ফেচ
        const userRes = await axios.get(`${API_URL}/auth/me`, { withCredentials: true }).catch(() => null);
        if (userRes && userRes.data.success) {
          setCurrentUser(userRes.data.user);
        }

        // খ) প্রিমিয়াম ডাটা রিকোয়েস্ট
        const response = await axios.get(`${API_URL}/content/premium-data`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setContent(response.data.data); 
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setIsForbidden(true);
        } else {
          console.error("Failed to fetch content:", error);
          toast.error("Failed to load premium content.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumContent();
  }, []);

  // 💳 পেমেন্ট/আপগ্রেড সাবমিট হ্যান্ডলার
  const handleUpgrade = async () => {
    setUpgradeLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/upgrade`, {}, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success("Welcome to Premium! Unlocking VIP features...");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
      toast.error("Upgrade failed. Please try again.");
    } finally {
      setUpgradeLoading(false);
    }
  };

  // রিসোর্স ওপেন করার গ্লোবাল মেকানিজম (যা আর্টকার্ডের ভেতর ক্লিক হলে ফায়ার হবে)
  const handleResourceAccess = (item) => {
    if (item.resourceLink) {
      toast.success("Opening VIP resource...");
      window.open(item.resourceLink, "_blank", "noopener,noreferrer");
    } else {
      toast.error("No target resource link attached to this asset.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">Unlocking VIP Room...</p>
      </div>
    );
  }

  // 🔒 সিনারিও ১: ইউজার যদি ফ্রি মেম্বার হয়, তবে তাকে এই গর্জিয়াস পে-ওয়াল লক স্ক্রিন দেখাবে
  if (isForbidden || (currentUser && !currentUser.isPremium && currentUser.role !== "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden text-center relative">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-8 text-white relative overflow-hidden">
            <Crown size={48} className="mx-auto mb-3 text-white/90 drop-shadow-md" />
            <h2 className="text-3xl font-extrabold mb-1">Premium Access</h2>
            <p className="text-amber-100 text-sm">Unlock the ultimate experience</p>
          </div>
          <div className="p-8">
            <div className="flex justify-center mb-4">
              <div className="bg-rose-100 p-3 rounded-full text-rose-500">
                <Lock size={28} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">This content is locked</h3>
            <p className="text-gray-500 text-sm mb-6">
              You are currently on the <span className="font-bold text-gray-700">Free Plan</span>. Upgrade to Premium to access exclusive tools, resources, and tutorials.
            </p>
            <ul className="text-left space-y-3 mb-8">
              {["Exclusive Premium Assets & Tools", "Unlimited source file downloads", "Priority support & updates"].map((feature, i) => (
                <li key={i} className="flex items-center text-gray-600 text-sm font-medium">
                  <CheckCircle size={18} className="text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={upgradeLoading}
              className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                upgradeLoading ? "bg-slate-700 cursor-not-allowed" : "bg-gradient-to-r from-slate-900 to-slate-800 hover:scale-[1.02]"
              }`}
            >
              {upgradeLoading ? (
                <><Loader2 size={18} className="animate-spin text-amber-400" />Processing...</>
              ) : (
                <><Sparkles size={18} className="text-amber-400" />Upgrade for $9.99/mo</>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🎉 সিনারিও ২: ইউজার যদি প্রো মেম্বার হয়, তবে সে সাকসেসফুলি এই প্রিমিয়াম ড্যাশবোর্ড গ্রিড দেখবে
  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 sm:p-8 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
              <Crown size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">VIP Premium Dashboard</h1>
              <p className="text-gray-500 text-sm">Exclusive Content & Premium Resources For You</p>
            </div>
          </div>
          <Link href="/dashboard" className="text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-all">
            &larr; Back to Dashboard
          </Link>
        </div>

        {/* 📌 ডাইনামিক রিইউজেবল কন্টেন্ট গ্রিড রেন্ডারিং */}
        {content.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-gray-400 font-medium">No premium content available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              // 🚀 আমাদের ম্যাজিক রিইউজেবল ArtCard এখানে বসানো হলো, যা নিজের আপলোড করা প্রিমিয়াম এসেটকে আনলক রাখবে
              <ArtCard 
                key={item._id}
                item={item}
                currentUser={currentUser}
                actionLoadingId={null}
                onResourceAccess={handleResourceAccess}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}