"use client";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../lib/constants";
import { toast } from "react-hot-toast";

export default function EditProfileForm({ user, onUpdate }) {
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.patch(
        `${API_URL}/auth/update-profile`,
        { name },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Profile updated!");
        onUpdate(name);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-600 mb-2">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900 font-medium"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl transition font-semibold disabled:bg-gray-400"
      >
        {loading ? "Updating..." : "Save Changes"}
      </button>
    </form>
  );
}