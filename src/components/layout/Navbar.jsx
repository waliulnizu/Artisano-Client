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

  // 📌 ১. হ্যান্ডেল লগআউট ফাংশনটি এখানে বসান
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
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold text-blue-600">
          Artisano
        </Link>

        <div>
          {loading ? (
            <span className="text-gray-500">Loading...</span>
          ) : user ? (
            <div className="flex items-center gap-4">

            <Link 
      href="/dashboard" 
      className="text-blue-600 font-semibold hover:text-blue-800 transition text-sm"
    >
      Dashboard
    </Link>

    {/* 📌 রোল অনুযায়ী অ্যাডমিন লিঙ্ক (যদি ইউজার অ্যাডমিন হয়) */}
    {user.role === 'admin' && (
      <Link href="/admin/dashboard" className="text-red-600 text-sm font-bold">Admin Panel</Link>
    )}
              <span className="text-gray-800 font-medium">
                Welcome, {user.name}
                
                {console.log("Current User State:", user)}

                {/* যদি user অবজেক্টে ডাটা থাকে, তবে চেক করুন field এর নাম কি user.name নাকি user.fullName? */}

              </span>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
                onClick={handleLogout} // 📌 ২. এখানে কল করা হয়েছে
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition text-sm"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
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