"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../lib/constants";
import { toast } from "react-hot-toast";
import { Camera, Loader2 } from "lucide-react";

export default function EditProfileForm({ user }) {
  // ১. স্টেট ম্যানেজমেন্ট
  const [name, setName] = useState(user?.name || "Nizu");
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profileImage || "");
  const [loading, setLoading] = useState(false);

// 📌 ম্যাজিক ট্রিক: যখনই parent থেকে user ডাটা আসবে বা আপডেট হবে, এটি ফর্মে সেট করে দেবে
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      // যদি ইউজার নতুন কোনো ছবি সিলেক্ট না করে থাকেন, তবেই ডাটাবেসের ছবি দেখাবে
      if (!profileImage) {
        setPreviewUrl(user.profileImage || "");
      }
    }
  }, [user, profileImage]);

  // ২. ইমেজ ফাইল সিলেক্ট এবং লোকাল প্রিভিউ হ্যান্ডলার
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // ইমেজ লাইভ প্রিভিউ জেনারেট করা
    }
  };

  // ৩. ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ফাইল ও টেক্সট একসাথে পাঠানোর জন্য FormData অবজেক্ট
      const formData = new FormData();
      if (name) formData.append("name", name);
      if (profileImage) formData.append("profileImage", profileImage);

      const response = await axios.patch(
        `${API_URL}/auth/update-profile`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // ব্রাউজারকে ফাইল রিকোয়েস্টের সংকেত দেওয়া
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error("Profile Update Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Edit Profile</h3>

      <form onSubmit={handleSubmit}>
        {/* 📌 নতুন যুক্ত হওয়া অংশ: প্রোফাইল পিকচার প্রিভিউ এবং আপলোড UI */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-50 group shadow-inner">
            <img
              src={previewUrl || "https://i.ibb.co/4pDNDk1/avatar.png"}
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />
            {/* ছবির ওপর হভার করলে এই ক্যামেরা আইকনটি আসবে */}
            <label 
              htmlFor="avatar-upload" 
              className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer"
            >
              <Camera className="text-white" size={22} />
            </label>
          </div>
          
          {/* আসল ফাইল ইনপুট যা হাইড (hidden) করা আছে লুক সুন্দর রাখার জন্য */}
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <span className="text-xs text-gray-400 mt-2 font-medium">Click image to change</span>
        </div>

        {/* Full Name ইনপুট */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 text-gray-900 font-medium transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        {/* সাবমিট বাটন */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white py-3 rounded-xl hover:bg-black transition font-semibold flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Saving Changes...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}