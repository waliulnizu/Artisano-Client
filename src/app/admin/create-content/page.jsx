"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../lib/constants";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Upload, Loader2, ArrowLeft, Image as ImageIcon } from "lucide-react";

export default function AdminCreateContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "tutorial",
    price: "15.00",
    isPremiumOnly: true,
    resourceLink: "",
    featuredImage: null,
  });

  // 📌 সিকিউরিটি গার্ড: লগইন ছাড়া এবং অ্যাডমিন ছাড়া এই পেজ অ্যাক্সেস লক করা
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          withCredentials: true,
        });
        
        // যদি ইউজার লগইন না থাকে বা রোল অ্যাডমিন না হয়, তবে মেইন ড্যাশবোর্ডে পাঠিয়ে দাও
        if (!response.data.success || response.data.user.role !== "admin") {
          toast.error("Unauthorized! Admin access only.");
          router.push("/dashboard");
        } else {
          setPageLoading(false);
        }
      } catch (error) {
        toast.error("Please login as an Admin first.");
        router.push("/login");
      }
    };
    checkAdminAccess();
  }, [router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, featuredImage: file }));
      // মেমোরি লিক ফিক্স করার জন্য নিরাপদ প্রিভিউ রিডার
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("isPremiumOnly", formData.isPremiumOnly);
      data.append("resourceLink", formData.resourceLink);
      if (formData.featuredImage) {
        data.append("featuredImage", formData.featuredImage);
      }

      const response = await axios.post(`${API_URL}/content/create`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("Artwork published to VIP Dashboard!");
        router.push("/premium");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create content");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <Loader2 className="animate-spin text-amber-500" size={32} />
        <p className="ml-2">Verifying Admin Credentials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 text-slate-100">
      <div className="max-w-2xl mx-auto bg-slate-800 rounded-3xl shadow-2xl border border-slate-700/50 p-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-700 rounded-full transition-all">
            <ArrowLeft size={20} className="text-slate-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Create Premium Content</h1>
            <p className="text-slate-400 text-sm">Upload new arts, tutorials or resources for premium members</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Artwork/Content Title</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g., Oil Painting Essentials" className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm font-medium" />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
            <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} placeholder="Write details about this exclusive content..." className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm resize-none font-medium" />
          </div>

          {/* Category & Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm font-medium">
                <option value="tutorial">Tutorial</option>
                <option value="tool">Tool / Asset</option>
                <option value="resource">Resource</option>
                <option value="article">Article</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Download/External Link</label>
              <input type="text" name="resourceLink" value={formData.resourceLink} onChange={handleChange} placeholder="https://..." className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm font-medium" />
            </div>
          </div>

          {/* Price Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Asset Value / Price ($ USD)</label>
            <input type="number" name="price" required min="0" step="0.01" value={formData.price} onChange={handleChange} placeholder="e.g., 25.00" className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm font-medium" />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Featured Artwork Image</label>
            <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 hover:border-amber-500 transition-all bg-slate-900/50 flex flex-col items-center justify-center text-center relative cursor-pointer group">
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              
              {imagePreview ? (
                <div className="w-full h-48 relative rounded-xl overflow-hidden">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <>
                  <div className="bg-slate-800 p-4 rounded-full shadow-sm text-slate-400 mb-3 group-hover:scale-110 transition-all">
                    <ImageIcon size={28} className="text-slate-400" />
                  </div>
                  <p className="text-sm font-bold text-slate-200">Click to upload art image</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG or WEBP up to 5MB</p>
                </>
              )}
            </div>
          </div>

          {/* Premium Checkbox */}
          <div className="flex items-center gap-2 bg-amber-950/20 p-4 rounded-xl border border-amber-900/30">
            <input type="checkbox" name="isPremiumOnly" id="isPremiumOnly" checked={formData.isPremiumOnly} onChange={handleChange} className="w-4 h-4 text-amber-600 border-slate-700 bg-slate-900 rounded focus:ring-amber-500" />
            <label htmlFor="isPremiumOnly" className="text-sm font-medium text-slate-300 select-none cursor-pointer">
              Make this content <span className="font-bold text-amber-400">Premium Pro Only</span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed">
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Publishing Artwork...</>
            ) : (
              <><Upload size={18} /> Publish Content</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}