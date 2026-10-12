"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { API_URL } from "@/lib/constants";

/**
 * "From the same collection" — sibling masterpieces, ranked by shared creator
 * first and shared category second (mirrors how a curator would hang a wall).
 */
export default function RelatedMasterpieces({ currentId, category, authorId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/content/public-data?limit=24`, { credentials: "include" });
        const json = await res.json();
        if (!alive || !json.success) return;

        const score = (item) => {
          let s = 0;
          if (authorId && String(item.author?._id) === String(authorId)) s += 2;
          if (category && item.category === category) s += 1;
          return s;
        };

        const related = json.data
          .filter((item) => String(item._id) !== String(currentId))
          .sort((a, b) => score(b) - score(a))
          .slice(0, 3);

        setItems(related);
      } catch (error) {
        console.error("Related masterpieces fetch failed:", error);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [currentId, category, authorId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-slate-400">
        <Loader2 className="animate-spin" size={22} />
      </div>
    );
  }

  if (!items.length) return null;

  return (
    <section>
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-[#5a6b48] dark:text-emerald-400">
            From the same collection
          </p>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight mt-1">Related Masterpieces</h2>
        </div>
        <Link
          href="/browse"
          className="text-xs font-black text-[#5a6b48] dark:text-emerald-400 inline-flex items-center gap-1.5 hover:gap-2.5 transition-all flex-shrink-0"
        >
          View Full Catalog <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Link
            key={item._id}
            href={`/artwork/${item._id}`}
            className="group bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-3
                       hover:shadow-lg hover:border-[#5a6b48]/30 transition-all"
          >
            <div className="h-56 rounded-2xl overflow-hidden bg-slate-50 dark:bg-zinc-800">
              <img
                src={item.featuredImage}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-3">
              <h3 className="font-display text-lg group-hover:text-[#5a6b48] transition-colors capitalize">
                {item.title}
              </h3>
              <p className="text-xs italic text-slate-500 dark:text-zinc-400 mt-0.5">by {item.author?.name || "Artisan"}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50 dark:border-zinc-800">
                <span className="font-black">${item.price}</span>
                <span className="text-xs font-black text-[#5a6b48] inline-flex items-center gap-1">
                  Details <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
