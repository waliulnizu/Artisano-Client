"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Compass,
  Crown,
  Layers,
  Loader2,
  ReceiptText,
  Sparkles,
} from "lucide-react";

import { API_URL } from "@/lib/constants";

function StatCard({ icon: Icon, tint, label, badge, value, children }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className={`w-11 h-11 rounded-2xl flex items-center justify-center ${tint}`}>
          <Icon size={18} />
        </span>
        {badge && (
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 text-right">
            {badge}
          </span>
        )}
        {children}
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mt-5">{label}</p>
      <p className="font-display text-3xl tracking-tight mt-1">{value}</p>
    </div>
  );
}

export default function CollectorOverview({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/dashboard/user-stats`, { credentials: "include" });
        const data = await res.json();
        if (alive && data.success) setStats(data.data);
      } catch (error) {
        console.error("Collector stats fetch failed:", error);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const acquired = stats?.purchaseCount ?? 0;
  const quotaUsed = stats?.quotaUsed ?? acquired;
  const quotaUnlimited = Boolean(stats?.quotaUnlimited);
  const quotaLimit = stats?.quotaLimit ?? 3;
  const tier = stats?.tier || "free";
  const tierLabel = stats?.tierLabel || (tier === "free" ? "Starter Spark" : tier);
  const progress = quotaUnlimited ? 100 : Math.min(100, Math.round((quotaUsed / (quotaLimit || 1)) * 100));
  const resetsOn = stats?.quotaResetAt
    ? new Date(stats.quotaResetAt).toLocaleDateString("en-US", { month: "long", day: "numeric" })
    : null;

  return (
    <div className="space-y-6">
      {/* ── Welcome hero ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[32px] p-6 sm:p-8 shadow-sm">
        <span aria-hidden className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-[#e9f0dc] dark:bg-emerald-950/40 blur-3xl" />
        <span aria-hidden className="absolute -bottom-32 right-52 w-64 h-64 rounded-full bg-emerald-100/70 dark:bg-emerald-900/20 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 bg-[#e9f0dc] dark:bg-emerald-950/50 text-[#4a5a3e] dark:text-emerald-300
                             text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
              <Sparkles size={11} /> Collector Sanctuary
            </span>

            <h1 className="font-display text-3xl sm:text-4xl tracking-tight mt-3 leading-tight break-words">
              Welcome back, {user?.name || "Collector"}!
            </h1>

            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
              Your personal fine-art collection is preserved here. Explore new premier drops from the
              world&apos;s leading creators.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <Link
                href="/dashboard/acquired"
                className="inline-flex items-center gap-2 bg-[#5a6b48] hover:bg-[#4c5b3d] text-white font-black text-xs
                           px-5 py-3 rounded-full shadow-md shadow-[#5a6b48]/25 transition-all"
              >
                View Acquired Works <ArrowRight size={14} />
              </Link>
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700
                           hover:border-[#5a6b48] text-slate-700 dark:text-zinc-200 font-black text-xs px-5 py-3 rounded-full transition-all"
              >
                <Compass size={14} /> Browse Gallery
              </Link>
            </div>
          </div>

          {user && (
            <img
              src={user.profileImage || user.image || "https://i.ibb.co/4pDNDk1/avatar.png"}
              alt={user.name}
              onError={(e) => {
                e.currentTarget.src = "https://i.ibb.co/4pDNDk1/avatar.png";
              }}
              className="hidden md:block w-32 h-32 rounded-[26px] object-cover border-4 border-white dark:border-zinc-700
                         shadow-lg ring-2 ring-[#e9f0dc] dark:ring-emerald-500/30 flex-shrink-0"
            />
          )}
        </div>
      </div>

      {/* ── Stat cards ───────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">
              <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-zinc-800 animate-pulse" />
              <div className="h-3 w-28 rounded bg-slate-100 dark:bg-zinc-800 animate-pulse mt-5" />
              <div className="h-7 w-16 rounded bg-slate-100 dark:bg-zinc-800 animate-pulse mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard
            icon={Layers}
            tint="bg-rose-50 text-rose-500 dark:bg-rose-950/40 dark:text-rose-300"
            label="Acquired Artworks"
            badge="Permanent Vault"
            value={acquired}
          />

          <StatCard
            icon={ReceiptText}
            tint="bg-amber-50 text-amber-500 dark:bg-amber-950/40 dark:text-amber-300"
            label="Monthly Acquisition Quota"
            value={quotaUnlimited ? `${quotaUsed} this month · Unlimited` : `${quotaUsed} / ${quotaLimit}`}
          >
            <div className="h-1.5 w-24 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            {resetsOn && !quotaUnlimited && (
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1.5">Slots refresh on {resetsOn}</p>
            )}
          </StatCard>

          <StatCard
            icon={BadgeCheck}
            tint="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300"
            label="Membership Tier"
            badge={tier === "free" ? "Free Patron" : "Active Member"}
            value={tierLabel}
          />

          {/* Quick links */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/dashboard/transactions"
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5
                         flex items-center justify-between gap-3 hover:border-[#5a6b48]/40 transition-all group"
            >
              <span className="flex items-center gap-3 min-w-0">
                <span className="w-10 h-10 rounded-2xl bg-[#e9f0dc] dark:bg-emerald-950/40 text-[#5a6b48] dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                  <ReceiptText size={17} />
                </span>
                <span className="min-w-0">
                  <span className="block font-black text-sm">Purchase History</span>
                  <span className="block text-[11px] text-slate-400 truncate">Every receipt and acquisition ledger entry</span>
                </span>
              </span>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-[#5a6b48] transition-colors flex-shrink-0" />
            </Link>

            <Link
              href="/premium"
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5
                         flex items-center justify-between gap-3 hover:border-amber-400/60 transition-all group"
            >
              <span className="flex items-center gap-3 min-w-0">
                <span className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <Crown size={17} />
                </span>
                <span className="min-w-0">
                  <span className="block font-black text-sm">Membership &amp; Tier</span>
                  <span className="block text-[11px] text-slate-400 truncate">Unlock more acquisition slots</span>
                </span>
              </span>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-amber-500 transition-colors flex-shrink-0" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
