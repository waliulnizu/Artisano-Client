"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import Link from "next/link";
import { Palette, UploadCloud, Layers, DollarSign, Loader2 } from "lucide-react";
import MyAssetsPage from "@/app/dashboard/my-assets/page"; // আপনার এক্সিস্টিং মাই এসেটস পেজ

export default function ArtistDashboard({ user }) {
  const [stats, setStats] = useState({ totalAssets: 0, totalSales: 0, totalEarnings: 0 });
  const [loading, setLoading] = useState(true);

  // 📥 ব্যাকঅ্যান্ড থেকে আর্টিস্টের লাইভ অ্যানালিটিক্স ম্যাট্রিক্স তুলে আনা
  useEffect(() => {
      const fetchArtistStats = async () => {
          try {
              const res = await axios.get(`${API_URL}/dashboard/artist-stats`, { withCredentials: true });
              if (res.data.success) setStats(res.data.data);
          } catch (err) {
              console.error("Artist stats hydration error:", err);
          } finally {
              setLoading(false);
          }
      };
      fetchArtistStats();
  }, []);

  if (loading) {
      return (
          <div className="py-10 flex items-center justify-center text-slate-500 font-medium">
              <Loader2 className="animate-spin text-slate-900 mr-2" size={20} /> Syncing Creator Studio...
          </div>
      );
  }

  return (
    <div className="space-y-10">
      
      {/* 📊 আর্টিস্ট অ্যানালিটিক্স ব্যানার */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Layers size={20} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Assets</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.totalAssets} Files</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><DollarSign size={20} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Earnings</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">${stats.totalEarnings.toFixed(2)} USD</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Palette size={20} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Creator Action</p>
            <Link href="/dashboard/upload" className="inline-flex items-center gap-1.5 mt-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm">
               <UploadCloud size={14} /> Upload New Asset
            </Link>
          </div>
        </div>
      </div>

      {/* 🎨 আর্টিস্টের নিজস্ব আপলোড করা এসেট গ্যালারি ও CRUD কন্ট্রোল প্যানেল */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
         <MyAssetsPage />
      </div>

    </div>
  );
}