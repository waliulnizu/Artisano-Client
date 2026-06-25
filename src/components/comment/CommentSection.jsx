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

  // 📥 ব্যাকএন্ড থেকে কমেন্ট লোড করার ফাংশন
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

  // 📝 নতুন কমেন্ট সাবমিট হ্যান্ডলার (পোস্টম্যান টেস্টের হুবহু ফ্রন্টএন্ড রূপ)
  const handleCommentSubmit = async (text) => {
    setSubmitLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/comment/create`,
        { artworkId, text },
        { withCredentials: true } // সেশন কুকি ভেরিফিকেশনের জন্য এটি বাধ্যতামূলক
      );

      if (res.data.success) {
        toast.success("Comment posted successfully!");
        // 🚀 অপ্টিমিস্টিক আপডেট: নতুন কমেন্টটি তালিকার সবার ওপরে ইনস্ট্যান্ট জুড়ে দেওয়া
        setComments((prevComments) => [res.data.data, ...prevComments]);
      }
    } catch (error) {
      console.error("Post Comment Error:", error);
      const errMsg = error.response?.data?.message || "Please login to post a comment.";
      toast.error(errMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="mt-12 pt-12 border-t border-slate-100">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare size={18} className="text-slate-800" />
        <h3 className="text-lg font-black text-slate-900 tracking-tight">
          Discussion Panel ({comments.length})
        </h3>
      </div>

      {/* 📝 কমেন্ট ইনপুট বক্স */}
      <CommentBox onCommentSubmit={handleCommentSubmit} submitLoading={submitLoading} />

      {/* 💬 কমেন্ট লিস্ট */}
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <CommentList comments={comments} />
      )}
    </div>
  );
}