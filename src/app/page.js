"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../lib/constants"; // আপনার পাথ অনুযায়ী ঠিক আছে
import { Sparkles, ExternalLink, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";


export default function PublicHomepage() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null); // নির্দিষ্ট বাটনের লোডিং ট্র্যাকার
  const router = useRouter();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // ১. ইউজারের কারেন্ট প্রোফাইল ও মেম্বারশিপ স্ট্যাটাস চেক করা
        const userRes = await axios.get(`${API_URL}/auth/me`, { credentials: "include" }).catch(() => null);
        if (userRes && userRes.data.success) {
          setCurrentUser(userRes.data.user);
        }

        // 🔗 লিঙ্ক ১: সব ফ্রি ও প্রিমিয়াম কন্টেন্ট ওপেনলি ফেচ করা (পাবলিক ডেটা)
        const response = await axios.get(`${API_URL}/content/public-data`, { withCredentials: true });
        if (response.data.success) {
          setContent(response.data.data);
        }
      } catch (error) {
        console.error("Error loading public gallery:", error);
        toast.error("Failed to load global art gallery.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // 🛠️ 🧠 দ্বিতীয় লিঙ্কের মাধ্যমে সিকিউরড গেটওয়ে হ্যান্ডলার
  const handleResourceAccess = async (item) => {
    // কন্টেন্টটি যদি ফ্রি হয়, তবে সরাসরি লিংক ওপেন হবে, মেম্বারশিপ চেকের দরকার নেই
    if (!item.isPremiumOnly) {
      if (item.resourceLink) {
        window.open(item.resourceLink, "_blank", "noopener,noreferrer");
      } else {
        toast.error("No download link attached for this free resource.");
      }
      return;
    }

    // কন্টেন্ট যদি প্রিমিয়াম হয়, তবে ব্যাকএ্যান্ডের সিকিউর রাউটে রিকোয়েস্ট পাঠিয়ে চেক করা হবে
    setActionLoadingId(item._id); // বাটনটিকে লোডিং স্টেট দেওয়া হলো
    try {
      // 🔗 লিঙ্ক ২: মেম্বারশিপ ভ্যালিডেশন চেক (checkPremium মিডলওয়্যার এখানে গার্ড দেবে)
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
      // 🛡️ ইউজার ফ্রি প্ল্যানে থাকলে ব্যাকএ্যান্ড থেকে 403 আসবে, যা এখানে প্রফেশনালি হ্যান্ডেল হলো
      if (error.response && error.response.status === 403) {
        // 👑 📌 ফিক্স: মেসেজটি ইংলিশে করা হলো এবং 'bottom-center' দিয়ে স্ক্রিনের নিচের দিকে পজিশন সেট করা হলো
        toast("👑 This exclusive resource is for Premium Pro members only! Let's unlock it from the membership room.", {
          duration: 5500,
          position: "top-center",
          style: {
            background: '#FFFBEB',
            color: '#B45309',
            border: '1px solid #FDE68A',
            fontWeight: 'bold',
            fontSize: '13px',
            marginTop: '40px',
            padding: '12px 24px',    // প্যাডিং বাড়িয়ে টোস্টটিকে আরও সুন্দর ও চওড়া করা হলো
            borderRadius: '12px',    // রাউন্ডেড কর্নার থিম
            boxShadow: '0 10px 15px -3px rgba(180, 83, 9, 0.1), 0 4px 6px -2px rgba(180, 83, 9, 0.05)' // প্রিমিয়াম শ্যাডো ইফেক্ট
          }
        });

        setTimeout(() => {
          router.push("/premium"); // সোজা পে-ওয়ালে চালান
        }, 1500); // মেসেজটি পড়ার জন্য ইউজারকে ১.৫ সেকেন্ড সময় দেওয়া হলো
      }
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
          {content.map((item) => {
            // ভিজ্যুয়াল লকিং রেন্ডারিং মেকানিজম (যদি ইউজার প্রো মেম্বার বা অ্যাডমিন না হয় এবং কন্টেন্ট প্রিমিয়াম হয়)
            const isAssetLocked = item.isPremiumOnly && currentUser?.role !== "admin" && !currentUser?.isPremium;

            return (
              <div key={item._id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative">
                <div>
                  <div className="w-full h-44 rounded-xl overflow-hidden mb-4 bg-slate-100 relative">
                    <img src={item.featuredImage} alt={item.title} className="w-full h-full object-cover" />
                    {isAssetLocked && (
                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center text-white">
                        <div className="bg-slate-900/80 p-2.5 rounded-full shadow-lg">
                          <Lock size={20} className="text-amber-400" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold uppercase text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      {item.category}
                    </span>
                    {item.isPremiumOnly ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200 px-2 rounded-md">
                        👑 PRO
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 rounded-md">
                        FREE
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1">{item.title}</h3>
                  <p className="text-slate-500 text-xs mb-4 line-clamp-2">{item.description}</p>
                </div>

                {/* Footer Component */}
                <div className="border-t border-slate-50 pt-3 flex justify-between items-center">
                  <span className="text-[11px] font-medium text-slate-400">By {item.author?.name || "Admin"}</span>

                  <button
                    onClick={() => handleResourceAccess(item)}
                    disabled={actionLoadingId === item._id}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${isAssetLocked
                        ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                      } ${actionLoadingId === item._id ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {actionLoadingId === item._id ? (
                      "Verifying..."
                    ) : isAssetLocked ? (
                      <>Unlock Resource 🔒</>
                    ) : (
                      <>Access Resource <ExternalLink size={12} /></>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}