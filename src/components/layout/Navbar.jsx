"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; 
import { API_URL } from "@/lib/constants"; 
import { Crown, LayoutDashboard, LogOut, Settings, Compass, Sun, Moon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const router = useRouter();
  const [customUser, setCustomUser] = useState(null);
  const [customLoading, setCustomLoading] = useState(true);
  
  // 🌙 ডার্ক মোড স্টেট এবং মাউন্ট চেকিং
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { data: session, isPending: isBetterAuthPending } = authClient.useSession();

  // সেশন ফেচিং এবং রিয়্যাক্ট ১৯ হাইড্রেশন ফিক্স সিঙ্ক
  useEffect(() => {
    setMounted(true); // ক্লায়েন্ট মাউন্ট কনফর্মেশন

    const fetchCustomUser = async () => {
      setCustomLoading(true);
      try {
        const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
        const data = await res.json();
        if (data.success) {
          setCustomUser(data.user);
        } else {
          setCustomUser(null);
        }
      } catch (err) {
        setCustomUser(null);
      } finally {
        setCustomLoading(false);
      }
    };
    if (!isBetterAuthPending) {
      fetchCustomUser();
    }
  }, [isBetterAuthPending, session]);

  const currentUser = session?.user || customUser;
  const globalLoading = isBetterAuthPending || customLoading;

  const handleLogout = async () => {
    try {
      if (session) {
        await authClient.signOut();
      } else {
        await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      }
      toast.success("Logged out successfully.");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout process met an issue.");
    }
  };

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 p-4 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* 🏢 বাম পাশ: লোগো এবং গ্লোবাল ব্রাউজ গ্যালারি লিংক গেটওয়ে */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-black text-blue-600 dark:text-blue-500 tracking-tight flex-shrink-0">
            Artisano
          </Link>

          <Link
            href="/browse"
            className="text-slate-500 dark:text-zinc-400 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition text-xs sm:text-sm flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 px-3 py-1.5 rounded-xl hidden sm:flex shadow-sm"
          >
            <Compass size={14} className="text-blue-500 dark:text-blue-400" />
            Explore Gallery
          </Link>
        </div>

        {/* 🤝 ডান পাশ: সেশন কন্ট্রোল আইকন ও লিংক সমূহ */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* মোবাইল ডিভাইসের জন্য রেসপন্সিভ এক্সপ্লোর আইকন */}
          <Link href="/browse" className="sm:hidden text-slate-500 dark:text-zinc-400 hover:text-blue-600 p-1.5 transition">
            <Compass size={18} />
          </Link>

          {/* =========================================================================
              🌙 [THEME TOGGLE SWITCH NODE]: ডার্ক মোডে Moon এবং লাইট মোডে Sun দেখাবে
             ========================================================================= */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-slate-100 dark:border-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer shadow-sm flex items-center justify-center"
              aria-label="Toggle Website Color Theme"
              title={theme === "dark" ? "Switch to Light Mode ☀️" : "Switch to Dark Mode 🌙"}
            >
              {theme === "dark" ? (
                <Moon className="h-4 w-4 text-indigo-400 animate-pulse" />
              ) : (
                <Sun className="h-4 w-4 text-amber-500" />
              )}
            </button>
          )}

          {globalLoading ? (
            <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
          ) : currentUser ? (
            <>
              <Link
                href="/dashboard"
                className="text-slate-600 dark:text-zinc-300 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition text-xs sm:text-sm flex items-center gap-1.5"
              >
                <LayoutDashboard size={15} />
                <span className="hidden md:inline">Dashboard</span>
              </Link>

              <Link
                href="/premium"
                className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-extrabold hover:text-amber-700 transition text-xs sm:text-sm border border-amber-200 dark:border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/20 px-2.5 py-1.5 rounded-xl shadow-sm"
              >
                <Crown size={14} className="fill-amber-500 text-amber-500 dark:text-amber-400" />
                VIP Room
              </Link>

              <div className="flex items-center gap-3 pl-3 border-l border-slate-100 dark:border-zinc-800">
                <Link 
                  href="/dashboard/settings" 
                  className="flex items-center gap-2 group cursor-pointer"
                  title="Go to Account Settings ⚙️"
                >
                  <div className="relative">
                    <img
                      src={currentUser.image || "https://i.ibb.co/4pDNDk1/avatar.png"} 
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full border border-slate-200 dark:border-zinc-700 object-cover shadow-sm hidden sm:inline group-hover:border-blue-400 transition-all"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-full p-0.5 shadow-sm hidden md:block group-hover:rotate-45 transition-transform duration-300">
                      <Settings size={8} className="text-slate-500 dark:text-zinc-400 group-hover:text-blue-600" />
                    </div>
                  </div>

                  <span className="text-slate-800 dark:text-zinc-200 font-bold text-xs truncate max-w-[80px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors capitalize">
                    {currentUser.name?.split(" ")[0]}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
                  title="Logout Account"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="px-4 py-1.5 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-zinc-800 transition text-sm rounded-xl">
                Login
              </Link>
              <Link href="/register" className="px-4 py-1.5 bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm rounded-xl text-sm transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>
        
      </div>
    </nav>
  );
}