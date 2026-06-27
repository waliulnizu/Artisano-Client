"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/constants";
import { Loader2, ShieldAlert } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    let isMounted = true;
    
    const verifyAuth = async () => {
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
        
        if (isMounted) {
          if (data.success && data.user) {
            setIsAuthenticated(true);
            setUserRole(data.user.role || "user");
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        if (isMounted) setIsAuthenticated(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (!isPending) {
      if (session?.user) {
        setIsAuthenticated(true);
        setUserRole(session.user.role || "user");
        setLoading(false);
      } else {
        verifyAuth();
      }
    }

    return () => { isMounted = false; };
  }, [isPending, session]);

  if (loading || isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <Loader2 className="animate-spin text-slate-900 mb-2" size={32} />
        <p className="text-sm font-semibold">Verifying secure access...</p>
      </div>
    );
  }

  // ১. লগইন করা না থাকলে লগইন পেজে পাঠিয়ে দেবে
  if (!isAuthenticated) {
    router.push("/login");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600 p-4 text-center">
        <ShieldAlert size={40} className="text-rose-500 mb-3" />
        <h2 className="text-lg font-bold">Access Denied</h2>
        <p className="text-xs text-slate-400 mt-1">Redirecting to login portal...</p>
      </div>
    );
  }

  // ২. যদি স্পেসিফিক রোলের এক্সেস দরকার হয় (যেমন: শুধু Admin বা Artist এর জন্য)
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole) && userRole !== "admin") {
     return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600 p-4 text-center">
        <ShieldAlert size={40} className="text-amber-500 mb-3" />
        <h2 className="text-lg font-bold">Insufficient Clearance</h2>
        <p className="text-xs text-slate-400 mt-1">Your current clearance level cannot access this secure node.</p>
      </div>
    );
  }

  // ৩. সব ঠিক থাকলে চিলড্রেন পেজ রেন্ডার করবে
  return children;
}
