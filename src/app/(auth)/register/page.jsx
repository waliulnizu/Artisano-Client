"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, UserPlus, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/constants";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

const LOGIN_SLIDES = [
  "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1200&auto=format&fit=crop",
];

export default function RegisterPage() {
  const { data: session } = authClient.useSession();
  const [loginSlide, setLoginSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => setLoginSlide((i) => (i + 1) % LOGIN_SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (session?.user) {
      router.replace("/dashboard");
      return;
    }
    fetch(`${API_URL}/auth/me`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data?.user) router.replace("/dashboard");
      })
      .catch(() => {});
  }, [session, router]);


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        { name, email, password, role },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Account created! Logging you in...");

        const token = response.data.token || response.data.jwt;
        if (token) {
          const maxAge = 7 * 24 * 60 * 60;
          document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
          setTimeout(() => { window.location.href = "/dashboard"; }, 600);
        } else {
          router.push("/login");
        }
      } else {
        toast.error(response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Custom Register Pipeline Failure:", error);
      toast.error(error.response?.data?.message || "Failed to sync connection node.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-100/60 dark:bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-5xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-xl shadow-slate-200/50 rounded-[32px] p-6 sm:p-10 space-y-7 transition-all grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="space-y-7">
        
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">Create Account</h1>
          <p className="text-xs font-medium text-slate-400">Join Artisano network as a verified creator or buyer.</p>
        </div>

        
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Select Account Type</label>
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-50 border border-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all ${role === "user" ? "bg-white text-blue-600 shadow-md ring-2 ring-blue-500 scale-[1.03]" : "text-slate-500 hover:text-slate-800"}`}
            >
              Digital Buyer
            </button>
            <button
              type="button"
              onClick={() => setRole("artist")}
              className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all ${role === "artist" ? "bg-white text-blue-600 shadow-md ring-2 ring-blue-500 scale-[1.03]" : "text-slate-500 hover:text-slate-800"}`}
            >
              Asset Creator
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-slate-100"></div>
          <span className="absolute bg-white px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Or Register with Mail
          </span>
        </div>

        <GoogleAuthButton currentSelectedRole={role} />

        <div className="relative flex items-center justify-center my-2">
          <div className="absolute inset-0 border-t border-slate-100 dark:border-zinc-800"></div>
          <span className="relative bg-white dark:bg-zinc-900 px-4 text-[10px] font-black text-slate-400 tracking-widest uppercase">
            Or Sign Up Via Email
          </span>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                <User size={16} />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                <Mail size={16} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Secure Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-[0.99] mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Establishing Account...</span>
              </>
            ) : (
              <>
                <span>Establish Account</span>
                <UserPlus size={15} />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-50">
          <p className="text-xs font-medium text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">Sign In Instead</Link>
          </p>
        </div>
        </div>

        {/* Right artwork slider panel */}
        <div className="relative rounded-[24px] overflow-hidden hidden md:block min-h-[560px]">
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
              <p className="text-white text-sm font-black">Join the Artisano</p>
              <p className="text-white/60 text-xs">Create, sell, and collect premium digital art.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}