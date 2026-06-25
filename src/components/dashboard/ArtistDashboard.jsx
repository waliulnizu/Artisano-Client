"use client";

import { Plus, LayoutGrid, Heart } from "lucide-react";
import Link from "next/link";

// 🚀 মডুলার উইশলিস্ট কম্পোনেন্ট (ইউজার ড্যাশবোর্ডের ডিজাইন থিমে লাইভ হবে)
import SavedCollection from "./SavedCollection";

export default function ArtistDashboard({ user }) {
  return (
    <div className="space-y-6">
      
      {/* 📊 ১. কুইক মেট্রিক্স কার্ডস (আপনার ২ নম্বর স্ক্রিনশটের ডিজাইন থিমে লাইট ও প্রিমিয়াম লুক) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-500 rounded-2xl">
            <LayoutGrid size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">$0.00 <span className="text-xs text-slate-400 font-medium">USD</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
            <span className="text-xl font-black">$</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Earnings</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">$0.00 <span className="text-xs text-slate-400 font-medium">USD</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl">
            <Plus size={22} />
          </div>
          <div className="w-full">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Creator Action</p>
            {/* 👑 [FIX RETAINED]: ক্রিয়েট কন্টেন্ট রাউটটি আপনার কারেন্ট স্ট্রাকচার /dashboard/upload এ সিঙ্ক রাখা হলো */}
            <Link href="/dashboard/upload" className="mt-1 inline-flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95">
              <Plus size={14} /> Upload New Asset
            </Link>
          </div>
        </div>
      </div>

      {/* 👑 ২. সরাসরি উইশলিস্ট গ্যালারি সেকশন (ডুপ্লিকেট স্টুডিও ওয়ার্কস্পেস রিমুভড) */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <SavedCollection />
      </div>

    </div>
  );
}