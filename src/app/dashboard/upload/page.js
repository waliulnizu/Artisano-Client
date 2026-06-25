"use client";

import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ArtistUploadPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "tutorial", // 🎯 গ্লোবাল সিঙ্কের জন্য ডিফল্ট ভ্যালু ছোট হাতের অক্ষরে সেট করা হলো
    price: "",
    isPremiumOnly: false,
    resourceLink: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return toast.error("Please upload an artwork featured image!");
    }

    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("isPremiumOnly", formData.isPremiumOnly);
    data.append("resourceLink", formData.resourceLink);
    data.append("featuredImage", file);

    try {
      const res = await axios.post(`${API_URL}/content/create`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Artwork published successfully! 🎉");
        router.push("/browse"); // 🚀 সাকসেসফুল আপলোড শেষে সরাসরি আমাদের লাইভ গ্যালারিতে রিডাইরেক্ট
      }
    } catch (error) {
      console.error("Upload error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`Server Error: ${error.response.data.error}`);
      } else if (error.response && error.response.status === 403) {
        toast.error("Access Denied! Only Artists and Admins can upload assets.");
      } else {
        toast.error("Failed to publish artwork. Internal Server Error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-slate-200/60 shadow-md">

        {/* Back Link */}
        <Link href="/browse" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-6 transition-all">
          <ArrowLeft size={14} /> Back to Gallery
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create & Publish Asset 🎨</h1>
          <p className="text-slate-600 text-sm mt-1 font-medium">Upload your brushes, tools, or tutorials directly to Artisano feed.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Asset Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Ultimate Watercolor Brush Pack"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description</label>
            <textarea
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your creative asset or tutorial details..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* 👑 [FIXED]: onChange হ্যান্ডলার কারেক্ট করা হলো এবং গ্যালারির সাথে ভ্যালু সিঙ্ক করা হলো */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange} 
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm font-medium"
              >
                <option value="tutorial">Tutorial</option>
                <option value="tool">Tool / Asset</option>
                <option value="resource">Resource</option>
                <option value="article">Article</option>
                <option value="painting">Painting</option>
                <option value="digital">Digital Art</option>
                <option value="sculpture">Sculpture</option>
              </select>
            </div> 

            {/* External Resource Link */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Resource/Drive Link</label>
              <input
                type="url"
                name="resourceLink"
                value={formData.resourceLink}
                onChange={handleInputChange}
                placeholder="https://drive.google.com/..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white"
              />
            </div>
          </div>

          {/* Price Input Section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Asset Value / Price ($ USD)</label>
            <input
              type="number"
              name="price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g., 15.00"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white"
            />
          </div>

          {/* File Upload Component */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Featured Cover Image</label>
            <div className="border-2 border-dashed border-slate-300 hover:border-purple-500 rounded-2xl p-6 transition-all relative bg-slate-50 text-center">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center justify-center space-y-2">
                <UploadCloud size={32} className="text-slate-500" />
                <p className="text-sm font-bold text-slate-800">{file ? file.name : "Click to upload artwork cover"}</p>
                <p className="text-xs font-semibold text-slate-500">PNG, JPG or WEBP up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Premium Membership Toggle Box */}
          <div className="bg-amber-50 border border-amber-300/80 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-amber-950 flex items-center gap-1.5">👑 Premium Exclusive Asset</p>
              <p className="text-xs text-amber-800 font-bold mt-0.5">Toggle this if you want only VIP Paid members to download this file.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isPremiumOnly" checked={formData.isPremiumOnly} onChange={handleInputChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading to Cloudinary..." : <>Publish to Artisano Feed <CheckCircle size={16} /></>}
          </button>

        </form>
      </div>
    </div>
  );
}