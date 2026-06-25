"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

export default function CommentBox({ onCommentSubmit, submitLoading }) {
  const [text, setText] = useState("");

  // 🧠 Developer's Thought: ফর্ম সাবমিট হলে ব্রাউজার যেন রিলোড না নেয় (preventDefault)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return; // ফাঁকা কমেন্ট সাবমিট ব্লক করা

    onCommentSubmit(text);
    setText(""); // কমেন্ট সফলভাবে ট্রিপে পাঠানোর পর ইনপুট বক্স খালি করা
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Share your thoughts
        </label>
        <div className="relative flex items-center">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a respectful comment..."
            disabled={submitLoading}
            className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 text-sm text-slate-800 rounded-2xl pl-5 pr-14 py-4 outline-none transition-all placeholder:text-slate-400 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={submitLoading || !text.trim()}
            className="absolute right-2 p-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-xl transition-all active:scale-95"
          >
            {submitLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}