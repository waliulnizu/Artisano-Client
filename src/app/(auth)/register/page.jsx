"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, UserPlus, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // 👑 ADD: রোল ট্র্যাক করার জন্য লোকাল স্টেট
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password, role },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Account created! Logging you in...");

        // 👑 FIX: Registration-এর পর সরাসরি auto-login করো
        // Token response-এ থাকলে cookie-তে সেট করো
        const token = response.data.token || response.data.jwt;
        if (token) {
          const maxAge = 7 * 24 * 60 * 60;
          document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
          // Hard reload দিয়ে dashboard-এ যাও - Navbar সাথে সাথে update হবে
          setTimeout(() => { window.location.href = "/dashboard"; }, 600);
        } else {
          // Token না থাকলে login page-এ নিয়ে যাও
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
    <div className="min-h-[calc(100vh-80px)] bg-slate-50/50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-[32px] p-6 sm:p-10 space-y-7 transition-all">
        
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">Create Account</h1>
          <p className="text-xs font-medium text-slate-400">Join Artisano network as a verified creator or buyer.</p>
        </div>

        {/* 🧭 👑 FIX: বাটন সিলেক্টরের ইন্টারকনেক্টিভিটি প্যানেল */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Select Account Type</label>
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-50 border border-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all ${role === "user" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-800"}`}
            >
              Digital Buyer
            </button>
            <button
              type="button"
              onClick={() => setRole("artist")}
              className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all ${role === "artist" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-800"}`}
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
    </div>
  );
}