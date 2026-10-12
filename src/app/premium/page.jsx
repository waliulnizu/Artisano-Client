"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { Crown, CheckCircle2, ShieldCheck, Sparkles, Zap, ArrowLeft, ArrowRight, History, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";

function PremiumPaymentVerificationHandler({ currentUser, setIsPremiumUser, setContents }) {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const subscriptionSuccess = searchParams.get("subscription_success");
  const router = useRouter();
  
  const verificationFired = useRef(false);

  useEffect(() => {
    if (subscriptionSuccess && sessionId && currentUser && !verificationFired.current) {
      verificationFired.current = true;
      
      axios.post(`${API_URL}/stripe/verify-payment`, {
        sessionId,
        userId: currentUser._id || currentUser.id,
        tierName: "VIP Premium Pro"
      }, { withCredentials: true })
      .then(() => {
        toast.success("👑 VIP Membership Activated! Enjoy Premium Assets.");
        setIsPremiumUser(true);
        router.replace("/premium");
        
        // Fetch premium data automatically
        axios.get(`${API_URL}/content/premium-data`, { withCredentials: true })
          .then(res => {
            if (res.data.success) {
              setContents(res.data.data || res.data);
            }
          });
      })
      .catch(() => toast.error("Verification pending or failed."));
    }
  }, [subscriptionSuccess, sessionId, currentUser, setIsPremiumUser, router, setContents]);

  return null;
}

// 👑 Shown right after a successful subscription checkout so the upgrade feels confirmed.
function MembershipSuccessBanner() {
  const searchParams = useSearchParams();

  if (searchParams.get("subscription_success") !== "true") return null;

  return (
    <div className="mb-6 bg-gradient-to-r from-amber-50 to-white border border-amber-200/60 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
      <span className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
        <Crown size={20} />
      </span>
      <div>
        <p className="font-black text-sm text-slate-900">Membership activated — welcome to the VIP Pro Room 👑</p>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Premium masterclasses are unlocked below. Any <b>artwork you acquire</b> is kept separately in your
          private vault — jump to <b>Dashboard → Acquired Artworks</b> to see it with its provenance certificate.
        </p>
      </div>
    </div>
  );
}

