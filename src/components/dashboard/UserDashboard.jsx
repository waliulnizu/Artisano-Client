"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import SavedCollection from "./SavedCollection";
import StatCard from "./StatCard";
import { Crown, Heart, ShoppingBag } from "lucide-react";

export default function UserDashboard({ user }) {
  const [stats, setStats] = useState({ saved: null, bought: null, spent: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [wishRes, txRes] = await Promise.all([
          axios.get(`${API_URL}/wishlist`, { withCredentials: true }).catch(() => null),
          axios.get(`${API_URL}/transactions/my-history`, { withCredentials: true }).catch(() => null),
        ]);

        const saved = wishRes?.data?.success ? (wishRes.data.data || []).length : 0;
        const tx = txRes?.data?.success ? txRes.data.data || [] : [];
        const bought = tx.filter((t) => /artwork/i.test(t.packageName || "")).length;
        const spent = tx
          .filter((t) => t.status === "succeeded")
          .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

        setStats({ saved, bought, spent });
      } catch {
        setStats({ saved: 0, bought: 0, spent: 0 });
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          icon={Crown}
          tone="amber"
          label="Account Tier"
          value={user?.isPremium ? "Premium VIP" : "Standard Free"}
          sub={user?.isPremium ? `Plan: ${user?.subscriptionTier || "premium"}` : "Upgrade anytime for VIP access"}
        />

        <StatCard
          icon={Heart}
          tone="rose"
          label="Saved Vault"
          value={stats.saved === null ? "…" : `${stats.saved} Artwork${stats.saved === 1 ? "" : "s"}`}
          sub="Saved from the gallery"
        />

        <StatCard
          icon={ShoppingBag}
          tone="emerald"
          label="Purchased Assets"
          value={stats.bought === null ? "…" : `${stats.bought} Masterpiece${stats.bought === 1 ? "" : "s"}`}
          sub={`Total investment: $${stats.spent}`}
        />
      </div>

      <div className="bg-white dark:bg-zinc-900 p-5 sm:p-7 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
        <SavedCollection />
      </div>
    </div>
  );
}
