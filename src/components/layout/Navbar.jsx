"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL } from "../../lib/constants";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // 📌 ১. হ্যান্ডেল লগআউট ফাংশন
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // লগআউট সফল হলে পেজটি রিফ্রেশ হবে
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setUser(result.user);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
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
          ) : user ? (
            <div className="flex items-center gap-5">
              
              <Link 
                href="/dashboard" 
                className="text-gray-600 font-semibold hover:text-blue-600 transition text-sm"
              >
                Dashboard
              </Link>

              {/* রোল অনুযায়ী অ্যাডমিন লিঙ্ক */}
              {user.role === 'admin' && (
                <Link href="/admin/dashboard" className="text-red-600 text-sm font-bold hover:underline">
                  Admin Panel
                </Link>
              )}
              
              {/* 📌 নতুন যুক্ত করা প্রোফাইল ইমেজ ও নাম সেকশন */}
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
                  <img
                    src={user.profileImage || "https://i.ibb.co/4pDNDk1/avatar.png"} // ক্লাউডিনারি ইমেজ বা ডিফল্ট
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-gray-800 font-semibold text-sm capitalize">
                  {user.name}
                </span>
              </div>

              <button
                className="px-4 py-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-lg transition-all font-medium text-sm ml-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
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