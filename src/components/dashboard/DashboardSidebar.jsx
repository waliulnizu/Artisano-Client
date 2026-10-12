"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/constants";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import {
  LayoutDashboard,
  History,
  Palette,
  UploadCloud,
  UserCircle,
  ShieldAlert,
  Home,
  LogOut,
  Sun,
  Moon,
  BadgeCheck,
  StickyNote,
  Crown,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

// 👑 Collector (role: "user") menu — the fine-art patron experience.
const COLLECTOR_NAV_ITEMS = [
  { label: "Collector Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Purchase History", href: "/dashboard/transactions", icon: History },
  { label: "Acquired Artworks", href: "/dashboard/acquired", icon: BadgeCheck },
  { label: "My Curatorial Notes", href: "/dashboard/notes", icon: StickyNote },
  { label: "Membership & Tier", href: "/premium", icon: Crown },
  { label: "Collector Profile", href: "/dashboard/settings", icon: UserCircle },
];

// Creator / admin menu — unchanged from the studio experience.
const STUDIO_NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["user", "artist", "admin"], exact: true },
  { label: "Purchase History", href: "/dashboard/transactions", icon: History, roles: ["user", "artist", "admin"] },
  { label: "Acquired Artworks", href: "/dashboard/acquired", icon: BadgeCheck, roles: ["user", "artist", "admin"] },
  { label: "My Studio", href: "/dashboard/my-assets", icon: Palette, roles: ["artist", "admin"] },
  { label: "Upload", href: "/dashboard/upload", icon: UploadCloud, roles: ["artist", "admin"] },
  { label: "Profile", href: "/dashboard/settings", icon: UserCircle, roles: ["user", "artist", "admin"] },
  { label: "Admin Panel", href: "/dashboard/admin-panel", icon: ShieldAlert, roles: ["admin"] },
];

export const navItemsForRole = (role) => {
  if (role === "user" || !role) return COLLECTOR_NAV_ITEMS;
  return STUDIO_NAV_ITEMS.filter((i) => i.roles.includes(role));
};

export function useDashboardUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
        const data = await res.json();
        if (alive) setUser(data.success ? data.user : null);
      } catch {
        if (alive) setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { user, loading };
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <svg width="30" height="30" viewBox="0 0 40 40" fill="none" className="group-hover:rotate-6 transition-transform duration-300">
        <path d="M20 4c-3 5-9 8-9 14a9 9 0 0018 0c0-6-6-9-9-14z" fill="url(#gSide)" />
        <path d="M20 12c-1.6 3-5 4.6-5 8a5 5 0 0010 0c0-3.4-3.4-5-5-8z" fill="white" fillOpacity="0.85" />
        <defs>
          <linearGradient id="gSide" x1="11" y1="4" x2="29" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22c55e" />
            <offset offset="1" stopColor="#0d9488" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-lg font-black tracking-tight text-[#4a5a3e] dark:text-white">Artisano</span>
      <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">Studio</span>
    </Link>
  );
}

export function DashboardSidebar({ user, loading }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const role = user?.role || "user";
  const items = navItemsForRole(role);

  const handleLogout = async () => {
    try {
      const { data: session } = await authClient.getSession();
      if (session?.user) {
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
    <aside
      style={{ paddingTop: "calc(var(--site-nav-h, 0px) + 18px)" }}
      className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 z-40 flex-col bg-white dark:bg-zinc-900 border-r border-slate-100 dark:border-zinc-800 px-4 pb-5 transition-colors duration-300"
    >
      <div className="px-2 pb-4 mb-3 border-b border-slate-100 dark:border-zinc-800">
        <Brand />
      </div>

      {/* Profile identity block */}
      {loading ? (
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-zinc-800 animate-pulse" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-24 rounded bg-slate-100 dark:bg-zinc-800 animate-pulse" />
            <div className="h-2.5 w-16 rounded bg-slate-100 dark:bg-zinc-800 animate-pulse" />
          </div>
        </div>
      ) : user ? (
        <Link
          href="/dashboard/settings"
          className="group flex items-center gap-3 px-2 py-2.5 mb-4 rounded-2xl border border-slate-100 dark:border-zinc-800 hover:border-[#5a6b48]/40 dark:hover:border-emerald-500/30 hover:bg-[#e9f0dc]/60 dark:hover:bg-zinc-800 transition-all"
          title="Edit your profile"
        >
          <img
            src={user.profileImage || user.image || "https://i.ibb.co/4pDNDk1/avatar.png"}
            alt={user.name}
            onError={(e) => {
              e.currentTarget.src = "https://i.ibb.co/4pDNDk1/avatar.png";
            }}
            className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-zinc-700 ring-2 ring-[#e9f0dc] dark:ring-emerald-500/30 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-[#4a5a3e] dark:group-hover:text-emerald-300 transition-colors">
              {user.name || "My Account"}
            </p>
            <p className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 truncate">
              {user.role === "artist" ? "Creator" : user.role === "admin" ? "Admin" : "Collector"}
            </p>
          </div>
          <span
            className={`flex-shrink- text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md border ${
              user.isPremium
                ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900"
                : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
            }`}
          >
            {user.isPremium ? "Premium" : "Free"}
          </span>
        </Link>
      ) : null}

      <nav className="flex flex-col gap-1.5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 animate-pulse" />
            ))
          : items.map((item) => {
              const Icon = item.icon;
              const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                    active
                      ? "bg-[#5a6b48] text-white shadow-md shadow-[#5a6b48]/25"
                      : "text-slate-600 dark:text-zinc-400 hover:bg-[#e9f0dc] dark:hover:bg-zinc-800 hover:text-[#4a5a3e] dark:hover:text-white"
                  }`}
                >
                  <Icon size={17} className={active ? "text-white" : "text-slate-400 dark:text-zinc-500"} />
                  {item.label}
                </Link>
              );
            })}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <Link
            href="/"
            className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-zinc-400 hover:bg-[#e9f0dc] dark:hover:bg-zinc-800 transition-all"
          >
            <Home size={17} className="text-slate-400 dark:text-zinc-500" />
            Gallery Home
          </Link>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="shrink-0 w-10 h-10 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-[#5a6b48] dark:hover:text-emerald-300 hover:border-[#5a6b48]/40 transition-all"
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {mounted ? theme === "dark" ? <Moon size={16} /> : <Sun size={16} /> : <Sun size={16} />}
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 dark:text-zinc-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 transition-all text-left"
        >
          <LogOut size={17} className="text-slate-400 dark:text-zinc-500" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export function DashboardMobileNav({ user, loading }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const role = user?.role || "user";
  const items = navItemsForRole(role);

  if (loading) return null;

  return (
    <div
      style={{ top: "var(--site-nav-h, 0px)" }}
      className="md:hidden sticky z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-[#e9f0dc]/90 dark:bg-zinc-950/90 backdrop-blur border-b border-slate-200/70 dark:border-zinc-800 overflow-x-auto"
    >
      <div className="flex items-center gap-2 min-w-max">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all ${
                active
                  ? "bg-[#5a6b48] text-white shadow-md"
                  : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800"
              }`}
            >
              <Icon size={14} />
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black whitespace-nowrap bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800"
        >
          <Home size={14} />
          Home
        </Link>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800"
          aria-label="Toggle theme"
        >
          {mounted ? theme === "dark" ? <Moon size={14} /> : <Sun size={14} /> : <Sun size={14} />}
        </button>
      </div>
    </div>
  );
}
