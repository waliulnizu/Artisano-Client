"use client";

import { useEffect, useState } from "react";
import { API_URL } from "../../lib/constants";
import EditProfileForm from "@/components/profile/EditProfileForm";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading Dashboard...</div>;

 // DashboardPage.jsx
return (
  <div className="min-h-screen bg-gray-50 py-10 px-4">
    <div className="max-w-5xl mx-auto"> {/* max-w-4xl থেকে 5xl করা হলো যাতে জায়গা বেশি পাওয়া যায় */}
      
      {/* Header */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your account settings.</p>
      </div>

      {/* মেইন গ্রিড লেআউট */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* কলাম ১: ইউজার প্রোফাইল ইনফো */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Profile Info</label>
          <div>
             <p className="text-sm text-gray-500">Full Name</p>
             <p className="text-lg font-semibold text-gray-800">{user?.name}</p>
          </div>
          <div>
             <p className="text-sm text-gray-500">Email</p>
             <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
          </div>
          <p className="text-lg font-medium text-blue-600 uppercase bg-blue-50 inline-block px-3 py-1 rounded-full">{user?.role}</p>
        </div>

        {/* কলাম ২ ও ৩: ফর্মস */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
             <EditProfileForm user={user} onUpdate={(newName) => setUser({ ...user, name: newName })} />
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
             <ChangePasswordForm />
          </div>
        </div>

      </div>
    </div>
  </div>
);
}