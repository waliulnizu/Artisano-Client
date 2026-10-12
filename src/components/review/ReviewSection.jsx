"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "axios";
import { API_URL } from "@/lib/constants";
import { toast } from "react-hot-toast";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { Award } from "lucide-react";

export default function ReviewSection({ artworkId }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const res = await axiosInstance.get(`${API_URL}/auth/me`, { withCredentials: true });
        if (res.data.success) {
          setCurrentUserId(res.data.user._id);
        }
      } catch (error) {
        console.error("User identity tracking error in reviews:", error);
      }
    };
    checkCurrentUser();
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}/review/artwork/${artworkId}`);
      if (res.data.success) {
        setReviews(res.data.data);
        setAverageRating(res.data.averageRating);
      }
    } catch (error) {
      console.error("Fetch Reviews Error:", error);
    } finally {
      setLoading(false);
    }
  }, [artworkId]);

  useEffect(() => {
    if (artworkId) fetchReviews();
  }, [artworkId, fetchReviews]);

  const handleReviewSubmit = async ({ rating, comment }) => {
    setSubmitLoading(true);
    try {
      const res = await axiosInstance.post(
        `${API_URL}/review/submit`,
        { artworkId, rating, comment },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Review published successfully!");
        fetchReviews();
      }
    } catch (error) {
      console.error("Post Review Error:", error);
      const errMsg = error.response?.data?.message || "Please login to write a review.";
      toast.error(errMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReviewUpdate = async ({ reviewId, rating, comment }) => {
    try {
      const res = await axiosInstance.put(
        `${API_URL}/review/update`,
        { reviewId, rating, comment },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        fetchReviews();
      }
    } catch (error) {
      console.error("Update Review Frontend Error:", error);
      toast.error(error.response?.data?.message || "Failed to edit review.");
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      const res = await axiosInstance.delete(`${API_URL}/review/delete`, {
        data: { reviewId },
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchReviews();
      }
    } catch (error) {
      console.error("Delete Review Frontend Error:", error);
      toast.error(error.response?.data?.message || "Failed to remove review.");
    }
  };

  return (
    <div className="mt-10 pt-10 border-t border-slate-100">
      <div className="flex items-center gap-2 mb-6">
        <Award size={18} className="text-slate-800" />
        <h3 className="text-lg font-black text-slate-900 tracking-tight">
          Collector Reviews ({reviews.length})
        </h3>
      </div>

      <ReviewForm onReviewSubmit={handleReviewSubmit} submitLoading={submitLoading} />
      
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <ReviewList 
          reviews={reviews} 
          averageRating={averageRating} 
          currentUserId={currentUserId}
          onReviewUpdate={handleReviewUpdate}
          onReviewDelete={handleReviewDelete}
        />
      )}
    </div>
  );
}