// 🖼 Quick access to the collector vault, so acquired masterpieces are one click away from here.
function MyVaultStrip() {
  const [acquired, setAcquired] = useState(null);

  useEffect(() => {
    let alive = true;
    axios
      .get(`${API_URL}/transactions/acquired`, { withCredentials: true })
      .then((res) => {
        if (alive && res.data.success) setAcquired(res.data.data || []);
      })
      .catch(() => {
        if (alive) setAcquired([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const items = Array.isArray(acquired) ? acquired : [];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Private Collection</p>
          <p className="font-black text-sm text-slate-900 mt-0.5">
            {acquired === null ? "Loading vault…" : `${items.length} masterpiece${items.length === 1 ? "" : "s"} acquired`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/acquired"
            className="inline-flex items-center gap-1.5 bg-slate-950 hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all"
          >
            View Acquired Works <ArrowRight size={13} />
          </Link>
          <Link
            href="/dashboard/transactions"
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all"
          >
            <History size={13} /> Purchase History
          </Link>
        </div>
      </div>

      {items.length > 0 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {items.slice(0, 8).map(({ artwork }) => (
            <Link key={artwork._id} href={`/artwork/${artwork._id}`} className="group flex-shrink-0 w-28">
              <div className="w-28 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                <img
                  src={artwork.featuredImage}
                  alt={artwork.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-[10px] font-bold text-slate-600 mt-1.5 truncate group-hover:text-slate-900">
                {artwork.title}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PremiumPage() {
  const [contents, setContents] = useState([]); 
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loadingTier, setLoadingTier] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const verifyAndFetch = async () => {
      try {
        const userRes = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
        let isVip = false;

        if (userRes.data.success && userRes.data.user) {
          const currentUser = userRes.data.user;
          const tier = currentUser.subscriptionTier || "free";
          const hasPremiumTier = tier === "pro" || tier === "premium";
          const hasPremiumFlag = currentUser.isPremium === true;

          if (currentUser.role === "admin" || hasPremiumTier || hasPremiumFlag) {
            setIsPremiumUser(true);
            isVip = true;
          }
          setCurrentUser(currentUser);
        }

        if (isVip) {
          const contentRes = await axios.get(`${API_URL}/content/premium-data`, { withCredentials: true });
          if (contentRes.data.success) {
            setContents(contentRes.data.data || contentRes.data);
          }
        }
      } catch (error) {
        console.error("Verification or fetch failed:", error);
      } finally {
        setCheckingAuth(false);
      }
    };
    verifyAndFetch();
  }, []);

  // =========================================================================
  // =========================================================================
  const handleCheckoutTrigger = async (tierName) => {
    setLoadingTier(tierName);
    const stripeToast = toast.loading(`Initializing secure checkout for ${tierName}...`);
    
    try {
      const res = await axios.post(
        `${API_URL}/stripe/create-checkout-session`, 
        { tierName }, 
        { withCredentials: true }
      );

      if (res.data.success && res.data.url) {
        toast.success("Redirecting to Stripe security vault...", { id: stripeToast });
        
        window.location.href = res.data.url;
      } else {
        throw new Error("Stripe parameters missing from gateway response.");
      }
    } catch (error) {
      console.error("STRIPE_GATEWAY_ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to initialize Stripe engine.", { id: stripeToast });
      setLoadingTier(null);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // =========================================================================
  // =========================================================================
  if (!isPremiumUser) {
    const Tiers = [
      { name: "Starter Spark", price: "0", description: "Explore the community feed.", premium: false, icon: <Zap className="text-slate-400" size={24} />, features: ["3 acquisitions / month", "3 studio uploads", "3 downloads/day"] },
      { name: "VIP Premium Pro", price: "29", description: "Unlock the masterclass vaults completely.", premium: true, icon: <Crown className="text-purple-600 animate-pulse" size={24} />, features: ["25 acquisitions / month", "Unlimited premium downloads", "25 studio uploads", "Verified Profile Badge"] },
      { name: "Studio Enterprise", price: "99", description: "Agency architecture scale.", premium: false, icon: <ShieldCheck className="text-amber-400" size={24} />, features: ["Unlimited acquisitions", "Unlimited uploads & downloads", "Direct API Gateway", "Dedicated Node Manager"] }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8 text-slate-800">
        <Suspense fallback={null}>
          <PremiumPaymentVerificationHandler 
            currentUser={currentUser} 
            setIsPremiumUser={setIsPremiumUser} 
            setContents={setContents} 
          />
        </Suspense>
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-200/50 px-3 py-1.5 rounded-full text-purple-700 text-[10px] font-black tracking-widest uppercase">
              <Sparkles size={12} className="fill-purple-500" /> Restricted Clearance Area
            </div>
            <h1 className="text-3xl font-black text-slate-950 tracking-tight">Unlock Artisano <span className="text-purple-600">VIP Pro Room</span></h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">This zone contains high-tier digital resources. Choose a configuration below to unlock instant access vectors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            {Tiers.map((tier) => (
              <div key={tier.name} className={`border rounded-3xl p-6 sm:p-8 flex flex-col justify-between bg-white relative ${tier.premium ? "shadow-xl ring-2 ring-purple-600/10" : ""}`}>
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-black">{tier.name}</h3>
                    <div className="p-2 bg-slate-50 rounded-xl">{tier.icon}</div>
                  </div>
                  <div className="pt-2 flex items-baseline">
                    <span className="text-4xl font-black">${tier.price}</span>
                    <span className="text-xs font-bold ml-1 text-slate-500">/ mo</span>
                  </div>
                  <ul className="space-y-3 pt-4 border-t border-slate-100">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <CheckCircle2 size={14} className="text-purple-600" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-8">
                  <button type="button" disabled={tier.price === "0"} onClick={() => handleCheckoutTrigger(tier.name)} className={`w-full font-black text-xs py-3 rounded-xl uppercase tracking-wider ${tier.price === "0" ? "bg-slate-100 text-slate-400 cursor-not-allowed" : tier.premium ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-slate-900 text-white"}`}>
                    {loadingTier === tier.name ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : tier.price === "0" ? "Free Member Active" : `Upgrade Node`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 text-slate-800">
      <Suspense fallback={null}>
        <PremiumPaymentVerificationHandler 
          currentUser={currentUser} 
          setIsPremiumUser={setIsPremiumUser} 
          setContents={setContents} 
        />
      </Suspense>
      <div className="max-w-7xl mx-auto">
        
        {/* Header Dashboard Panel */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex justify-between items-center mb-8">
          <div>
            <h1 className="text-xl font-black text-slate-900">VIP Premium Dashboard 👑</h1>
            <p className="text-slate-500 text-xs mt-0.5">Exclusive Content & Premium Resources For You</p>
          </div>
          <Link href="/dashboard" className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-all border">
            Back to Dashboard
          </Link>
        </div>

        <Suspense fallback={null}>
          <MembershipSuccessBanner />
        </Suspense>

        <MyVaultStrip />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contents.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                {/* Image Block */}
                <div className="h-48 w-full bg-slate-100 relative">
                  <img src={item.mediaUrl || item.image || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5"} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-3 left-3 bg-slate-100/90 text-slate-500 font-bold text-[10px] px-2.5 py-1 rounded-md uppercase border">
                    {item.category || "Asset"}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-emerald-50 text-emerald-600 font-bold text-[10px] px-2.5 py-1 rounded-md uppercase border border-emerald-200/50">
                    {item.isFree ? "Free" : "Pro"}
                  </span>
                </div>
                {/* Details Block */}
                <div className="p-5 space-y-2">
                  <h3 className="text-sm font-black text-slate-900 capitalize truncate">{item.title}</h3>
                  <p className="text-slate-400 text-xs line-clamp-2">{item.description || "No customized parameters provided."}</p>
                  <p className="text-slate-900 font-black text-xs">${item.price || 0} <span className="text-slate-400 font-semibold text-[10px]">USD</span></p>
                </div>
              </div>
              {/* Card Footer Actions */}
              <div className="px-5 pb-5 pt-2 border-t border-slate-50 flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-400">By {item.author?.name || "A.Bizli"}</span>
                <a href={item.downloadUrl || "#"} target="_blank" rel="noreferrer" className="bg-slate-950 hover:bg-slate-900 text-white px-4 py-2 rounded-xl transition-all flex items-center gap-1 text-[10px] uppercase font-black">
                  Access Resource
                </a>
              </div>
            </div>
          ))}
        </div>

        
        {contents.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Premium Masterclasses Synced in Database Vault.</p>
            <p className="text-xs text-slate-400 mt-3 max-w-md mx-auto leading-relaxed normal-case tracking-normal">
              This vault lists premium masterclasses only. Masterpieces you purchase individually are always
              preserved in your private collection.
            </p>
            <Link
              href="/dashboard/acquired"
              className="inline-flex items-center gap-1.5 mt-5 text-[11px] font-black uppercase tracking-wider bg-slate-950 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl transition-all"
            >
              Open Acquired Artworks <ArrowRight size={13} />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}