"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { API_URL } from "@/lib/constants";
import { Sparkles, Crown } from "lucide-react";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // হ্যান্ডেল লগআউট ফাংশন
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
            setCurrentUser((prevUser) => {
              if (JSON.stringify(prevUser) === JSON.stringify(result.user)) return prevUser;
              return result.user;
            });
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

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold text-blue-600 tracking-tight">
          Artisano
        </Link>

        <div>
          {loading ? (
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
          ) : currentUser ? (
            <div className="flex items-center gap-5">

              {/* 🏠 সাধারণ ড্যাশবোর্ড লিঙ্ক */}
              <Link
                href="/dashboard"
                className="text-gray-600 font-semibold hover:text-blue-600 transition text-sm"
              >
                Dashboard
              </Link>

              {/* 👑 নতুন প্রফেশনাল ভিআইপি বাটন */}
              <Link
                href="/premium"
                className="flex items-center gap-1 text-amber-600 font-bold hover:text-amber-700 transition text-sm border border-amber-200 bg-amber-50/50 px-3 py-1.5 rounded-lg"
              >
                <Crown size={15} className="fill-amber-500 text-amber-500" />
                VIP Gallery
              </Link>

              {/* 🛡️ রোল অনুযায়ী প্রফেশনাল অ্যাডমিন কন্টেন্ট তৈরি করার বাটন */}
              {currentUser.role === "admin" && (
                <Link
                  href="/admin/create-content"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1"
                >
                  <Sparkles size={14} />
                  Create Content (Admin)
                </Link>
              )}

              {/* 🎨 Artist Space: ইউজার যদি আর্টিস্ট বা অ্যাডমিন হন, তবে তাকে অ্যাসেট আপলোড করার বাটনটি দেখাবে */}
              {(currentUser?.role === "artist" || currentUser?.role === "admin") && (
                <Link
                  href="/dashboard/upload"
                  className="flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold px-4 py-2 rounded-xl transition-all text-sm border border-purple-200"
                >
                  ✨ Upload Asset
                </Link>
              )}

              {/* ইউজার ইনফো */}
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
                  <img
                    src={currentUser.profileImage || "https://i.ibb.co/4pDNDk1/avatar.png"}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-gray-800 font-semibold text-sm capitalize">
                  {currentUser.name}
                </span>
              </div>

              {/* লগআউট বাটন */}
              <button
                className="px-4 py-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-lg transition-all font-medium text-sm ml-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            /* লগইন না থাকলে সাইন-আপ এবং লগইন বাটন */
            <div className="flex gap-3">
              <Link
                href="/login"
                className="px-5 py-2 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition text-sm"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm hover:shadow transition text-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}