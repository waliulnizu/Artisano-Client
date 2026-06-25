"use client";

export default function CommentList({ comments }) {
  // 🧠 Developer's Thought: যদি এই আর্টওয়ার্কে কোনো কমেন্ট না থাকে, তবে ইউজারকে একটি সুন্দর নোটিফিকেশন দেওয়া উচিত।
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-medium">
        No comments yet. Be the first to start the conversation! 💬
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        // টাইমস্ট্যাম্পকে মানুষের পড়ার উপযোগী ফরম্যাটে কনভার্ট করা
        const formattedDate = new Date(comment.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        });

        return (
          <div 
            key={comment._id} 
            className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200/80 transition-all shadow-sm"
          >
            {/* 👤 ইউজারের প্রোফাইল পিকচার */}
            <img
              src={comment.user?.profileImage || "https://i.ibb.co/4pDNDk1/avatar.png"}
              alt={comment.user?.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-100"
            />
            
            {/* 📝 কমেন্ট কন্টেন্ট */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-800 capitalize">
                  {comment.user?.name || "Artisan Guest"}
                </h4>
                <span className="text-[10px] text-slate-400 font-medium">
                  {formattedDate}
                </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {comment.text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}