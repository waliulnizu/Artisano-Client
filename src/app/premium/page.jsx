"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../lib/constants";
import { Lock, Crown, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export default function PremiumPage() {
  // 📌 ১. স্টেট ডিক্লেয়ারেশন (State Management)
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isForbidden, setIsForbidden] = useState(false);

  // 📌 ২. কম্পোনেন্ট লোড হওয়ার সাথে সাথে ডাটা ফেচ করা
  useEffect(() => {
    const fetchPremiumContent = async () => {
      try {
        // ব্যাকএন্ডে রিকোয়েস্ট পাঠানো (কুকি সহ)
        const response = await axios.get(`${API_URL}/content/premium-data`, {
          withCredentials: true, // এটি না দিলে ব্যাকএন্ড বুঝবে না কে রিকোয়েস্ট করেছে
        });

        if (response.data.success) {
          setContent(response.data.data);
        }
      } catch (error) {
        // 🧠 ডেভেলপার থট: যদি আমাদের 'checkPremium' মিডলওয়্যার 403 এরর দেয়
        if (error.response && error.response.status === 403) {
          setIsForbidden(true); // ইউজারকে Paywall দেখানোর সিগন্যাল
        } else {
          console.error("Failed to fetch content:", error);
        }
      } finally {
        setLoading(false); // ডাটা আসুক বা এরর খাক, লোডিং বন্ধ করো
      }
    };

    fetchPremiumContent();
  }, []);

  // 📌 ৩. UI রেন্ডারিং: Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">Unlocking VIP Room...</p>
      </div>
    );
  }

  // 📌 ৪. UI রেন্ডারিং: Forbidden State (The Paywall Design)
  if (isForbidden) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden text-center relative">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-8 text-white relative overflow-hidden">
            <Crown size={48} className="mx-auto mb-3 text-white/90 drop-shadow-md" />
            <h2 className="text-3xl font-extrabold mb-1">Premium Access</h2>
            <p className="text-amber-100 text-sm">Unlock the ultimate experience</p>
          </div>

          {/* Body Content */}
          <div className="p-8">
            <div className="flex justify-center mb-4">
              <div className="bg-rose-100 p-3 rounded-full text-rose-500">
                <Lock size={28} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              This content is locked
            </h3>
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

            <button className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
              <Sparkles size={18} className="text-amber-400" />
              Upgrade for $9.99/mo
            </button>
            <p className="text-xs text-gray-400 mt-4">Cancel anytime. No hidden fees.</p>
          </div>
        </div>
      </div>
    );
  }

  // 📌 ৫. UI রেন্ডারিং: Success State (The VIP Room)
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
              <Crown size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">VIP Dashboard</h1>
              <p className="text-gray-500 text-sm">Welcome back, Premium Member!</p>
            </div>
          </div>
          
          {/* ডাটাবেস থেকে আসা কন্টেন্ট রেন্ডার করা */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <p className="text-lg text-gray-800 font-medium">{content?.message}</p>
            <ul className="mt-4 space-y-2">
              {content?.exclusiveFeatures?.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <Link href="/dashboard" className="text-blue-600 font-semibold hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}