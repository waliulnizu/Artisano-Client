"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";  
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

// 🚀 আলাদা ফাইল থেকে আসা কম্পোনেন্ট ইম্পোর্ট
import ArtCard from "@/components/ArtCard";
import HomeSkeleton from "@/components/HomeSkeleton";

function PaymentVerificationHandler({ currentUser, setCurrentUser }) {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const paymentSuccess = searchParams.get("payment_success");
  const router = useRouter();
  
  // 🛡️ API কল মাল্টিপল বার যেন ট্রিগার না হয় তার জন্য রিফ লক
  const verificationFired = useRef(false);

  useEffect(() => {
    if (paymentSuccess && sessionId && currentUser && !verificationFired.current) {
      verificationFired.current = true; // Lock immediately to prevent duplicate runs
      
      // 🚀 ব্যাকঅ্যান্ডের এপিআই কল করে ডাটাবেস আপডেট করা
      axios.post(`${API_URL}/stripe/verify-payment`, {
        sessionId,
        userId: currentUser._id || currentUser.id,
        tierName: "VIP Premium Pro"
      })
      .then(() => {
        toast.success("👑 VIP Membership Activated! Enjoy Premium Assets.");
        
        // 🚀 ইনস্ট্যান্ট স্টেট আপডেট (কোনো হার্ড রিফ্রেশ ছাড়াই)
        setCurrentUser(prev => ({
          ...prev,
          isPremium: true,
          subscriptionTier: "pro"
        }));
        
        // URL থেকে ক্যোয়ারি প্যারামিটার সরাতে replace ব্যবহার করা হলো
        router.replace("/");
      })
      .catch(() => toast.error("Verification pending."));
    }
  }, [paymentSuccess, sessionId, currentUser, setCurrentUser, router]);

  return null;
}



export default function PublicHomepage() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 🚀 Parallel API fetching to fix slow load time
        const userPromise = axios.get(`${API_URL}/auth/me`, { withCredentials: true }).catch(() => null);
        const dataPromise = axios.get(`${API_URL}/content/public-data`, { withCredentials: true });

        const [userRes, response] = await Promise.all([userPromise, dataPromise]);

        if (userRes && userRes.data.success) {
          setCurrentUser(userRes.data.user);
        }

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

    const authorId = item.author && typeof item.author === 'object' ? (item.author._id || item.author.id) : item.author;
    const currentUserId = currentUser ? (currentUser._id || currentUser.id) : null;

    const isIdMatched = authorId && currentUserId && (String(authorId).trim().toLowerCase() === String(currentUserId).trim().toLowerCase());
    const isNameMatched = item.author?.name && currentUser?.name && (item.author.name.trim().toLowerCase() === currentUser.name.trim().toLowerCase());
    
    const isOwnAsset = isIdMatched || isNameMatched;

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
      if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        toast(error.response.status === 401 ? "🔒 Please login to access Premium resources!" : "👑 This exclusive resource is for Premium Pro members only!", {
          duration: 5500,
          position: "top-center",
          style: {
            background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A',
            fontWeight: 'bold', fontSize: '13px', marginTop: '40px', padding: '12px 24px', borderRadius: '12px'
          }
        });
        setTimeout(() => {
          if (error.response.status === 401) {
            router.push("/login");
          } else {
            router.push("/premium");
          }
        }, 1500);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    // 👑 [THE MAIN BG FIX]: মেইন রুট কন্টেইনারে dark:bg-zinc-950 এবং কালার ট্রানজিশন ম্যাপ করা হলো
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <Suspense fallback={null}>
          <PaymentVerificationHandler currentUser={currentUser} setCurrentUser={setCurrentUser} />
        </Suspense>

        {/* Hero Banner */}
        <div className="text-center mb-12">
          {/* 🌙 টেক্সটে dark:text-white দেওয়া হলো */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Explore Creative Art Assets 🎨
          </h1>
          {/* 🌙 সাবটাইটেলে dark:text-zinc-400 দেওয়া হলো */}
          <p className="text-slate-500 dark:text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
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
            // 🌙 নো ডাটা টেক্সটে ডার্ক কালার সিঙ্ক
            <p className="text-center text-slate-500 dark:text-zinc-400 col-span-full py-10">No art assets found.</p>
          )}
        </div>

      </div>
    </div>
  );
}