"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { toast } from "react-hot-toast";
import CommentBox from "./CommentBox";
import CommentList from "./CommentList";
import { MessageSquare } from "lucide-react";

export default function CommentSection({ artworkId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // 🆔 ১. সেশন আইডি হাইড্রেশন নোড (গ্লোবাল মি সিঙ্ক)
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
        if (res.data.success && res.data.user) {
          const userId = res.data.user._id || res.data.user.id;
          setCurrentUserId(userId);
        }
      } catch (error) {
        console.error("Session sync failed in comment block:", error);
      }
    };
    checkCurrentUser();
  }, []);

  // 📥 ২. ডাটাবেস থেকে লাইভ কমেন্ট ফেচিং
  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/comment/artwork/${artworkId}`);
      if (res.data.success) {
        setComments(res.data.data);
      }
    } catch (error) {
      console.error("Fetch Comments Error:", error);
    } finally {
      setLoading(false);
    }
  }, [artworkId]);

  useEffect(() => {
    if (artworkId) fetchComments();
  }, [artworkId, fetchComments]);

  // 📝 ৩. নতুন কমেন্ট লাইভ ইনসার্ট (Optimistic Push)
  const handleCommentSubmit = async (text) => {
    setSubmitLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/comment/create`,
        { artworkId, text },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Comment published!");
        fetchComments(); // পপুলেটেড ডাটা নিশ্চিত করতে রি-কাল
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Please login to comment.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // ✏️ ৪. কমেন্ট লাইভ আপডেট ইঞ্জিন
  const handleCommentUpdate = async (commentId, newText) => {
    try {
      const res = await axios.put(
        `${API_URL}/comment/update`,
        { commentId, text: newText },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Comment modified successfully.");
        // রিয়েল-টাইম ইউআই স্টেট রিফ্লেকশন
        setComments((prev) =>
          prev.map((c) => (c._id === commentId ? { ...c, text: newText } : c))
        );
      }
    } catch (error) {
      toast.error("Failed to edit comment.");
    }
  };

  // 🗑️ ৫. কমেন্ট ইনস্ট্যান্ট লাইভ ডিলিট ইঞ্জিন (No Refresh Required)
  const handleCommentDelete = async (commentId) => {
    try {
      const res = await axios.delete(`${API_URL}/comment/delete`, {
        data: { commentId },
        withCredentials: true
      });
      if (res.data.success) {
        toast.success("Comment removed.");
        // 🚀 ফিক্স: অবজেক্ট বা নরমাল আইডি নির্বিশেষে ইনস্ট্যান্ট স্টেট ক্লিয়ারেন্স
        setComments((prev) => prev.filter((c) => String(c._id || c.id) !== String(commentId)));
      }
    } catch (error) {
      toast.error("Failed to drop comment.");
    }
  };

  return (
    <div className="mt-12 pt-10 border-t border-slate-100/80">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare size={18} className="text-slate-900 stroke-[2.5]" />
        <h3 className="text-md font-black text-slate-900 tracking-tight uppercase bg-slate-100 px-3 py-1 rounded-full text-[11px]">
          Discussion Panel ({comments.length})
        </h3>
      </div>

      <CommentBox onCommentSubmit={handleCommentSubmit} submitLoading={submitLoading} />

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <CommentList 
          comments={comments} 
          currentUserId={currentUserId}
          onCommentUpdate={handleCommentUpdate}
          // 🚀 লাইভ ডিলিট হ্যান্ডলার বাইন্ডিং
          onCommentDelete={handleCommentDelete}
        />
      )}
    </div>
  );
}