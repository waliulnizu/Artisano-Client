"use client";

import SavedCollection from "./SavedCollection";
import { User, Heart, ShoppingBag } from "lucide-react";

export default function UserDashboard({ user }) {
  return (
    <div className="space-y-10">
      
      {/* 📊 কুইক স্ট্যাটাস বা অ্যানালিটিক্স কার্ডস */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><User size={20} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Tier</p>
            <p className="text-sm font-black text-slate-800 uppercase mt-0.5">
              {user?.isPremium ? <span className="text-amber-500">👑 Premium VIP</span> : "Standard Free User"}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><Heart size={20} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Vault</p>
            <p className="text-lg font-black text-slate-800 mt-0.5">Dynamic Collection</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><ShoppingBag size={20} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Purchased Assets</p>
            <p className="text-lg font-black text-slate-800 mt-0.5">00 Masterpieces</p>
          </div>
        </div>
      </div>

      {/* 🎨 আপনার তৈরি করা উইশলিস্ট গ্যালারি সেকশন */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <SavedCollection />
      </div>

    </div>
  );
}