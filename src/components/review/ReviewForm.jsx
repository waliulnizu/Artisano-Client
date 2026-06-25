"use client";

import { useState } from "react";
import { Star, Send, Loader2 } from "lucide-react";

export default function ReviewForm({ onReviewSubmit, submitLoading }) {
  const [rating, setRating] = useState(5); // ডিফল্ট ৫-স্টার সেট করা
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim() || rating === 0) return;

    onReviewSubmit({ rating, comment });
    setComment(""); // সাবমিট শেষে ফর্ম খালি করা
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50/60 border border-slate-100 rounded-3xl p-6 mb-8">
      <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Leave a Certified Review</h4>
      
      {/* ⭐ ৫-স্টার সিলেকশন উইজেট লজিক */}
      <div className="flex items-center gap-1.5 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-transform active:scale-90 outline-none"
          >
            <Star
              size={22}
              className="transition-colors duration-150"
              fill={star <= (hoverRating || rating) ? "#f59e0b" : "none"} // গোল্ডেন কালার ট্র্যাকিং
              stroke={star <= (hoverRating || rating) ? "#f59e0b" : "#cbd5e1"}
            />
          </button>
        ))}
        <span className="text-xs font-bold text-slate-500 ml-2">({rating} out of 5)</span>
      </div>

      {/* 📝 ফিডব্যাক টেক্সট এরিয়া */}
      <div className="relative">
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience about this digital asset's quality..."
          maxLength={1000}
          disabled={submitLoading}
          className="w-full bg-white border border-slate-200 focus:border-slate-900 text-sm text-slate-800 rounded-2xl p-4 pr-14 outline-none transition-all placeholder:text-slate-400 resize-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={submitLoading || !comment.trim()}
          className="absolute right-3 bottom-4 p-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-xl transition-all active:scale-95 shadow-sm"
        >
          {submitLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>
    </form>
  );
}