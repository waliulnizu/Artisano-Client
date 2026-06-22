"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";  
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// 🚀 আলাদা ফাইল থেকে আসা ArtCard কম্পোনেন্ট ইম্পোর্ট
import ArtCard from "@/components/ArtCard";

export default function PublicHomepage() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 👑 📌 মাস্টার ফিক্স ১: credentials: "include" বদলে এক্সিওসের সঠিক নিয়ম withCredentials: true করা হলো
        // এর ফলে ব্রাউজারের সেশন কুকি ব্যাকএন্ডে পৌঁছাবে এবং কারেন্ট ইউজারকে পারফেক্টলি ডিটেক্ট করতে পারবে।
        const userRes = await axios.get(`${API_URL}/auth/me`, { withCredentials: true }).catch(() => null);
        if (userRes && userRes.data.success) {
          setCurrentUser(userRes.data.user);
        }

        // সব ফ্রি ও প্রিমিয়াম কন্টেন্ট ওপেনলি ফেচ করা
        const response = await axios.get(`${API_URL}/content/public-data`, { withCredentials: true });
        if (response.data.success) {
          setContent(response.data.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("Visitor is unauthenticated.");
          setCurrentUser(null);
        } else {
          console.error("Error loading public gallery:", error);
          toast.error("Failed to load global art gallery.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleResourceAccess = async (item) => {
    if (!item) return;

    // 👑 📌 মাস্টার ফিক্স ২: এখানেও ওনারশিপ লজিকটিকে হাইব্রিড (আইডি ও নাম) ব্যাকআপ দেওয়া হলো
    const authorId = item.author && typeof item.author === 'object' ? (item.author._id || item.author.id) : item.author;
    const currentUserId = currentUser ? (currentUser._id || currentUser.id) : null;

    const isIdMatched = authorId && currentUserId && (String(authorId).trim().toLowerCase() === String(currentUserId).trim().toLowerCase());
    const isNameMatched = item.author?.name && currentUser?.name && (item.author.name.trim().toLowerCase() === currentUser.name.trim().toLowerCase());
    
    const isOwnAsset = isIdMatched || isNameMatched;

    // ক动态 গেটওয়ে অ্যাক্সেস চেক
    if (!item.isPremiumOnly || isOwnAsset) {
      if (item.resourceLink) {
        window.open(item.resourceLink, "_blank", "noopener,noreferrer");
      } else {
        toast.error("No download link attached for this free resource.");
      }
      return;
    }

    setActionLoadingId(item._id);
    try {
      const checkRes = await axios.get(`${API_URL}/content/premium-data`, { withCredentials: true });
      if (checkRes.status === 200) {
        if (item.resourceLink) {
          toast.success("VIP Access Granted! Opening resource...");
          window.open(item.resourceLink, "_blank", "noopener,noreferrer");
        } else {
          toast.error("No download link attached to this premium asset.");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast("👑 This exclusive resource is for Premium Pro members only!", {
          duration: 5500,
          position: "top-center",
          style: {
            background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A',
            fontWeight: 'bold', fontSize: '13px', marginTop: '40px', padding: '12px 24px', borderRadius: '12px'
          }
        });
        setTimeout(() => {
          router.push("/premium");
        }, 1500);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Hero Banner */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            Explore Creative Art Assets 🎨
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
            Discover high-quality tutorials, premium brushes, and raw resources built by professional digital artists.
          </p>
        </div>

        {/* Dynamic Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content && content.length > 0 ? (
            content.map((asset) => (
              <ArtCard 
                key={asset._id}
                item={asset}
                currentUser={currentUser} 
                actionLoadingId={actionLoadingId}
                onResourceAccess={handleResourceAccess}
              />
            ))
          ) : (
            <p className="text-center text-slate-500 col-span-full py-10">No art assets found.</p>
          )}
        </div>

      </div>
    </div>
  );
}