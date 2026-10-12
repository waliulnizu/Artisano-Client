"use client";

import { useState } from "react";
import { Star, Edit2, Trash2, X, Check, Loader2 } from "lucide-react";

export default function ReviewList({ reviews, averageRating, currentUserId, onReviewUpdate, onReviewDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [actionLoading, setActionLoading] = useState(false);

  const startEdit = (review) => {
    setEditingId(review._id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditComment("");
  };

  const handleUpdate = async (reviewId) => {
    if (!editComment.trim()) return;
    setActionLoading(true);
    await onReviewUpdate({ reviewId, rating: editRating, comment: editComment });
    setEditingId(null);
    setActionLoading(false);
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-medium">
        No reviews yet for this masterpiece. Be the first to share your rating! ⭐
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      
      <div className="lg:col-span-1 bg-slate-50/50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-fit">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-1">Average Score</h3>
        <p className="text-5xl font-black text-slate-900 tracking-tight">{averageRating}</p>
        <div className="flex items-center gap-0.5 my-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              fill={star <= Math.round(averageRating) ? "#f59e0b" : "none"}
              stroke={star <= Math.round(averageRating) ? "#f59e0b" : "#cbd5e1"}
            />
          ))}
        </div>
        <p className="text-[10px] text-slate-400 font-bold">Based on {reviews.length} certified orders</p>
      </div>

      
      <div className="lg:col-span-3 space-y-4">
        {reviews.map((review) => {
          const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          });

          const isOwnReview = currentUserId && review.user?._id === currentUserId;
          const isEditing = editingId === review._id;

          return (
            <div key={review._id} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={review.user?.profileImage || "https://i.ibb.co/4pDNDk1/avatar.png"}
                    alt={review.user?.name}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <div>
                    <h4 className="text-xs font-black text-slate-800 capitalize">{review.user?.name || "Verified Buyer"}</h4>
                    <span className="text-[9px] text-slate-400 font-medium">{formattedDate}</span>
                  </div>
                </div>
                
                
                {isOwnReview && !isEditing && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => startEdit(review)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-all"
                      title="Edit review"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button 
                      onClick={() => {
                        if(confirm("Are you sure you want to delete this review?")) {
                          onReviewDelete(review._id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-all"
                      title="Delete review"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>

              
              {isEditing ? (
                <div className="space-y-3 pt-2">
                  
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setEditRating(star)}>
                        <Star size={14} fill={star <= editRating ? "#f59e0b" : "none"} stroke={star <= editRating ? "#f59e0b" : "#cbd5e1"} />
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 text-sm p-2 rounded-xl outline-none focus:border-slate-900 text-slate-800"
                    />
                    <button 
                      onClick={() => handleUpdate(review._id)}
                      disabled={actionLoading}
                      className="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all"
                    >
                      {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    </button>
                    <button 
                      onClick={cancelEdit}
                      className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={10}
                        fill={star <= review.rating ? "#f59e0b" : "none"}
                        stroke={star <= review.rating ? "#f59e0b" : "#cbd5e1"}
                      />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{review.comment}</p>
                </>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}