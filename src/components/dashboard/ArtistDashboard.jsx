"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import Link from "next/link";
import { Plus, Layers, Heart, ImagePlus } from "lucide-react";

import SavedCollection from "./SavedCollection";
import StatCard from "./StatCard";

export default function ArtistDashboard({ user }) {
  const [stats, setStats] = useState({ assets: null, saved: null });

  useEffect(() => {
    const load = async () => {
      try {
        const [assetsRes, wishRes] = await Promise.all([
          axios.get(`${API_URL}/content/artist-assets`, { withCredentials: true }).catch(() => null),
          axios.get(`${API_URL}/wishlist`, { withCredentials: true }).catch(() => null),
        ]);
        const assets = assetsRes?.data?.success ? (assetsRes.data.data || []).length : 0;
        const saved = wishRes?.data?.success ? (wishRes.data.data || []).length : 0;
        setStats({ assets, saved });
      } catch {
        setStats({ assets: 0, saved: 0 });
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          icon={Layers}
          tone="violet"
          label="Published Artworks"
          value={stats.assets === null ? "…" : `${stats.assets} Artwork${stats.assets === 1 ? "" : "s"}`}
          sub="Live in the marketplace"
        />

        <StatCard
          icon={Heart}
          tone="rose"
          label="Saved Vault"
          value={stats.saved === null ? "…" : `${stats.saved} Artwork${stats.saved === 1 ? "" : "s"}`}
          sub="Saved from the gallery"
        />

        <StatCard
          icon={ImagePlus}
          tone="olive"
          label="Creator Action"
          value="Grow your studio"
          sub="Publish a new masterpiece"
        >
          <Link
            href="/dashboard/upload"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-[#5a6b48] hover:bg-[#4c5b3d] text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md shadow-[#5a6b48]/25 transition-all active:scale-95"
          >
            <Plus size={14} /> Upload New Artwork
          </Link>
        </StatCard>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm p-5 sm:p-7">
        <SavedCollection />
      </div>
    </div>
  );
}
