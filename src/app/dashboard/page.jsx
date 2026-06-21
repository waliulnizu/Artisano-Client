"use client";

import { useEffect, useState } from "react";
import { API_URL } from "../../lib/constants";
import EditProfileForm from "@/components/profile/EditProfileForm";

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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your account and update your personal information.</p>
        </div>

        {/* Info & Edit Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row gap-10">
          {/* User Info */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
              <p className="text-xl font-semibold text-gray-800">{user?.name}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
              <p className="text-xl font-semibold text-gray-800">{user?.email}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Role</label>
              <p className="text-lg font-medium text-blue-600 uppercase bg-blue-50 inline-block px-3 py-1 rounded-full">{user?.role}</p>
            </div>
          </div>

          {/* Edit Form Section */}
          <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-8 md:pt-0 md:pl-10">
            <EditProfileForm 
              user={user} 
              onUpdate={(newName) => setUser({ ...user, name: newName })} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}