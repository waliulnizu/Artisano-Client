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

const LOGIN_SLIDES = [
  "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1200&auto=format&fit=crop",
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSlide, setLoginSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setLoginSlide((i) => (i + 1) % LOGIN_SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const { data: session, isPending } = authClient.useSession();

  // =========================================================================
  // =========================================================================
  useEffect(() => {
    const hasLocalToken = typeof document !== "undefined" && document.cookie.includes("token=");

    if (!isPending) {
      if ((session && session.user) || hasLocalToken) {
        window.location.href = "/"; 
      }
    }
  }, [session, isPending]);

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
        // =========================================================================
        const clientToken = data.token || data.jwt;
        if (clientToken) {
          const maxAge = 7 * 24 * 60 * 60; 
          document.cookie = `token=${clientToken}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
        }

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
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-8 bg-slate-100/60 dark:bg-zinc-950">
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2rem] p-4 sm:p-6 shadow-xl shadow-slate-200/50 dark:shadow-none grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 sm:p-8 space-y-6">
        
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Securely sign-in to your Artisano account node.
          </p>
        </div>

        
        <AuthRoleSelector />

        
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 border-t border-slate-100"></div>
          <span className="relative bg-white px-4 text-[10px] font-black text-slate-400 tracking-widest uppercase">
            Or Sign In Via Mail
          </span>
        </div>

        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          
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

        
        <p className="text-xs text-slate-400 font-bold text-center">
          New to our marketplace?{" "}
          <Link href="/register" className="text-blue-600 hover:underline pl-0.5">
            Create Account
          </Link>
        </p>
        </div>

        {/* Right artwork panel with image slider */}
        <div className="relative rounded-[1.75rem] overflow-hidden hidden md:block min-h-[520px]">
          {LOGIN_SLIDES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Abstract artwork"
              style={{ transitionDuration: "1500ms" }}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity ${i === loginSlide ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
          <span className="absolute top-5 right-5 bg-black/50 backdrop-blur text-white/80 text-[10px] font-black tracking-[0.25em] px-4 py-2 rounded-full border border-white/10">
            + SECURE PLATFORM
          </span>
          <div className="absolute bottom-5 left-5 right-5 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-black">A</div>
            <div>
              <p className="text-white text-sm font-black">Welcome Back to Artisano</p>
              <p className="text-white/60 text-xs">Your digital assets are waiting for you.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}