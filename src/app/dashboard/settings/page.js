"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import {
  Camera,
  Pencil,
  KeyRound,
  Loader2,
  ImagePlus,
  Eye,
  EyeOff,
  ShieldCheck,
  Palette,
  User,
  Calendar,
  ShoppingBag,
  CreditCard,
  Heart,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profileImage: "",
    role: "user",
    bio: "",
    isPremium: false,
    subscriptionTier: "free",
    createdAt: "",
  });
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [summary, setSummary] = useState({ artworks: 0, invested: 0 });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [modal, setModal] = useState(null); // "profile" | "password"

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, txRes] = await Promise.all([
          axios.get(`${API_URL}/auth/me`, { withCredentials: true }),
          axios.get(`${API_URL}/transactions/my-history`, { withCredentials: true }).catch(() => null),
        ]);

        if (userRes.data.success && userRes.data.user) {
          const u = userRes.data.user;
          setProfile({
            name: u.name || "",
            email: u.email || "",
            profileImage: u.profileImage || u.image || "",
            role: u.role || "user",
            bio: u.bio || "",
            isPremium: !!u.isPremium,
            subscriptionTier: u.subscriptionTier || "free",
            createdAt: u.createdAt || "",
          });
        }

        if (txRes?.data?.success) {
          const list = txRes.data.data || [];
          const artworks = list.filter((t) => /artwork/i.test(t.packageName || "")).length;
          const invested = list
            .filter((t) => t.status === "succeeded")
            .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
          setSummary({ artworks, invested });
        }
      } catch (error) {
        console.error("Error fetching settings info:", error);
        toast.error("Failed to load your account data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar image must be under 5MB!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const uploadToast = toast.loading("Uploading new avatar...");
    try {
      const res = await axios.post(`${API_URL}/content/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        const uploadedUrl = res.data.url || res.data.data?.url;
        setProfile({ ...profile, profileImage: uploadedUrl });
        toast.success("Profile photo updated! 📸", { id: uploadToast });
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image.", { id: uploadToast });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const res = await axios.put(
        `${API_URL}/settings/update-profile`,
        { name: profile.name, profileImage: profile.profileImage },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Profile updated successfully!");
        setModal(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match! ❌");
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await axios.put(
        `${API_URL}/settings/update-password`,
        { oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Password updated successfully!");
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setModal(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5a6b48]" />
      </div>
    );
  }

  const roleBadge =
    profile.role === "admin"
      ? { label: "Admin", cls: "bg-rose-50 text-rose-600 border-rose-200/70 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900", Icon: ShieldCheck }
      : profile.role === "artist"
      ? { label: "Creator", cls: "bg-purple-50 text-purple-600 border-purple-200/70 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900", Icon: Palette }
      : { label: "User", cls: "bg-blue-50 text-blue-600 border-blue-200/70 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900", Icon: User };

  const RoleIcon = roleBadge.Icon;
  const fallbackBio =
    profile.role === "artist"
      ? "Creating and publishing digital artworks on Artisano. Building a portfolio for the community."
      : profile.role === "admin"
      ? "Artisano administrator — keeping the marketplace safe and running smoothly."
      : "Free member of Artisano community. Collecting and exploring beautiful masterpieces.";

  return (
    <div className="space-y-6 text-slate-800 dark:text-zinc-100 pt-2">
      {/* Page header */}
      <DashboardHeader
        title="Account Settings"
        subtitle="Manage your personal profile, security options, and purchase history."
        action={
          <Link
            href="/dashboard"
            className="inline-flex bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:border-[#5a6b48] hover:text-[#5a6b48] dark:hover:border-emerald-400 dark:hover:text-emerald-300 text-slate-700 dark:text-zinc-200 text-xs font-black px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            Back to dashboard
          </Link>
        }
      />

      {/* Main profile card */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_320px] gap-8">
          {/* Left: avatar + actions */}
          <div className="flex lg:flex-col items-center lg:items-start gap-5">
            <div className="relative group w-36 h-36 rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-sm flex-shrink-0">
              <img
                src={profile.profileImage || "https://i.ibb.co/4pDNDk1/avatar.png"}
                alt={profile.name}
                onError={(e) => {
                  e.currentTarget.src = "https://i.ibb.co/4pDNDk1/avatar.png";
                }}
                className="w-full h-full object-cover"
              />
              <label
                htmlFor="avatar-file"
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer bg-black/30"
                title="Change photo"
              >
                <Camera size={22} className="text-white" />
              </label>
              <input type="file" id="avatar-file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <span className="absolute bottom-2 right-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-full p-2 shadow-md pointer-events-none">
                <Camera size={13} className="text-slate-600 dark:text-zinc-300" />
              </span>
            </div>

            <div className="flex flex-col gap-3 w-full lg:w-auto">
              <button
                onClick={() => setModal("profile")}
                className="flex items-center justify-center gap-2 bg-[#5a6b48] hover:bg-[#4c5b3d] text-white text-sm font-black px-5 py-3 rounded-xl transition-all shadow-md shadow-[#5a6b48]/25 w-full"
              >
                <Pencil size={15} /> Edit Profile
              </button>
              <button
                onClick={() => setModal("password")}
                className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-sm font-black px-5 py-3 rounded-xl transition-all w-full"
              >
                <KeyRound size={15} /> Change Password
              </button>
            </div>
          </div>

          {/* Middle: identity info */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {profile.name || "Unnamed Artist"}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-black px-2.5 py-1 rounded-full border ${roleBadge.cls}`}
              >
                <RoleIcon size={12} /> {roleBadge.label}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black px-2.5 py-1 rounded-full border bg-slate-50 text-slate-600 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700">
                {profile.isPremium ? "Plan: Premium" : "Plan: Free"}
              </span>
            </div>

            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 break-all">{profile.email}</p>

            <div className="mt-6">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                Bio / Note
              </p>
              <p className="text-sm text-slate-600 dark:text-zinc-300 mt-1.5 leading-relaxed max-w-xl">
                {profile.bio || fallbackBio}
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100 dark:border-zinc-800 flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-zinc-400">
                <Calendar size={14} className="text-[#7a8b5c]" />
                Account Status: <span className="text-[#5a6b48] dark:text-emerald-300 font-black">Active</span>
              </span>
              {profile.createdAt && (
                <span className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-zinc-400">
                  <ShieldCheck size={14} className="text-[#7a8b5c]" />
                  Member since {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              )}
            </div>
          </div>

          {/* Right: purchase summary */}
          <div className="bg-slate-50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-800 rounded-3xl p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-4">
              Purchase Summary
            </p>

            <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl px-4 py-3.5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                  <ShoppingBag size={16} />
                </span>
                <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">Bought Artworks</span>
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white">{summary.artworks}</span>
            </div>

            <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl px-4 py-3.5 shadow-sm mt-3">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                  <CreditCard size={16} />
                </span>
                <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">Total Investment</span>
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white">${summary.invested}</span>
            </div>

            <div className="flex gap-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl px-4 py-4 shadow-sm mt-3">
              <Heart size={16} className="text-rose-500 flex-shrink-0 mt-0.5" fill="currentColor" />
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-zinc-400">
                Thank you for supporting independent artists! Your premium digital certificates are saved securely in
                your profile dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile modal */}
      {modal === "profile" && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)}>
          <form
            onSubmit={handleProfileSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Edit Profile</h3>
              <button type="button" onClick={() => setModal(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex-shrink-0">
                <img
                  src={profile.profileImage || "https://i.ibb.co/4pDNDk1/avatar.png"}
                  alt="avatar"
                  onError={(e) => {
                    e.currentTarget.src = "https://i.ibb.co/4pDNDk1/avatar.png";
                  }}
                  className="w-full h-full object-cover"
                />
                <label htmlFor="avatar-file-modal" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer bg-black/30">
                  <ImagePlus size={16} className="text-white" />
                </label>
                <input type="file" id="avatar-file-modal" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Avatar Image URL</label>
                <input
                  type="text"
                  value={profile.profileImage}
                  onChange={(e) => setProfile({ ...profile, profileImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#5a6b48] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Display Name</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#5a6b48] transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Registered Email</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full bg-slate-100 dark:bg-zinc-800 border border-slate-200/60 dark:border-zinc-700 text-xs font-bold rounded-xl px-3 py-2.5 text-slate-400 cursor-not-allowed outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={updatingProfile}
              className="w-full bg-[#5a6b48] hover:bg-[#4c5b3d] text-white font-black text-xs py-3 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {updatingProfile ? <Loader2 size={14} className="animate-spin" /> : <Pencil size={14} />}
              {updatingProfile ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      )}

      {/* Change Password modal */}
      {modal === "password" && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)}>
          <form
            onSubmit={handlePasswordSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Change Password</h3>
              <button type="button" onClick={() => setModal(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X size={18} />
              </button>
            </div>

            {[
              { key: "oldPassword", label: "Current Password", show: showOldPassword, setShow: setShowOldPassword },
              { key: "newPassword", label: "New Password", show: showNewPassword, setShow: setShowNewPassword },
              { key: "confirmPassword", label: "Confirm New Password", show: showConfirmPassword, setShow: setShowConfirmPassword },
            ].map((field) => (
              <div key={field.key} className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{field.label}</label>
                <div className="relative">
                  <input
                    type={field.show ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={passwordData[field.key]}
                    onChange={(e) => setPasswordData({ ...passwordData, [field.key]: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold rounded-xl pl-3 pr-10 py-2.5 focus:outline-none focus:border-[#5a6b48] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => field.setShow(!field.show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    {field.show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={updatingPassword}
              className="w-full bg-[#5a6b48] hover:bg-[#4c5b3d] text-white font-black text-xs py-3 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {updatingPassword ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
              {updatingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
