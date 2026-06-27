"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { LayoutDashboard, Palette, CreditCard, FolderHeart, ShieldAlert, Settings, PlusCircle } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState("user"); // ডিফল্ট রোল 'user'

  // 🔄 ব্যাকএন্ড থেকে কারেন্ট লগইনড ইউজারের আসল রোলটি রিয়েল-টাইম রিড করা
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
        if (res.data.success && res.data.user) {
          setUserRole(res.data.user.role); // ডাটাবেস থেকে রোল সেট হবে (user / artist / admin)
        }
      } catch (error) {
        console.error("Failed to fetch session role for sidebar alignment:", error);
      }
    };
    checkUserRole();
  }, []);

  // 🏛️ গ্লোবাল মাস্টার মেনু ডিরেক্টরি (প্রতিটি আইটেমের রোল রিকোয়ারমেন্ট সহ)
  const masterMenu = [
    { 
      label: "Overview", 
      href: "/dashboard", 
      icon: <LayoutDashboard size={16} />,
      roles: ["user", "artist", "admin"] // সবাই দেখবে
    },
    { 
      label: "My Studio", 
      href: "/dashboard/my-assets", 
      icon: <Palette size={16} />,
      roles: ["artist", "admin"] // 🎨 শুধু আর্টিস্ট ও এডমিন দেখবে
    }, 
    { 
      label: "Upload Asset", 
      href: "/dashboard/upload", 
      icon: <PlusCircle size={16} />,
      roles: ["artist", "admin"] // 🎨 শুধু আর্টিস্ট ও এডমিন দেখবে
    },
    { 
      label: "Billing & Payments", 
      href: "/dashboard/transactions", 
      icon: <CreditCard size={16} />,
      roles: ["user", "artist", "admin"] // সবাই দেখবে
    },
    { 
      label: "Admin Panel", 
      href: "/dashboard/admin-panel", 
      icon: <ShieldAlert size={16} />,
      roles: ["admin"] // 👑 শুধু রুট এডমিন দেখবে
    },
    { 
      label: "Settings", 
      href: "/dashboard/settings", 
      icon: <Settings size={16} />,
      roles: ["user", "artist", "admin"] // সবাই দেখবে
    }
  ];

  // 🎯 [DYNAMIC PRIVILEGE FILTERING]: কারেন্ট ইউজারের রোলের সাথে ম্যাচ করে মেনু জেনারেট করা
  const menuItems = masterMenu.filter(item => item.roles.includes(userRole));

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50/50 text-slate-800">
        
        {/* 🏛️ FIXED SIDEBAR COMPONENT */}
        <aside className="w-64 bg-white border-r border-slate-200/60 flex flex-col justify-between fixed h-full z-30">
          <div>
            {/* Studio Brand/Header */}
            <div className="h-20 flex items-center px-6 border-b border-slate-100">
              <span className="text-base font-black tracking-tight text-slate-950">
                Artisano <span className="text-purple-600">Studio</span>
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="p-4 space-y-1 mt-4">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black tracking-tight transition-all uppercase ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`${isActive ? "text-white" : "text-slate-400"}`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer Settings/Exit Quick Nodes */}
          <div className="p-4 border-t border-slate-100 space-y-1">
            <Link
              href="/browse"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black tracking-tight text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all uppercase"
            >
              <FolderHeart size={16} />
              Back to Feed
            </Link>
          </div>
        </aside>

        {/* 🚀 DYNAMIC CONTENT WINDOW PANEL */}
        <main className="flex-1 pl-64 min-h-screen">
          <div className="p-4 sm:p-8 md:p-10">
            {children}
          </div>
        </main>

      </div>
    </ProtectedRoute>
  );
}