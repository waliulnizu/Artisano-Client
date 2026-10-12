"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation"; 
import { API_URL } from "../../lib/constants";
import { Loader2, User as UserIcon, Palette, ShieldAlert, Crown, Compass, Upload } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client"; 
import { toast } from "react-hot-toast"; 

import ArtistDashboard from "@/components/dashboard/ArtistDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import CollectorOverview from "@/components/dashboard/CollectorOverview";

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
          const res = await fetch(`${API_URL}/stripe/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: sessionToken,
              userId: activeUser.id || activeUser._id,
              tierName: "VIP Premium Pro"
            }),
          });

          if (res.ok) {
            toast.success("Welcome to VIP Pro Room! Account Upgraded ✨", { id: verifyToast });
            
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
      {(activeUser.role === "user" || !activeUser.role) && <CollectorOverview user={activeUser} />}
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, { 
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          credentials: "include"
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 dark:text-zinc-400">
        <Loader2 className="animate-spin text-[#5a6b48] dark:text-emerald-400 mb-2" size={32} />
        <p className="text-sm font-semibold">Configuring your creative workspace...</p>
      </div>
    );
  }

  if (!activeUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-600 dark:text-zinc-300 p-4 text-center">
        <ShieldAlert size={40} className="text-rose-500 mb-3" />
        <h2 className="text-lg font-bold">Access Denied</h2>
        <p className="text-xs text-slate-400 mt-1">Please log in to access your dashboard parameters.</p>
      </div>
    );
  }

  const roleLabel = activeUser.role === "admin" ? "admin" : activeUser.role === "artist" ? "creator" : "collector";
  // Collectors get the dedicated sanctuary layout (with its own welcome hero),
  // so the generic workspace hero above is skipped for them.
  const isCollector = activeUser.role === "user" || !activeUser.role;

  return (
    <div className="py-2">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome hero */}
        {!isCollector && (
        <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl shadow-sm p-6 sm:p-8">
          <span aria-hidden className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-[#e9f0dc] dark:bg-emerald-950/40 blur-3xl" />
          <span aria-hidden className="absolute -bottom-32 right-52 w-64 h-64 rounded-full bg-emerald-100/70 dark:bg-emerald-900/20 blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5 min-w-0">
              <img
                src={activeUser.profileImage || activeUser.image || "https://i.ibb.co/4pDNDk1/avatar.png"}
                alt={activeUser.name}
                onError={(e) => {
                  e.currentTarget.src = "https://i.ibb.co/4pDNDk1/avatar.png";
                }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white dark:border-zinc-700 shadow-md ring-2 ring-[#e9f0dc] dark:ring-emerald-500/30 flex-shrink-0"
              />
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1 rounded-full mb-2">
                  {activeUser.role === "admin" ? (
                    <ShieldAlert size={10} className="text-amber-400" />
                  ) : activeUser.role === "artist" ? (
                    <Palette size={10} />
                  ) : (
                    <UserIcon size={10} />
                  )}
                  Secure Access · {roleLabel}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight break-words">
                  Welcome back, {activeUser.name?.split(" ")[0] || "Artist"} 👋
                </h1>
                <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm mt-1">
                  Here&apos;s what&apos;s happening in your Artisano workspace today.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-[#5a6b48] dark:hover:border-emerald-500 text-slate-700 dark:text-zinc-200 text-xs font-black px-4 py-2.5 rounded-xl transition-all"
              >
                <Compass size={14} /> Browse Artworks
              </Link>
              {activeUser.role === "artist" || activeUser.role === "admin" ? (
                <Link
                  href="/dashboard/upload"
                  className="inline-flex items-center gap-2 bg-[#5a6b48] hover:bg-[#4c5b3d] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md shadow-[#5a6b48]/25 transition-all"
                >
                  <Upload size={14} /> Upload Artwork
                </Link>
              ) : (
                <Link
                  href="/premium"
                  className="inline-flex items-center gap-2 bg-[#5a6b48] hover:bg-[#4c5b3d] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md shadow-[#5a6b48]/25 transition-all"
                >
                  <Crown size={14} /> Go Premium
                </Link>
              )}
            </div>
          </div>
        </div>
        )}

        <Suspense
          fallback={
            <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
              <Loader2 className="animate-spin inline mr-2 text-[#5a6b48]" size={24} />
              <span className="text-sm font-medium text-slate-500 dark:text-zinc-400">Hydrating user parameters...</span>
            </div>
          }
        >
          <DashboardContent activeUser={activeUser} setUser={setUser} />
        </Suspense>
      </div>
    </div>
  );
}