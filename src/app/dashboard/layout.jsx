"use client";

import { useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DashboardSidebar, DashboardMobileNav, useDashboardUser } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  const { user, loading } = useDashboardUser();

  // Keep sidebar / mobile nav pinned exactly under the (wrapping, hydration-changing) top navbar.
  useEffect(() => {
    const setNavVar = () => {
      const nav = document.querySelector("nav.sticky");
      // No top navbar inside the dashboard → sidebar pins to the top edge.
      const h = nav ? Math.round(nav.getBoundingClientRect().height) : 0;
      const current = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--site-nav-h"),
        10
      );
      if (Math.abs((current || 0) - h) > 1) {
        document.documentElement.style.setProperty("--site-nav-h", `${h}px`);
      }
    };

    setNavVar();
    window.addEventListener("resize", setNavVar);
    // Navbar height changes after hydration / session load, so keep it in sync.
    const timer = setInterval(setNavVar, 750);
    const nav = document.querySelector("nav.sticky");
    let obs = null;
    if (nav && typeof ResizeObserver !== "undefined") {
      obs = new ResizeObserver(setNavVar);
      obs.observe(nav);
    }
    return () => {
      window.removeEventListener("resize", setNavVar);
      clearInterval(timer);
      if (obs) obs.disconnect();
    };
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#e9f0dc]/50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors duration-300">
        <DashboardSidebar user={user} loading={loading} />

        <div className="md:pl-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <DashboardMobileNav user={user} loading={loading} />
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
