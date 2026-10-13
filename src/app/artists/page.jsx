"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { API_URL } from "@/lib/constants";
import { ArrowLeft, ArrowRight } from "lucide-react";

const COVERS = [
  "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=800&auto=format&fit=crop",
];

export default function ArtistsPage() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/public-users`);
        if (res.data.success) {
          setArtists((res.data.data || []).sort((a, b) => b.count - a.count));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#e9f0dc] dark:bg-zinc-950 py-14 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#5a6b48] transition mb-6">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">All Artists</h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1 mb-10">Every creator on Artisano, ranked by assets published.</p>

        {loading ? (
          <p className="text-center text-slate-400 py-20">Loading artists...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((a, index) => (
              <Link
                key={a.id || a.name}
                href={`/artist/${encodeURIComponent(a.name)}`}
                className="group relative bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="relative h-28 overflow-hidden rounded-t-[23px]">
                  <img src={COVERS[index % COVERS.length]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="px-5 pb-5 -mt-10 text-center relative z-10">
                  <img
                    src={a.image || "https://i.ibb.co/4pDNDk1/avatar.png"}
                    alt={a.name}
                    onError={(e) => { e.currentTarget.src = "https://i.ibb.co/4pDNDk1/avatar.png"; }}
                    className="relative z-10 w-20 h-20 rounded-full mx-auto object-cover border-4 border-white dark:border-zinc-900 shadow-lg"
                  />
                  <p className="mt-3 text-base font-black text-slate-900 dark:text-white capitalize">{a.name}</p>
                  <span className="inline-flex mt-1.5 text-[11px] font-bold text-[#5a6b48] dark:text-emerald-300 bg-[#e9f0dc] dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-full">
                    {a.count} asset{a.count !== 1 ? "s" : ""}
                  </span>
                  <span className="mt-4 flex items-center justify-center gap-1 text-xs font-black text-[#5a6b48] dark:text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Portfolio <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
