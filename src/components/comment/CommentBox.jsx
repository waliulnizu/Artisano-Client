"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

export default function CommentBox({ onCommentSubmit, submitLoading, currentUser }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim() || submitLoading) return;
    onCommentSubmit(text);
    setText(""); 
  };

  // 👑 [NEW INTERCEPTOR]: কিবোর্ডের Enter বাটন প্রেস করলে সাবমিট হ্যান্ডলার ট্রিগার হবে
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // লাইনের ডিফল্ট ব্রেক এড়ানো
      handleSubmit();
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1.5">
          {currentUser?.isPremium ? (
            <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">👑 VIP Access: You can now join the discussion</span>
          ) : (
            "Join the artisan discussion"
          )}
        </label>
        
        {/* 🎨 [UI RE-DESIGN]: কালার থিম ফুললি সচল এবং লাক্সারি হোয়াইট লুকে কনভার্ট করা হলো */}
        <div className="relative flex items-center shadow-sm rounded-2xl overflow-hidden border border-slate-200/80 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100/50 transition-all duration-300 bg-white">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown} // 🚀 কিবোর্ড অ্যাকশন লিংক করা হলো
            placeholder={currentUser?.isPremium ? "Share your feedback as a VIP member..." : "Share an appreciation or construct feedback..."}
            disabled={submitLoading}
            className="w-full bg-white text-xs sm:text-sm font-medium text-slate-800 rounded-2xl pl-5 pr-14 py-4 outline-none placeholder:text-slate-400 disabled:opacity-50"
          />
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitLoading || !text.trim()}
            className="absolute right-2 p-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-50 text-white disabled:text-slate-300 rounded-xl transition-all active:scale-95 flex items-center justify-center"
          >
            {submitLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} className="stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}