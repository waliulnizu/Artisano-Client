"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { API_URL } from "@/lib/constants";
import { Crown, LayoutDashboard, FolderKanban, ShieldAlert, LogOut, PlusCircle } from "lucide-react";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && isMounted) {
            setCurrentUser(result.user);
          }
        } else {
          if (isMounted) setCurrentUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();
    return () => { isMounted = false; };
  }, [pathname]);

  return (
    <nav className="bg-white border-b border-slate-100 p-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* 🏛️ বাম পাশ: ব্র্যান্ড লোগো */}
        <Link href="/" className="text-2xl font-black text-blue-600 tracking-tight flex-shrink-0">
          Artisano
        </Link>

        {/* 🌐 ডান পাশ: কন্ডিশনাল নেভিগেশন কন্ট্রোলস */}
        <div className="flex items-center gap-3 sm:gap-4">
          {loading ? (
            <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
          ) : currentUser ? (
            <>
              {/* ১. সাধারণ ড্যাশবোর্ড */}
              <Link
                href="/dashboard"
                className="text-slate-600 font-bold hover:text-blue-600 transition text-xs sm:text-sm flex items-center gap-1.5"
              >
                <LayoutDashboard size={15} />
                <span className="hidden md:inline">Dashboard</span>
              </Link>

              {/* ২. ভিআইপি গ্যালারি */}
              <Link
                href="/premium"
                className="flex items-center gap-1.5 text-amber-600 font-extrabold hover:text-amber-700 transition text-xs sm:text-sm border border-amber-200 bg-amber-50/60 px-2.5 py-1.5 rounded-xl shadow-sm"
              >
                <Crown size={14} className="fill-amber-500 text-amber-500" />
                VIP Room
              </Link>

              {/* ৩. গ্লোবাল অ্যাডমিন প্যানেল (কেবল অ্যাডমিনের জন্য) */}
              {currentUser.role === "admin" && (
                <Link
                  href="/dashboard/admin-panel"
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs sm:text-sm px-2.5 py-1.5 rounded-xl border border-rose-200/60 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <ShieldAlert size={14} />
                  Admin Panel
                </Link>
              )}

              {/* ৪. মাই স্টুডিও (আর্টিস্ট ও অ্যাডমিনের নিজস্ব কন্টেন্ট CRUD) */}
              {(currentUser.role === "artist" || currentUser.role === "admin") && (
                <Link
                  href="/dashboard/my-assets"
                  className="text-slate-700 font-bold hover:bg-slate-100 border border-slate-200/40 px-2.5 py-1.5 rounded-xl transition text-xs sm:text-sm flex items-center gap-1.5"
                >
                  <FolderKanban size={14} />
                  My Studio
                </Link>
              )}

              {/* ৫. 👑 ডাইনামিক আপলোড বাটন (২টি বাটনকে মার্জ করে প্রফেশনাল ১টি করা হলো) */}
              {(currentUser.role === "artist" || currentUser.role === "admin") && (
                <Link
                  href={currentUser.role === "admin" ? "/admin/create-content" : "/dashboard/upload"}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <PlusCircle size={14} />
                  Upload
                </Link>
              )}

              {/* ৬. 👤 প্রোফাইল ও লগআউট সেকশন (হিজিবিরি মুক্ত ক্লিন লেআউট) */}
              <div className="flex items-center gap-3 pl-3 border-l border-slate-100">
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.profileImage || "https://i.ibb.co/4pDNDk1/avatar.png"}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full border border-slate-200 object-cover shadow-sm hidden sm:inline"
                  />
                  <span className="text-slate-800 font-bold text-xs truncate max-w-[80px]">
                    {currentUser.name?.split(" ")[0]} {/* শুধু ফার্স্ট নেম দেখাবে স্পেস বাঁচাতে */}
                  </span>
                </div>

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
            /* লগইন না থাকলে ক্লিয়ার গেটওয়ে */
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