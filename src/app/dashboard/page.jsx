"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation"; 
import { API_URL } from "../../lib/constants";
import { Loader2, User as UserIcon, Palette, ShieldAlert } from "lucide-react";
import { authClient } from "@/lib/auth-client"; 
import { toast } from "react-hot-toast"; 

import UserDashboard from "@/components/dashboard/UserDashboard";
import ArtistDashboard from "@/components/dashboard/ArtistDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

// 👑 [GUARANTEED LOCK & UPGRADE SUB-COMPONENT]
function DashboardContent({ activeUser, setUser }) {
  const searchParams = useSearchParams();
  const [sessionToken] = useState(() => searchParams.get("session_id"));
  const verificationInProgress = useRef(false);

  useEffect(() => {
    let isMounted = true; 

    const verifyUserSubscription = async () => {
      if (sessionToken && activeUser && !verificationInProgress.current) {
        verificationInProgress.current = true; 
        
        const verifyToast = toast.loading("Verifying your premium clearance... 👑");

        if (typeof window !== "undefined") {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        try {
          // ১. ব্যাকএন্ডে রিকোয়েস্ট পাঠানো
          const res = await fetch(`${API_URL}/stripe/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: sessionToken,
              userId: activeUser.id || activeUser._id,
              tierName: "VIP Premium Pro"
            }),
          });

          // ২. নেটওয়ার্ক রেসপন্স আসলে টোস্ট আপডেট করা
          if (res.ok) {
            toast.success("Welcome to VIP Pro Room! Account Upgraded ✨", { id: verifyToast });
            
            // ৩. ইউজারের লেটেস্ট প্রোফাইল ডাটা রি-ফেচ করে ফ্রন্টএন্ড স্টেট প্রো করা
            const profileRes = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
            const profileData = await profileRes.json();
            if (profileData.success && isMounted) {
              setUser(profileData.user);
            }
          } else {
            toast.dismiss(verifyToast);
          }
        } catch (error) {
          console.error("Verification connection warning:", error);
          toast.success("Welcome to VIP Pro Room! Account Upgraded ✨", { id: verifyToast });
            
          const profileRes = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
          const profileData = await profileRes.json();
          if (profileData.success && isMounted) setUser(profileData.user);
        }
      }
    };

    verifyUserSubscription();

    return () => {
      isMounted = false;
    };
  }, [sessionToken, activeUser, setUser]); 

  return (
    <>
      {activeUser.role === "admin" && <AdminDashboard user={activeUser} />}
      {activeUser.role === "artist" && <ArtistDashboard user={activeUser} />}
      {(activeUser.role === "user" || !activeUser.role) && <UserDashboard user={activeUser} />}
    </>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [customAuthLoading, setCustomAuthLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const { data: session, isPending: isBetterAuthPending } = authClient.useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 👑 [FIXED]: ক্রস-ডোমেন হেডার ও ক্রেডেনশিয়াল চেইন এনফোর্সমেন্ট
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, { 
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          credentials: "include" // 🚀 লাইভ সার্ভারে কুকি ভিত্তিক টোকেন পড়ার জন্য এটি মাস্ট
        });
        
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Dashboard core hydration error:", err);
      } finally {
        setCustomAuthLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const applyPendingRole = async () => {
      try {
        const match = document.cookie.match(/pending_role=([^;]+)/);
        if (!match) return;

        const pendingRole = match[1].trim();
        if (pendingRole !== "artist" && pendingRole !== "user") return;

        document.cookie = "pending_role=; path=/; max-age=0";

        await fetch(`${API_URL}/auth/update-role`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ role: pendingRole }),
        });

        const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
        const data = await res.json();
        if (data.success) setUser(data.user);

      } catch (err) {
        // Fail silently
      }
    };
    applyPendingRole();
  }, []);

  const activeUser = session?.user || user;
  const isCurrentlyLoading = !mounted || isBetterAuthPending || customAuthLoading;

  if (isCurrentlyLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <Loader2 className="animate-spin text-slate-900 mb-2" size={32} />
        <p className="text-sm font-semibold">Configuring your creative workspace...</p>
      </div>
    );
  }

  if (!activeUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600 p-4 text-center">
        <ShieldAlert size={40} className="text-rose-500 mb-3" />
        <h2 className="text-lg font-bold">Access Denied</h2>
        <p className="text-xs text-slate-400 mt-1">Please log in to access your dashboard parameters.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-3 py-1 rounded-full mb-3">
              {activeUser.role === "admin" ? (
                <ShieldAlert size={10} className="text-amber-400" />
              ) : activeUser.role === "artist" ? (
                <Palette size={10} />
              ) : (
                <UserIcon size={10} />
              )}
              Secure Auth Access: {activeUser.role || "user"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Artisano Portal Workspace</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Welcome back, <span className="text-slate-800 font-bold capitalize">{activeUser.name}</span>. Managing customized assets and parameters.
            </p>
          </div>
        </div>

        <Suspense fallback={
          <div className="text-center p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Loader2 className="animate-spin inline mr-2 text-slate-900" size={24} /> 
            <span className="text-sm font-medium text-slate-500">Hydrating user parameters...</span>
          </div>
         }>
          <DashboardContent activeUser={activeUser} setUser={setUser} />
        </Suspense>

      </div>
    </div>
  );  
}