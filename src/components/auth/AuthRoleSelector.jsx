"use client"; // 🧠 ব্রাউজারে ইউজারের ক্লিক ইভেন্ট এবং স্টেট ট্র্যাকিংয়ের জন্য ক্লায়েন্ট কম্পোনেন্ট আবশ্যক

import { useState } from "react";
import { User, Palette } from "lucide-react"; // মডার্ন মিনিমাল আইকন লাইব্রেরি
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

export default function AuthRoleSelector() {
  // 🧠 ডেভেলপার থট প্রসেস: শুরুতে ইউজারকে ডিফল্ট 'user' (বায়ার) রোলে রাখছি।
  // ইউজার ট্যাবে ক্লিক করলে এই স্টেটটি বদলে 'artist' হয়ে যাবে।
  const [selectedRole, setSelectedRole] = useState("user");

  return (
    <div className="w-full space-y-5">
      
      {/* 🧭 রোলেক্স ট্যাব সিলেক্টর কন্টেইনার */}
      <div>
        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2.5 text-center">
          Select Your Access Priority
        </label>
        
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200/40">
          
          {/* বায়ার/ইউজার ট্যাব বাটন */}
          <button
            type="button"
            onClick={() => setSelectedRole("user")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedRole === "user"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <User size={14} />
            <span>Digital Buyer</span>
          </button>

          {/* আর্টিস্ট/ক্রিয়েটর ট্যাব বাটন */}
          <button
            type="button"
            onClick={() => setSelectedRole("artist")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedRole === "artist"
                ? "bg-white text-purple-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Palette size={14} />
            <span>Asset Creator</span>
          </button>

        </div>
      </div>

      {/* 👑 গুগল সাইন-ইন বাটন: যেখানে লাইভ সিলেক্টেড রোলটি প্রপস আকারে পাস হচ্ছে */}
      <GoogleAuthButton currentSelectedRole={selectedRole} />

      {/* ℹ️ ইউজার অ্যাসুরেন্স টেক্সট (UX মাইক্রো-কপি) */}
      <p className="text-[11px] text-slate-400 font-medium text-center leading-relaxed px-4">
        {selectedRole === "artist" 
          ? "Securing creator studio node. You will be redirected to asset publishing blueprints."
          : "Configuring buyer vault node. You will be redirected to asset collection catalogs."
        }
      </p>

    </div>
  );
}