"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { Edit2, Trash2, ShieldCheck, Crown, Layers, Link2, X, Image, Loader2, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";

export default function MyAssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 📝 এডিট মোডাল এবং ফর্ম স্টেটস
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  // ফর্মের ইনপুট ফিল্ড স্টেটস
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("tutorial");
  const [isPremiumOnly, setIsPremiumOnly] = useState(false);
  const [resourceLink, setResourceLink] = useState("");
  const [price, setPrice] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);

  // ==========================================
  // 📥 ১. শুধুমাত্র এই আর্টিস্টের নিজস্ব ডেটা ফেচ করা
  // ==========================================
  const fetchMyAssets = async () => {
    try {
      const res = await axios.get(`${API_URL}/content/artist-assets`, { withCredentials: true });
      if (res.data.success) {
        setAssets(res.data.data);
      }
    } catch (error) {
      console.error("Error loading artist assets:", error);
      toast.error("Failed to load your artwork gallery.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAssets();
  }, []);

  // ==========================================
  // 🗑️ ২. এসেট ডিলিট করার হ্যান্ডলার (Delete CRUD)
  // ==========================================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you absolutely sure you want to permanently delete this artwork? 🗑️")) return;
    
    setDeleteLoadingId(id);
    try {
      const res = await axios.delete(`${API_URL}/content/${id}`, { withCredentials: true });
      if (res.data.success) {
        toast.success("Artwork deleted successfully! 🗑️");
        // লাইভ স্টেট থেকে রিমুভ করে দেওয়া হলো যেন রিফ্রেশ ছাড়া ইউআই আপডেট হয়
        setAssets(assets.filter((asset) => asset._id !== id));
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete content.");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  // ==========================================
  // 📝 ৩. এডিট মোডাল ওপেন করার লজিক
  // ==========================================
  const openEditModal = (asset) => {
    setSelectedAsset(asset);
    setTitle(asset.title);
    setDescription(asset.description);
    setCategory(asset.category);
    setIsPremiumOnly(asset.isPremiumOnly);
    setResourceLink(asset.resourceLink || "");
    setPrice(asset.price !== undefined ? asset.price : "15.00");
    setFeaturedImage(null); // নতুন ইমেজ সিলেক্ট করার জন্য রিসেট করা হলো
    setIsEditModalOpen(true);
  };

  // ==========================================
  // 🚀 ৪. এসেট আপডেট/এডিট সাবমিট হ্যান্ডলার (Update CRUD)
  // ==========================================
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    // মাল্টিপার্ট ফর্ম ডেটা হ্যান্ডলিং (যেহেতু ছবি আপলোড হতে পারে)
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("isPremiumOnly", isPremiumOnly);
    formData.append("resourceLink", resourceLink);
    if (featuredImage) {
      formData.append("featuredImage", featuredImage);
    }

    try {
      const res = await axios.put(`${API_URL}/content/${selectedAsset._id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        toast.success("Artwork updated successfully! 🎉");
        setIsEditModalOpen(false);
        fetchMyAssets(); // লাইভ স্ক্রিন রিফ্রেশ করার জন্য রি-ফেচ
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update artwork.");
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Dashboard Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900">My Studio Workspace 🎨</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Manage, update, and monitor all your uploaded digital creative resources.</p>
          </div>
          <span className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl">
            Total Assets: {assets.length}
          </span>
        </div>

        {/* Dynamic Grid Layout */}
        {assets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
            <Layers size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-bold text-sm">You haven't uploaded any creative assets yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <div key={asset._id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="w-full h-40 rounded-xl overflow-hidden mb-3 bg-slate-50 relative">
                    <img src={asset.featuredImage} alt={asset.title} className="w-full h-full object-cover" />
                    {asset.isPremiumOnly && (
                      <span className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-sm text-amber-400 font-bold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-500/30">
                        <Crown size={10} /> PRO ONLY
                      </span>
                    )}
                  </div>
                  
                  <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                    {asset.category}
                  </span>
                  <h3 className="font-bold text-slate-800 text-base mt-2 line-clamp-1">{asset.title}</h3>
                  <p className="text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed">{asset.description}</p>
                </div>

                {/* 🛠️ CRUD Action Controls */}
                <div className="border-t border-slate-50 pt-3 mt-4 flex gap-2">
                  <button 
                    onClick={() => openEditModal(asset)}
                    className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs py-2.5 rounded-xl border border-slate-200/60 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Edit2 size={12} /> Edit Info
                  </button>
                  <button 
                    onClick={() => handleDelete(asset._id)}
                    disabled={deleteLoadingId === asset._id}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs px-3 py-2.5 rounded-xl border border-rose-200/40 transition-all flex items-center justify-center"
                  >
                    {deleteLoadingId === asset._id ? (
                      <Loader2 size={12} className="animate-spin text-rose-600" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ==========================================
          👑 🎭 Interactive Live Edit Popup Modal 
         ========================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/60">
              <h2 className="font-black text-slate-800 text-lg flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" /> Modify Masterpiece
              </h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 bg-white border border-slate-200 shadow-sm rounded-full transition-all">
                <X size={16} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleUpdateSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-800">
              
              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Asset Title</label>
                <input 
                  type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                  className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 border border-slate-200/80 px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-slate-900 transition-all"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea 
                  rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required
                  className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 border border-slate-200/80 px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-slate-900 transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Category & Premium Inline Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                  <select 
                    value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200/80 px-3 py-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-slate-900 transition-all"
                  >
                    <option value="tutorial">Tutorial</option>
                    <option value="tool">Tool</option>
                    <option value="resource">Resource</option>
                    <option value="article">Article</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Access Control</label>
                  <button
                    type="button"
                    onClick={() => setIsPremiumOnly(!isPremiumOnly)}
                    className={`w-full font-bold text-xs py-3.5 px-3 rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                      isPremiumOnly 
                        ? "bg-amber-50 border-amber-200 text-amber-700" 
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    {isPremiumOnly ? <><Crown size={14} /> VIP PRO ONLY</> : <><ShieldCheck size={14} /> FREE ACCESS</>}
                  </button>
                </div>
              </div>

              {/* Price Field */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Asset Price ($ USD)</label>
                <input 
                  type="number" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  required 
                  min="0" 
                  step="0.01"
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200/80 px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-slate-900 transition-all"
                />
              </div>

              {/* Source/Drive Link */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Source/Download Link</label>
                <div className="relative">
                  <Link2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="url" placeholder="https://drive.google.com/..." value={resourceLink} onChange={(e) => setResourceLink(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 border border-slate-200/80 pl-10 pr-4 py-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-slate-900 transition-all"
                  />
                </div>
              </div>

              {/* Thumb Replace Image Upload Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Replace Thumbnail Image (Optional)</label>
                <div className="relative border border-dashed border-slate-200 hover:border-slate-400 bg-slate-50 rounded-xl p-3 text-center transition-all cursor-pointer">
                  <input 
                    type="file" accept="image/*" onChange={(e) => setFeaturedImage(e.target.files[0])}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  <div className="flex items-center justify-center gap-2 text-slate-500">
                    <Image size={16} className="text-slate-400" />
                    <span className="text-xs font-bold truncate">
                      {featuredImage ? featuredImage.name : "Choose new artwork image"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Action Buttons Footer */}
              <div className="border-t border-slate-50 pt-4 mt-6 flex gap-3">
                <button 
                  type="button" onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3.5 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={editLoading}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  {editLoading ? <><Loader2 size={14} className="animate-spin" /> Saving Changes...</> : "Apply Changes"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}