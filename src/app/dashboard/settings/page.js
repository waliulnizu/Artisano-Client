"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/constants";
import EditProfileForm from "@/components/profile/EditProfileForm";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import { Loader2, Settings, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client"; // 🚀 Better-Auth ক্লায়েন্ট ইম্পোর্ট

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [customAuthLoading, setCustomAuthLoading] = useState(true);

  // 👑 Better-Auth রিয়েল-টাইম সেশন ট্র্যাকিং হুক মাউন্ট
  const { data: session, isPending: isBetterAuthPending } = authClient.useSession();

  // 📥 ব্যাকঅ্যান্ড থেকে কাস্টম লগইন থাকা ইউজারের প্রোফাইল ডাটা নিয়ে আসা
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (err) {
        console.error("Settings profile error:", err);
      } finally {
        setCustomAuthLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // =========================================================================
  // 👑 FIX: হাইব্রিড সেশন মার্জিং ইঞ্জিন (Google + Traditional Mail)
  // =========================================================================
  // 🧠 Developer Thought Process: ড্যাশবোর্ডের মতো এখানেও 'activeUser' লজিক ব্যবহার করা হলো। 
  // যদি Better-Auth সেশন থাকে তবে সেটিকে প্রাধান্য দেবে, অন্যথায় কাস্টম ইউজার স্টেট রিড করবে। 
  // এর ফলে সেটিংস পেজটি গুগল ও মেইল উভয় ইউজারের কারেক্ট ডাটা ও রোল (Buyer/Artist) চিনে নেবে।
  const activeUser = session?.user || user;
  const globalLoading = isBetterAuthPending && customAuthLoading;

  if (globalLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        <Loader2 className="animate-spin text-slate-900 mr-2" size={24} /> Loading Profile Settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Header */}
        <div className="flex flex-col gap-2">
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-all">
            <ArrowLeft size={14} /> Back to Dashboard Workspace
          </Link>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3 mt-2">
            <div className="p-3 bg-slate-100 text-slate-800 rounded-2xl"><Settings size={22} /></div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Global Account Settings ⚙️</h1>
              <p className="text-slate-500 text-xs mt-0.5">Update your identity card, customize avatar properties, and enforce node keys.</p>
            </div>
          </div>
        </div>

        {/* 🏢 মেইন গ্রিড লেআউট */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* কলাম ১: মেম্বার ডিরেক্টরি কার্ড */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 lg:h-fit">
            <div className="border-b border-slate-50 pb-3">
              <h3 className="font-black text-slate-900 tracking-tight text-sm flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-purple-600" /> Identity Metadata
              </h3>
            </div>

            <div className="space-y-4 text-slate-800">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Holder Name</p>
                <p className="text-sm font-bold text-slate-800 capitalize mt-0.5">{activeUser?.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Email Field</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{activeUser?.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Access Clearance</p>
                {/* 👑 FIX: ডাইনামিক রোল গেটওয়ে যা ইউজারের আসল রোল (artist/admin/user) অনুযায়ী ব্যাজ দেখাবে */}
                <span className="inline-block mt-1 bg-purple-50 border border-purple-100 text-purple-600 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full capitalize">
                  {activeUser?.role ? `${activeUser.role} Account` : "User Account"}
                </span>
              </div>
            </div>
          </div>

          {/* কলাম ২ ও ③: মডুলার এডিট ফর্মসমূহ */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
              {/* 👑 FIX: এডিট প্রোফাইল ফর্মের ভেতর 'activeUser' ডাটা পাস করা হয়েছে */}
              <EditProfileForm 
                user={activeUser} 
                onUpdate={(newName) => setUser({ ...activeUser, name: newName })} 
              />
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
              <ChangePasswordForm />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}