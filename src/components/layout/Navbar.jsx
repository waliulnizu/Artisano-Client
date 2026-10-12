"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; 
import { API_URL } from "@/lib/constants"; 
import { Crown, LayoutDashboard, LogOut, Settings, Sun, Moon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "@/components/ThemeProvider";
import NavbarSkeleton from "./NavbarSkeleton";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [customUser, setCustomUser] = useState(null);
  const [customLoading, setCustomLoading] = useState(true);
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { data: session, isPending: isBetterAuthPending } = authClient.useSession();

  useEffect(() => {
    setMounted(true);

    const fetchCustomUser = async () => {
      setCustomLoading(true);
      try {
        const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
        const data = await res.json();
        if (data.success) {
          setCustomUser(data.user);
        } else {
          setCustomUser(null);
        }
      } catch (err) {
        setCustomUser(null);
      } finally {
        setCustomLoading(false);
      }
    };
    if (!isBetterAuthPending) {
      fetchCustomUser();
    }
  }, [isBetterAuthPending, session]);

  const currentUser = customUser || session?.user;
  const globalLoading = isBetterAuthPending || customLoading;

  // The marketing navbar is public-site chrome only. Inside the dashboard the
  // fixed sidebar owns navigation, so the top bar is hidden (Stripe/Vercel-style).
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  if (globalLoading) {
    return <NavbarSkeleton />;
  }

  const handleLogout = async () => {
    try {
      if (session) {
        await authClient.signOut();
      } else {
        await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      }
      toast.success("Logged out successfully.");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout process met an issue.");
    }
  };

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 p-4 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <svg width="34" height="34" viewBox="0 0 40 40" fill="none" className="group-hover:rotate-6 transition-transform duration-300">
            <path d="M20 4c-3 5-9 8-9 14a9 9 0 0018 0c0-6-6-9-9-14z" fill="url(#g1)" />
            <path d="M20 12c-1.6 3-5 4.6-5 8a5 5 0 0010 0c0-3.4-3.4-5-5-8z" fill="white" fillOpacity="0.85" />
            <defs>
              <linearGradient id="g1" x1="11" y1="4" x2="29" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22c55e" /><stop offset="1" stopColor="#0d9488" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-xl font-black tracking-tight text-[#4a5a3e] dark:text-white">
            Artisano
          </span>
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold">
          {[
            { label: "Home", href: "/" },
            { label: "Browse Artworks", href: "/browse" },
            { label: "Pricing", href: "/premium" },
          ].map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.label}
                href={l.href}
                className={`relative pb-1 transition ${active ? "text-[#4a5a3e] dark:text-emerald-300 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-[#7a8b5c] after:rounded-full" : "text-slate-500 dark:text-zinc-400 hover:text-[#4a5a3e] dark:hover:text-white"}`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        
        <div className="flex items-center gap-3 sm:gap-4">
          
          
          
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`hidden md:flex items-center w-14 h-7 rounded-full transition-colors duration-300 px-1 ${theme === "dark" ? "bg-zinc-700 justify-end" : "bg-[#5a6b48] justify-start"}`}
              aria-label="Toggle Website Color Theme"
              title={theme === "dark" ? "Switch to Light Mode ☀️" : "Switch to Dark Mode 🌙"}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow flex items-center justify-center">
                {theme === "dark" ? <Moon className="h-3 w-3 text-indigo-500" /> : <Sun className="h-3 w-3 text-amber-500" />}
              </span>
            </button>
          )}

          {globalLoading ? (
            <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
          ) : currentUser ? (
            <>
              <Link
                href="/dashboard"
                className="text-slate-600 dark:text-zinc-300 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition text-xs sm:text-sm flex items-center gap-1.5"
              >
                <LayoutDashboard size={15} />
                <span className="hidden md:inline">Dashboard</span>
              </Link>

              <Link
                href="/premium"
                className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-extrabold hover:text-amber-700 transition text-xs sm:text-sm border border-amber-200 dark:border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/20 px-2.5 py-1.5 rounded-xl shadow-sm"
              >
                <Crown size={14} className="fill-amber-500 text-amber-500 dark:text-amber-400" />
                VIP Room
              </Link>

              <div className="flex items-center gap-3 pl-3 border-l border-slate-100 dark:border-zinc-800">
                <Link 
                  href="/dashboard/settings" 
                  className="flex items-center gap-2 group cursor-pointer"
                  title="Go to Account Settings ⚙️"
                >
                  <div className="relative">
                    <img
                      src={currentUser.profileImage || currentUser.image || "https://i.ibb.co/4pDNDk1/avatar.png"} 
                      alt={currentUser.name}
                      onError={(e) => { e.currentTarget.src = "https://i.ibb.co/4pDNDk1/avatar.png"; }}
                      className="w-8 h-8 rounded-full border border-slate-200 dark:border-zinc-700 object-cover shadow-sm group-hover:border-blue-400 transition-all"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-full p-0.5 shadow-sm group-hover:rotate-45 transition-transform duration-300">
                      <Settings size={8} className="text-slate-500 dark:text-zinc-400 group-hover:text-blue-600" />
                    </div>
                  </div>

                  <span className="text-slate-800 dark:text-zinc-200 font-bold text-xs truncate max-w-[80px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors capitalize">
                    {currentUser.name?.split(" ")[0]}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
                  title="Logout Account"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="px-4 py-2 text-slate-700 dark:text-zinc-300 font-bold hover:text-[#4a5a3e] dark:hover:text-white transition text-sm rounded-full">
                Login
              </Link>
              <Link href="/register" className="px-5 py-2 bg-[#5a6b48] hover:bg-[#48573a] text-white font-bold shadow-sm rounded-full text-sm transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>
        
      </div>

      {/* Dashboard sub-menu removed: the fixed sidebar now owns these links. */}
    </nav>
  );
}