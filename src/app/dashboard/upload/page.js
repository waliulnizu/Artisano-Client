"use client";

import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ArtistUploadPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "tutorial", 
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
        router.push("/browse"); 
      }
    } catch (error) {
      console.error("Upload error:", error);
      
      // 🚀 [THE MASTER SYNC]: ব্যাকএন্ডের পাঠানো কাস্টম মেসেজ রিড করার ডাইনামিক মেকানিজম
      const serverMessage = error.response?.data?.message;
      const serverError = error.response?.data?.error;

      if (serverMessage) {
        // ব্যাকএন্ডের কাস্টম লিমিট বা রোল এরর মেসেজ সরাসরি টোস্টে যাবে
        toast.error(serverMessage);
      } else if (serverError) {
        toast.error(`Server Error: ${serverError}`);
      } else {
        toast.error("Failed to publish artwork. Internal Server Error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🎨 [LUXURY PREMIUM BACKDROP]: স্টুডিও থিমের সাথে ম্যাচিং লাক্সারি ব্যাকগ্রাউন্ড
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/80 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">

        {/* Back Link */}
        <Link href="/browse" className="inline-flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-slate-900 mb-6 transition-all tracking-tight">
          <ArrowLeft size={14} className="stroke-[2.5]" /> Back to Gallery
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles size={20} className="text-amber-500" /> Create & Publish Asset
          </h1>
          <p className="text-slate-400 text-xs mt-0.5 font-medium">Upload your brushes, tools, or tutorials directly to Artisano feed.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Asset Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Ultimate Watercolor Brush Pack"
              className="w-full px-4 py-3 bg-slate-50/80 text-slate-900 border border-slate-200/60 rounded-xl text-xs font-bold focus:outline-none focus:border-slate-400 focus:bg-white transition-all placeholder-slate-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Description</label>
            <textarea
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your creative asset or tutorial details..."
              className="w-full px-4 py-3 bg-slate-50/80 text-slate-900 border border-slate-200/60 rounded-xl text-xs font-bold focus:outline-none focus:border-slate-400 focus:bg-white transition-all resize-none leading-relaxed placeholder-slate-400"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Category Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange} 
                className="w-full px-3 py-3 bg-slate-50/80 text-slate-900 border border-slate-200/60 rounded-xl text-xs font-bold focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
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
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Resource/Drive Link</label>
              <input
                type="url"
                name="resourceLink"
                value={formData.resourceLink}
                onChange={handleInputChange}
                placeholder="https://drive.google.com/..."
                className="w-full px-4 py-3 bg-slate-50/80 text-slate-900 border border-slate-200/60 rounded-xl text-xs font-bold focus:outline-none focus:border-slate-400 focus:bg-white transition-all placeholder-slate-400"
              />
            </div>
          </div>

          {/* Price Input Section */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Asset Value / Price ($ USD)</label>
            <input
              type="number"
              name="price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g., 15.00"
              className="w-full px-4 py-3 bg-slate-50/80 text-slate-900 border border-slate-200/60 rounded-xl text-xs font-black focus:outline-none focus:border-slate-400 focus:bg-white transition-all placeholder-slate-400"
            />
          </div>

          {/* File Upload Component */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Featured Cover Image</label>
            <div className="border border-dashed border-slate-200 hover:border-slate-400 rounded-xl p-6 transition-all relative bg-slate-50/50 text-center cursor-pointer group">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center justify-center space-y-2">
                <UploadCloud size={28} className="text-slate-400 transition-colors group-hover:text-slate-600" />
                <p className="text-xs font-bold text-slate-700 max-w-[90%] truncate">{file ? file.name : "Click to upload artwork cover"}</p>
                <p className="text-[10px] font-bold text-slate-400">PNG, JPG or WEBP up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Premium Membership Toggle Box */}
          <div className="bg-amber-50/60 border border-amber-200/60 p-4 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-black text-amber-900 flex items-center gap-1.5">👑 Premium Exclusive Asset</p>
              <p className="text-[11px] text-amber-700/80 font-bold mt-0.5">Toggle this if you want only VIP Paid members to download this file.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isPremiumOnly" checked={formData.isPremiumOnly} onChange={handleInputChange} className="sr-only peer" />
              <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3.5 rounded-xl text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Publishing Masterpiece..." : <>Publish to Artisano Feed <CheckCircle size={14} className="stroke-[2.5]" /></>}
          </button>

        </form>
      </div>
    </div>
  );
}