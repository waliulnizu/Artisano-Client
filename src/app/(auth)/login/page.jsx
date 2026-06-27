"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client"; 
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import AuthRoleSelector from "@/components/auth/AuthRoleSelector"; 
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { API_URL } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Better-Auth সেশন ট্র্যাকিং হুক
  const { data: session, isPending } = authClient.useSession();

  // =========================================================================
  // 👑 DYNAMIC REDIRECT GATEWAY: সেশন অথবা কাস্টম কুকি যেকোনো একটি পেলেই রিডাইরেক্ট করবে
  // =========================================================================
  useEffect(() => {
    // ব্রাউজারে ম্যানুয়াল টোকেন কুকি আছে কি না তা চেক করার ট্রিক
    const hasLocalToken = typeof document !== "undefined" && document.cookie.includes("token=");

    if (!isPending) {
      if ((session && session.user) || hasLocalToken) {
        // 🎯 প্রোফাইল ডাটা মেমরিতে লোড হয়ে গেলে হোমপেজে বা আপনার সঠিক ড্যাশবোর্ডে পাঠাবে
        window.location.href = "/"; 
      }
    }
  }, [session, isPending]);

  // 📧 প্রথাগত ইমেইল-পাসওয়ার্ড সাবমিশন হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please fill in all security parameters.");
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", 
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Identity verified! Entering secure workspace...");
        
        // =========================================================================
        // 👑 FIX 2: ক্রস-ডোমেন প্রোডাকশন ফ্রেন্ডলি কুকি এনফোর্সমেন্ট
        // =========================================================================
        const clientToken = data.token || data.jwt;
        if (clientToken) {
          const maxAge = 7 * 24 * 60 * 60; 
          // 🚀 প্রোডাকশনে ভিন্ন ডোমেন যেন কুকি সেভ করতে পারে, তাই পাথ সহ কনফিগারেশন সেট করা হলো
          document.cookie = `token=${clientToken}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
        }

        // 👑 FIX 3: Next.js মেমরি রিফ্রেশ গেটওয়ে
        // সফল লগইনের পর সরাসরি হোমপেজে ("/") পুশ করে দেওয়া হলো, যাতে নেভবার ডাটা ইনস্ট্যান্ট আপডেট হয়
        setTimeout(() => {
          window.location.href = "/";
        }, 600);

      } else {
        toast.error(data.message || "Invalid credentials. Threat signature detected.");
      }
    } catch (error) {
      console.error("Mail Login error node:", error);
      toast.error("Authentication vault link timed out.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-8 bg-slate-50/30">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/40 space-y-6">
        
        {/* 📝 হেডার কন্টেন্ট */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Securely sign-in to your Artisano account node.
          </p>
        </div>

        {/* 🧭 ১. ডাইনামিক রোল সিলেক্টর এবং গুগল সাইন-ইন গেটওয়ে */}
        <AuthRoleSelector />

        {/* ⚡ সেপারেটর লাইন */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 border-t border-slate-100"></div>
          <span className="relative bg-white px-4 text-[10px] font-black text-slate-400 tracking-widest uppercase">
            Or Sign In Via Mail
          </span>
        </div>

        {/* ✉️ ২. প্রথাগত ইমেইল-পাসওয়ার্ড লগইন ফর্ম */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ইমেইল ইনপুট নোড */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider pl-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-slate-400" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@domain.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          {/* পাসওয়ার্ড ইনপুট নোড */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs font-bold text-blue-600 hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-slate-400" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* সাবমিট বাটন (Access Workspace) */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-4 rounded-xl text-sm transition-all shadow-md shadow-blue-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                <span>Decrypting Assets...</span>
              </>
            ) : (
              <>
                <span>Access Workspace</span>
                <ShieldCheck size={16} />
              </>
            )}
          </button>
        </form>

        {/* 🔗 রেজিস্টার পেজ লিংক নোড */}
        <p className="text-xs text-slate-400 font-bold text-center">
          New to our marketplace?{" "}
          <Link href="/register" className="text-blue-600 hover:underline pl-0.5">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}