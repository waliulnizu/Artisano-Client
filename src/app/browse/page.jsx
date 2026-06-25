"use client";

import { useState, useEffect } from "react";
import { API_URL } from "../../lib/constants";
import { Search, SlidersHorizontal, Loader2, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";

export default function BrowseArtworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search: search.trim(),
        category,
        sort,
        minPrice,
        maxPrice,
        page,
        limit: 8 
      });

      const res = await fetch(`${API_URL}/content/public-data?${queryParams.toString()}`, {
        method: "GET",
        credentials: "omit", 
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        }
      });

      const responseData = await res.json();

      if (responseData.success) {
        setArtworks(responseData.data);
        setTotalPages(responseData.meta.totalPages);
      }
    } catch (error) {
      console.error("Error loading artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  // 👑 [FIX]: ডিপেন্ডেন্সি অ্যারেতে search স্টেট যোগ করা হলো যাতে রিয়েল-টাইম সার্চ ইঞ্জিন সচল হয়
  useEffect(() => {
    fetchArtworks();
  }, [category, sort, page, search]); 

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); 
    fetchArtworks();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* ১. পেজ হেডার এবং সার্চ বার ইঞ্জিন */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Explore Masterpieces
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Discover, buy, and collect premium artworks created by global independent artists.
          </p>
          
          <form onSubmit={handleSearchSubmit} className="mt-8 max-w-xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search by title or artist..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
            <button type="submit" className="px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition-all shadow-md">
              Search
            </button>
          </form>
        </div>

        {/* 🛠️ ২. [FIXED OPTION VALUES]: ডাটাবেস ভ্যালুর সাথে মিল রেখে ড্রপডাউন অপশন সিঙ্ক */}
        <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-6 mb-10 flex flex-wrap gap-6 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
              <SlidersHorizontal size={16} /> Filter by:
            </div>
            
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
            >
              <option value="all">All Categories</option>
              <option value="tutorial">Tutorial</option>
              <option value="tool">Tool / Asset</option>
              <option value="resource">Resource</option>
              <option value="article">Article</option>
              <option value="painting">Painting</option>
              <option value="digital">Digital Art</option>
              <option value="sculpture">Sculpture</option>
            </select>

            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min $"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-20 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-center text-white"
              />
              <span className="text-slate-600">-</span>
              <input
                type="number"
                placeholder="Max $"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-20 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-center text-white"
              />
              <button onClick={() => { setPage(1); fetchArtworks(); }} className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all">
                Apply
              </button>
            </div>
          </div>

          <div>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* ৩. গ্রিড লেআউট এবং কার্ড রেন্ডারিং */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-amber-500 mb-4" size={40} />
            <p className="text-slate-400">Loading gallery ecosystem...</p>
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/40 border border-slate-900 rounded-2xl w-full">
            <p className="text-slate-400 text-lg">No masterpieces match your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artworks.map((art) => (
              <div key={art._id} className="group bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-amber-500/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative">
                
                {art.isPremiumOnly && (
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase shadow-md z-10">
                    Pro Only
                  </span>
                )}

                <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
                  <img
                    src={art.featuredImage}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Link href={`/artwork/${art._id}`} className="p-3 bg-white text-slate-950 rounded-full hover:scale-110 transition-all shadow-lg">
                      <Eye size={18} />
                    </Link>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-500">
                      {art.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      By <span className="font-medium text-slate-300">{art.author?.name || "Anonymous Artist"}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800/60">
                    <span className="text-lg font-black text-white">
                      ${Number(art.price).toFixed(2)}
                    </span>
                    <Link href={`/artwork/${art._id}`} className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ৪. পেজিনেশন */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12 border-t border-slate-900 pt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="p-2 bg-slate-900 border border-slate-800 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-all text-slate-300"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-semibold text-slate-400">
              Page <span className="text-white font-bold">{page}</span> of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="p-2 bg-slate-900 border border-slate-800 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-all text-slate-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}