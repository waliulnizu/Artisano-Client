"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { User, ShieldAlert, KeyRound, Loader2, ImagePlus, Eye, EyeOff, ShieldCheck, Palette, Crown } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: "", email: "", profileImage: "", role: "user" });
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  
  // 👁️ আই টগল স্টেটস
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // 📥 ১. কারেন্ট ইউজারের ডাটা লোড করা
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
        if (res.data.success && res.data.user) {
          setProfile({
            name: res.data.user.name || "",
            email: res.data.user.email || "",
            profileImage: res.data.user.profileImage || "",
            role: res.data.user.role || "user"
          });
        }
      } catch (error) {
        console.error("Error fetching settings info:", error);
        toast.error("Failed to sync personal data nodes.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // 📸 ২. লোকাল ফাইল আপলোড হ্যান্ডলার (সরাসরি আপনার কাস্টম কন্টেন্ট আপলোড মেকানিজমে যাবে)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ফাইলের সাইজ চেক (Max 5MB for Avatar)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar image must be under 5MB!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // আপনার ব্যাকএন্ডের আপলোড স্কিমার সাথে ম্যাচ করা

    const uploadToast = toast.loading("Uploading new avatar stream...");
    try {
      // 🚀 আপনার প্রজেক্টের এক্সিস্টিং ইমেজ আপলোড বা কন্টেন্ট আপলোড রাউটে ফাইলটি যাবে
      const res = await axios.post(`${API_URL}/content/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });

      if (res.data.success) {
        // ব্যাকএন্ড যদি ডাইনামিক URL রিটার্ন করে (যেমন: res.data.url)
        const uploadedUrl = res.data.url || res.data.data?.url;
        setProfile({ ...profile, profileImage: uploadedUrl });
        toast.success("Avatar stream synced successfully! 📸", { id: uploadToast });
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to route image stream. Using fallback URL parameter.", { id: uploadToast });
    }
  };

  // 🔄 ৩. প্রোফাইল ডাটা আপডেট সাবমিট
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const res = await axios.put(`${API_URL}/settings/update-profile`, {
        name: profile.name,
        profileImage: profile.profileImage
      }, { withCredentials: true });

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to update custom avatar configuration.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  // 🔒 ৪. পাসওয়ার্ড ওভারহুল হ্যান্ডলার (কনফর্ম পাসওয়ার্ড ভ্যালিডেশন সহ)
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // 🧠 সিকিউরিটি চেক: নতুন পাসওয়ার্ড এবং কনফর্ম পাসওয়ার্ড মিলছে কি না
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Cryptographic passwords do not match! ❌");
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await axios.put(`${API_URL}/settings/update-password`, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      }, { withCredentials: true });

      if (res.data.success) {
        toast.success(res.data.message);
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" }); // ইনপুট রিসেট
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication credentials failed.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-4 px-4 sm:px-6 space-y-6 text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <User size={20} className="text-purple-600" /> Account Settings & Parameters
          </h1>
          <p className="text-slate-400 text-xs mt-0.5 font-medium">Configure personal profile nodes, system image variables, and encryption vectors.</p>
        </div>
        
        {/* 🛡️ ACCESS CLEARANCE BADGE COMPONENT */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Access Clearance:</span>
          <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border shadow-sm ${
            profile.role === "admin" ? "bg-rose-50 text-rose-700 border-rose-200/60" :
            profile.role === "artist" ? "bg-purple-50 text-purple-700 border-purple-200/60" :
            "bg-slate-50 text-slate-600 border-slate-200"
          }`}>
            {profile.role === "admin" ? <ShieldCheck size={14} /> : profile.role === "artist" ? <Palette size={14} /> : <User size={14} />}
            {profile.role === "admin" ? "System Root Admin" : profile.role === "artist" ? "Creative Artist" : "Standard Member"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Profile Card Layout */}
        <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-slate-900 border-b border-slate-50 pb-2 flex items-center gap-1.5">
            <ImagePlus size={16} className="text-slate-500" /> Profile Customization
          </h2>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 py-2">
            {/* লাইভ গোল এভাটার প্রিভিউ + ফাইল আপলোড ট্রিগার */}
            <div className="relative group w-16 h-16 rounded-full overflow-hidden bg-slate-100 border object-cover flex-shrink-0 cursor-pointer">
              <img src={profile.profileImage || "https://i.ibb.co/4pDNDk1/avatar.png"} alt="avatar" className="w-full h-full object-cover group-hover:opacity-40 transition-all" />
              <label htmlFor="avatar-file" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer bg-black/10">
                <ImagePlus size={16} className="text-slate-900" />
              </label>
              <input type="file" id="avatar-file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
            
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Avatar Image Source URL</label>
              <input
                type="text"
                value={profile.profileImage}
                onChange={(e) => setProfile({ ...profile, profileImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-slate-900 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Display Pseudonym Name</label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-slate-900 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-300 uppercase tracking-wider">System Registered Email (Disabled)</label>
            <input
              type="email"
              disabled
              value={profile.email}
              className="w-full bg-slate-100 border border-slate-200/60 text-xs font-bold rounded-xl px-3 py-2.5 text-slate-400 cursor-not-allowed outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={updatingProfile}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-2.5 rounded-xl uppercase transition-all tracking-wider flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            {updatingProfile ? "Saving Nodes..." : "Update Profile Data"}
          </button>
        </form>

        {/* Security Password Card Layout */}
        <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-slate-900 border-b border-slate-50 pb-2 flex items-center gap-1.5">
            <KeyRound size={16} className="text-slate-500" /> Security Credentials
          </h2>

          {/* Current Password Input + Eye Toggle */}
          <div className="space-y-1 relative">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Current Password</label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl pl-3 pr-10 py-2.5 focus:outline-none focus:border-slate-900 transition-all"
              />
              <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900">
                {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password Input + Eye Toggle */}
          <div className="space-y-1 relative">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">New Cryptographic Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl pl-3 pr-10 py-2.5 focus:outline-none focus:border-slate-900 transition-all"
              />
              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900">
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input + Eye Toggle */}
          <div className="space-y-1 relative">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl pl-3 pr-10 py-2.5 focus:outline-none focus:border-slate-900 transition-all"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900">
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/50 p-4 rounded-xl flex gap-3 text-amber-800">
            <ShieldAlert size={18} className="flex-shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium leading-relaxed">
              Updating authentication secrets will clear structural tokens. Ensure your node configuration is memorable before firing the handler.
            </p>
          </div>

          <button
            type="submit"
            disabled={updatingPassword}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xs py-2.5 rounded-xl uppercase transition-all tracking-wider flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            {updatingPassword ? "Modifying Matrix..." : "Overhaul Password Token"}
          </button>
        </form>

      </div>
    </div>
  );
}