"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; 
import { API_URL } from "@/lib/constants"; 
import { Crown, LayoutDashboard, FolderKanban, ShieldAlert, LogOut, PlusCircle, Settings, Compass } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const [customUser, setCustomUser] = useState(null);
  const [customLoading, setCustomLoading] = useState(true);

  const { data: session, isPending: isBetterAuthPending } = authClient.useSession();

  useEffect(() => {
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
    <nav className="bg-white border-b border-slate-100 p-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* 🏢 বাম পাশ: লোগো এবং গ্লোবাল ব্রাউজ গ্যালারি লিংক গেটওয়ে */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tight flex-shrink-0">
            Artisano
          </Link>

          {/* 👑 [NEW INTERLINK ADDED]: মেইন সার্চ ও ফিল্টার পেজ গেটওয়ে */}
          <Link
            href="/browse"
            className="text-slate-500 font-bold hover:text-blue-600 transition text-xs sm:text-sm flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl hidden sm:flex shadow-sm"
          >
            <Compass size={14} className="text-blue-500" />
            Explore Gallery
          </Link>
        </div>

        {/* 🤝 ডান পাশ: সেশন কন্ট্রোল আইকন ও লিংক সমূহ */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* মোবাইল ডিভাইসের জন্য ছোট এক্সপ্লোর আইকন (Responsive Support) */}
          <Link href="/browse" className="sm:hidden text-slate-500 hover:text-blue-600 p-1.5 transition">
            <Compass size={18} />
          </Link>

          {globalLoading ? (
            <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
          ) : currentUser ? (
            <>
              <Link
                href="/dashboard"
                className="text-slate-600 font-bold hover:text-blue-600 transition text-xs sm:text-sm flex items-center gap-1.5"
              >
                <LayoutDashboard size={15} />
                <span className="hidden md:inline">Dashboard</span>
              </Link>

              <Link
                href="/premium"
                className="flex items-center gap-1.5 text-amber-600 font-extrabold hover:text-amber-700 transition text-xs sm:text-sm border border-amber-200 bg-amber-50/60 px-2.5 py-1.5 rounded-xl shadow-sm"
              >
                <Crown size={14} className="fill-amber-500 text-amber-500" />
                VIP Room
              </Link>

              {currentUser.role === "admin" && (
                <Link
                  href="/dashboard/admin-panel"
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs sm:text-sm px-2.5 py-1.5 rounded-xl border border-rose-200/60 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <ShieldAlert size={14} />
                  Admin Panel
                </Link>
              )}

              

              <div className="flex items-center gap-3 pl-3 border-l border-slate-100">
                <Link 
                  href="/dashboard/settings" 
                  className="flex items-center gap-2 group cursor-pointer"
                  title="Go to Account Settings ⚙️"
                >
                  <div className="relative">
                    <img
                      src={currentUser.image || "https://i.ibb.co/4pDNDk1/avatar.png"} 
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full border border-slate-200 object-cover shadow-sm hidden sm:inline group-hover:border-blue-400 transition-all"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white border border-slate-100 rounded-full p-0.5 shadow-sm hidden md:block group-hover:rotate-45 transition-transform duration-300">
                      <Settings size={8} className="text-slate-500 group-hover:text-blue-600" />
                    </div>
                  </div>

                  <span className="text-slate-800 font-bold text-xs truncate max-w-[80px] group-hover:text-blue-600 transition-colors capitalize">
                    {currentUser.name?.split(" ")[0]}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Logout Account"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="px-4 py-1.5 text-blue-600 font-bold hover:bg-blue-50 transition text-sm rounded-xl">
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