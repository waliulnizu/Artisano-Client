"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../lib/constants";
import { Lock, Crown, CheckCircle, Sparkles, Loader2, ExternalLink, BookOpen, Wrench, FileText } from "lucide-react"; 
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function PremiumPage() {
  const [content, setContent] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isForbidden, setIsForbidden] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  useEffect(() => {
    const fetchPremiumContent = async () => {
      try {
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">Unlocking VIP Room...</p>
      </div>
    );
  }

  if (isForbidden) {
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
              {["Ad-free experience", "Unlimited premium downloads", "Priority 24/7 support"].map((feature, i) => (
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case "tutorial": return <BookOpen size={20} className="text-blue-500" />;
      case "tool": return <Wrench size={20} className="text-emerald-500" />;
      default: return <FileText size={20} className="text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-5xl mx-auto">

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

        {/* 📌 ডাইনামিক কন্টেন্ট লিস্ট রেন্ডারিং (The Magic Grid) */}
        {content.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-gray-400 font-medium">No content available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
                <div>
                  <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-gray-100 border border-gray-50">
                    <img
                      src={item.featuredImage}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
                    />
                  </div>
                  
                  {/* Category Badge & 📌 ডাইনামিক প্রিমিয়াম ট্যাগ */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </span>
                    
                    {/* 🧠 Developer Thought: এখানে কন্ডিশনাল রেন্ডারিং ব্যবহার করে Pro Only ও Free Access ব্যাজ আলাদা করা হলো */}
                    {item.isPremiumOnly ? (
                      <span className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-lg">
                        <Sparkles size={12} /> PRO ONLY
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-lg">
                        FREE ACCESS
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Footer Section: Author Info & Action Button */}
                <div className="border-t border-gray-50 pt-4 flex justify-between items-center mt-auto">
                  <div className="flex items-center gap-2">
                    {item.author?.avatar ? (
                      <img src={item.author.avatar} alt={item.author.name} className="w-8 h-8 rounded-full border object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        {item.author?.name?.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-gray-500">By {item.author?.name || "Admin"}</span>
                  </div>

                  {/* Resource Action Button */}
                  <button
                    onClick={() => {
                      if (item.resourceLink) {
                        toast.success("Opening resource...");
                        window.open(item.resourceLink, "_blank", "noopener,noreferrer");
                      } else {
                        toast.error("No external link provided for this resource.");
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2.5 rounded-xl transition-all"
                  >
                    Access Resource
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}