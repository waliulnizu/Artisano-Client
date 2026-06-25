"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { ShieldCheck, Users, Crown, Layers, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalArtworks: 0, premiumUsers: 0 });
  const [loading, setLoading] = useState(true);

  // 📥 ব্যাকঅ্যান্ড এপিআই থেকে গ্লোবাল সিস্টেম মেট্রিক্স লোড করা
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
          <div className="py-10 flex items-center justify-center text-slate-500 font-medium">
              <Loader2 className="animate-spin text-slate-900 mr-2" size={20} /> Loading Master Firewall...
          </div>
      );
  }

  return (
    <div className="space-y-10">
      
      {/* 📊 অ্যাডমিন মেগা অ্যানালিটিক্স গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={20} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Network Users</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.totalUsers} Members</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Crown size={20} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Premium VIP Accounts</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.premiumUsers} Subscribers</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Layers size={20} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Global Assets Published</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.totalArtworks} Items</p>
          </div>
        </div>
      </div>

      {/* 👑 অ্যাডমিন কন্ট্রোল বোর্ড নোটিশ */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="font-black text-slate-900 text-base flex items-center gap-2 mb-2">
          <ShieldCheck size={18} className="text-amber-500" /> Administrative Governance Dashboard
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          You are logged in with maximum security clearance. From here, you can audit commercial transaction catalogs, monitor cloud computing layers, and configure server middleware constraints. (Stripe payout audits and active database indices are fully linked).
        </p>
      </div>

    </div>
  );
}