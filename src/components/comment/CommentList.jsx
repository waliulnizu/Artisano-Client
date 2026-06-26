"use client";

import { useState } from "react";
import { Edit3, Trash2, Check, X } from "lucide-react";

export default function CommentList({ comments, currentUserId, onCommentUpdate, onCommentDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const startEditing = (commentId, currentText) => {
    setEditingId(commentId);
    setEditText(currentText);
  };

  const handleUpdateSubmit = (commentId) => {
    if (!editText.trim()) return;
    onCommentUpdate(commentId, editText);
    setEditingId(null);
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200/60 rounded-2xl text-slate-400 text-xs font-bold">
        No discussions found. Be the first to initiate! 💬
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const formattedDate = new Date(comment.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        });

        // 👑 🔒 বুলেটপ্রুফ আইডি সিঙ্কিং গেটওয়ে
        const commentAuthorId = comment.user?._id || comment.user || comment.userId?._id || comment.userId;
        const isOwner = commentAuthorId && currentUserId && String(commentAuthorId) === String(currentUserId);
        const isEditing = editingId === comment._id;

        return (
          <div 
            key={comment._id} 
            className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 hover:border-slate-200/60 transition-all shadow-sm relative group"
          >
            {/* 👤 গোল আকৃতির প্রিমিয়াম বর্ডার যুক্ত মেম্বার ইমেজ */}
            <img
              src={comment.user?.profileImage || comment.userId?.profileImage || "https://i.ibb.co/4pDNDk1/avatar.png"}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-slate-50 shadow-inner"
            />
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black text-slate-800 tracking-tight capitalize">
                    {comment.user?.name || comment.userId?.name || "Artisano Artist"}
                  </h4>
                  {isOwner && (
                    <span className="bg-slate-900 text-white font-black text-[8px] px-2 py-0.5 rounded-md tracking-wider uppercase">
                      Author
                    </span>
                  )}
                </div>
                
                {/* 👑 রাইট সাইড প্রফেশনাল কন্ট্রোল প্যানেল অ্যাকশন বাটন */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 font-bold">
                    {formattedDate}
                  </span>

                  {isOwner && !isEditing && (
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 p-0.5 rounded-xl shadow-inner transition-opacity">
                      <button 
                        onClick={() => startEditing(comment._id, comment.text)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                        title="Edit masterpiece thought"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this comment?")) {
                            onCommentDelete(comment._id);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg transition-all"
                        title="Wipe comment"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* কন্ডিশনাল ইনলাইন টেক্সট এডিটর ইন্টারফেস */}
              {isEditing ? (
                <div className="mt-2 space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows="2"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/40"
                  />
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleUpdateSubmit(comment._id)}
                      className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-all shadow-sm"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line pt-0.5">
                  {comment.text}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}