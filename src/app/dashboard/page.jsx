"use client";

import { useEffect, useState } from "react";
import { API_URL } from "../../lib/constants";
import { Loader2, User as UserIcon, Palette, ShieldAlert } from "lucide-react";
import { authClient } from "@/lib/auth-client"; 

import UserDashboard from "@/components/dashboard/UserDashboard";
import ArtistDashboard from "@/components/dashboard/ArtistDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [customAuthLoading, setCustomAuthLoading] = useState(true);

  const { data: session, isPending: isBetterAuthPending } = authClient.useSession();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Dashboard core hydration error:", err);
      } finally {
        setCustomAuthLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // 👑 FIX: Dashboard load হলে pending_role cookie check করো
  // Google OAuth-এ যাওয়ার আগে set করা role cookie থাকলে বাকি user-এর role update করো
  useEffect(() => {
    const applyPendingRole = async () => {
      try {
        // Cookie থেকে pending_role পড়ো
        const match = document.cookie.match(/pending_role=([^;]+)/);
        if (!match) return; // Cookie না থাকলে skip

        const pendingRole = match[1].trim();
        if (pendingRole !== "artist" && pendingRole !== "user") return;

        // Cookie সাথে সাথে clear করে দাও (একবারই ব্যবহার হবে)
        document.cookie = "pending_role=; path=/; max-age=0";

        // Backend-এ role update call
        await fetch(`${API_URL}/auth/update-role`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ role: pendingRole }),
        });

        // Updated user re-fetch
        const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
        const data = await res.json();
        if (data.success) setUser(data.user);

      } catch (err) {
        // Role update fail হলে চুপচাপ থাকো
      }
    };
    applyPendingRole();
  }, []);

  const activeUser = session?.user || user;
  const globalLoading = isBetterAuthPending && customAuthLoading;

  if (globalLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <Loader2 className="animate-spin text-slate-900 mb-2" size={32} />
        <p className="text-sm font-semibold">Configuring your creative workspace...</p>
      </div>
    );
  }

  if (!activeUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600 p-4 text-center">
        <ShieldAlert size={40} className="text-rose-500 mb-3" />
        <h2 className="text-lg font-bold">Access Denied</h2>
        <p className="text-xs text-slate-400 mt-1">Please log in to access your dashboard parameters.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-3 py-1 rounded-full mb-3">
              {activeUser.role === "admin" ? (
                <ShieldAlert size={10} className="text-amber-400" />
              ) : activeUser.role === "artist" ? (
                <Palette size={10} />
              ) : (
                <UserIcon size={10} />
              )}
              Secure Auth Access: {activeUser.role || "user"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Artisano Portal Workspace</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Welcome back, <span className="text-slate-800 font-bold capitalize">{activeUser.name}</span>. Managing customized assets and parameters.
            </p>
          </div>
        </div>

        {/* 👑 FIX: ভুল কমেন্ট রিমুভ করা হয়েছে এবং প্রপার কমেন্ট কার্লি ব্রেসিসে লক করা হয়েছে */}
        {/* Rolex Dynamic Rendering Switch Engine */}
        {activeUser.role === "admin" && <AdminDashboard user={activeUser} />}
        {activeUser.role === "artist" && <ArtistDashboard user={activeUser} />}
        {(activeUser.role === "user" || !activeUser.role) && <UserDashboard user={activeUser} />}

      </div>
    </div>
  );  
}