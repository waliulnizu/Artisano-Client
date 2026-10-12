"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { ShieldCheck, Users, Crown, Layers, Loader2 } from "lucide-react";
import StatCard from "./StatCard";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalArtworks: 0, premiumUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/dashboard/admin-stats`, { withCredentials: true });
        if (res.data.success) setStats(res.data.data);
      } catch (err) {
        console.error("Admin metrics hydration error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="py-10 flex items-center justify-center text-slate-500 dark:text-zinc-400 font-medium">
        <Loader2 className="animate-spin text-[#5a6b48] mr-2" size={20} /> Loading network metrics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          icon={Users}
          tone="blue"
          label="Total Network Users"
          value={`${stats.totalUsers} Members`}
          sub="Registered accounts"
        />

        <StatCard
          icon={Crown}
          tone="amber"
          label="Premium VIP Accounts"
          value={`${stats.premiumUsers} Subscribers`}
          sub="Active paid plans"
        />

        <StatCard
          icon={Layers}
          tone="olive"
          label="Global Assets Published"
          value={`${stats.totalArtworks} Items`}
          sub="Across the marketplace"
        />
      </div>

      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
        <span aria-hidden className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-amber-50 dark:bg-amber-950/30 blur-3xl" />
        <h3 className="relative font-black text-slate-900 dark:text-white text-base flex items-center gap-2 mb-2">
          <ShieldCheck size={18} className="text-amber-500" /> Administrative Governance Dashboard
        </h3>
        <p className="relative text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-3xl">
          You are logged in with maximum security clearance. From here, you can audit commercial transaction catalogs,
          monitor cloud computing layers, and configure server middleware constraints. (Stripe payout audits and active
          database indices are fully linked).
        </p>
      </div>
    </div>
  );
}
