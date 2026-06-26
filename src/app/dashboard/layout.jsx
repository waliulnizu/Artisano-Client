"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Palette, CreditCard, FolderHeart, ShieldAlert, Settings, PlusCircle } from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  // 🗺️ আপনার আসল ফোল্ডার স্ট্রাকচার অনুযায়ী ১০০% সিঙ্কড মেনু আইটেমস
  const menuItems = [
    { 
      label: "Overview", 
      href: "/dashboard", 
      icon: <LayoutDashboard size={16} /> 
    },
    { 
      label: "My Studio", 
      href: "/dashboard/my-assets", // 🎯 আপনার ফোল্ডারের সাথে একদম নির্ভুল সিঙ্ক
      icon: <Palette size={16} /> 
    }, 
    { 
    label: "Upload Asset", 
    href: "/dashboard/upload", // 🎯 আপনার তৈরি করা আপলোড পেজের রাউট পাথটি এখানে দিন ভাই
    icon: <PlusCircle size={16} /> 
  },
    { 
      label: "Billing & Payments", 
      href: "/dashboard/transactions", // 🎯 আপনার তৈরি করা নতুন ট্রানজেকশন পেজ
      icon: <CreditCard size={16} /> 
    },
    { 
      label: "Settings", 
      href: "/dashboard/settings", // 🎯 আপনার স্ট্রাকচারের সেটিংস পেজ
      icon: <Settings size={16} /> 
    }
  ];

  return (
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
              // অ্যাক্টিভ স্টেট লজিক ফিক্স
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
  );
}