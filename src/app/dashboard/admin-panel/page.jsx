"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { ShieldCheck, Users, Crown, Mail, Loader2, ArrowLeft, TrendingUp } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 📊 Recharts ভিত্তিক নতুন তৈরি করা সাব-কম্পোনেন্টটি ইম্পোর্ট করা হলো
import AdminSalesChart from "@/components/admin/AdminSalesChart";

export default function AdminPanelPage() {
  const [users, setUsers] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]); // 📊 চার্টের ডেটা স্টেট
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const router = useRouter();

  // 📥 ১. সেশন ভেরিফিকেশন, ইউজার টেবিল ও অ্যানালিটিক্স চার্ট ডাটা ফেচ
  useEffect(() => {
    const fetchAdminDashboardData = async () => {
      try {
        // ক) ইউজার লিস্ট নিয়ে আসা
        const usersRes = await axios.get(`${API_URL}/auth/admin/users`, { withCredentials: true });
        if (usersRes.data.success) {
          setUsers(usersRes.data.data);
        }

        // খ) 📊 ব্যাকএন্ডের নতুন এন্ডপয়েন্ট থেকে চার্টের অ্যানালিটিক্স ডেটা নিয়ে আসা
        try {
          const analyticsRes = await axios.get(`${API_URL}/stripe/admin/sales-analytics`, { withCredentials: true });
          if (analyticsRes.data.success) {
            setAnalyticsData(analyticsRes.data.data);
          }
        } catch (chartErr) {
          console.error("Chart Data API Fetch Warning:", chartErr);
          // চার্ট এপিআই কোনো কারণে ফেইল করলেও যেন মেইন ইউজার টেবিল ক্র্যাশ না করে
        }

      } catch (error) {
        console.error("Admin Fetch Error:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error("Unauthorized Access Denied! 🛑");
          router.push("/dashboard");
        } else {
          toast.error("Session expired. Please login again.");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboardData();
  }, [router]);

  // 🔄 ২. রোল অথবা প্রিমিয়াম স্ট্যাটাস লাইভ আপডেট
  const handleUserUpdate = async (userId, updatedFields) => {
    setActionLoadingId(userId);
    try {
      const res = await axios.put(`${API_URL}/auth/admin/users/${userId}`, updatedFields, {
        withCredentials: true
      });

      if (res.data.success) {
        toast.success("User controls updated successfully! 🛠️");
        setUsers(users.map((u) => (u._id === userId ? { ...u, ...updatedFields } : u)));
      }
    } catch (error) {
      console.error("Admin Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update user privilege.");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Verifying Admin Clearance...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Navigation Banner */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-2xl shadow-sm shadow-purple-500/10">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Artisano Central Command 📊</h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Global governance panel for modifying core memberships, clearance roles, and community status.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-emerald-600 text-white font-black text-[10px] px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1 uppercase tracking-wider animate-pulse">
              <TrendingUp size={12} /> Live Metrics
            </span>
            <Link href="/dashboard" className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 border border-slate-200/40">
              <ArrowLeft size={14} /> Back
            </Link>
          </div>
        </div>

        {/* 📊 [NEW INJECTION]: রেভিনিউ ও সেলস অ্যানালিটিক্স গ্রাফ চার্ট */}
        <AdminSalesChart data={analyticsData} />

        {/* User Metric Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl"><Users size={20} /></div>
            <div>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Total Members</p>
              <p className="text-xl font-black text-slate-900">{users.length}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="bg-amber-50 text-amber-600 p-3 rounded-xl"><Crown size={20} /></div>
            <div>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">VIP Pro Active</p>
              <p className="text-xl font-black text-slate-900">{users.filter(u => u.isPremium).length}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-xl"><ShieldCheck size={20} /></div>
            <div>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Root Admins</p>
              <p className="text-xl font-black text-slate-900">{users.filter(u => u.role === 'admin').length}</p>
            </div>
          </div>
        </div>

        {/* Data Directory Table */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-50 bg-white">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Registered User Registry</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">User Profile</th>
                  <th className="py-4 px-6">Access Clearance (Role)</th>
                  <th className="py-4 px-6 text-center">VIP Premium Status</th>
                  <th className="py-4 px-6 text-right">System ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm font-semibold">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 border object-cover flex-shrink-0">
                        <img src={user.profileImage || "https://i.ibb.co/4pDNDk1/avatar.png"} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="truncate max-w-[180px]">
                        <p className="text-slate-900 font-bold truncate capitalize">{user.name}</p>
                        <p className="text-slate-400 text-xs font-medium truncate flex items-center gap-1 mt-0.5">
                          <Mail size={12} /> {user.email}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <select
                        value={user.role}
                        disabled={actionLoadingId === user._id}
                        onChange={(e) => handleUserUpdate(user._id, { role: e.target.value })}
                        className={`bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-slate-900 transition-all ${
                          user.role === 'admin' ? 'border-rose-200 text-rose-700 bg-rose-50/30' : user.role === 'artist' ? 'border-purple-200 text-purple-700 bg-purple-50/30' : ''
                        }`}
                      >
                        <option value="user">👤 Standard User</option>
                        <option value="artist">🎨 Creative Artist</option>
                        <option value="admin">👑 System Admin</option>
                      </select>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center">
                        {actionLoadingId === user._id ? (
                          <Loader2 size={20} className="animate-spin text-slate-400" />
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleUserUpdate(user._id, { isPremium: !user.isPremium })}
                            className="transition-all rounded-full focus:outline-none"
                          >
                            {user.isPremium ? (
                              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-amber-700 text-xs font-black shadow-sm">
                                <Crown size={12} className="fill-amber-500" /> ACTIVE PRO
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-400 text-xs font-bold">
                                INACTIVE FREE
                              </div>
                            )}
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right font-mono text-[11px] text-slate-400 tracking-tight">
                      {user._id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}