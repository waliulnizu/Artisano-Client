"use client";

import { useState, useEffect } from "react";
import { API_URL } from "../../lib/constants";
import { Search, Loader2, ChevronLeft, ChevronRight, Eye, Heart, SlidersHorizontal, LayoutGrid, Filter } from "lucide-react";
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
  const [liked, setLiked] = useState({});

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCategory = params.get("category");
    if (urlCategory) {
      setCategory(urlCategory.toLowerCase());
      setPage(1);
    }
    const urlSearch = params.get("search");
    if (urlSearch) setSearch(urlSearch);
  }, []);

  useEffect(() => {
    fetchArtworks();
  }, [category, sort, page, search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchArtworks();
  };

  return (
    <div className="min-h-screen bg-[#f7f5ef] dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 py-14 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#4a5a3e] dark:text-white">
            Browse Artworks
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#8a9278] dark:text-zinc-400 max-w-2xl mx-auto">
            Discover unique pieces from talented artists around the world.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter sidebar card */}
          <aside className="w-full lg:w-72 flex-shrink-0 bg-[#fbf9f4] dark:bg-zinc-900 border border-[#ece7db] dark:border-zinc-800 rounded-3xl p-7 h-fit sticky top-24 shadow-sm">
            <div className="space-y-7">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-[#8a9278] dark:text-zinc-500 mb-3">Search</p>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-4 top-3.5 text-[#a8ad97]" size={16} />
                  <input
                    type="text"
                    placeholder="Title or artist..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-800 border border-[#ece7db] dark:border-zinc-700 rounded-2xl text-sm text-slate-700 dark:text-zinc-200 placeholder-[#b3b8a3] focus:outline-none focus:ring-2 focus:ring-[#b9c4a3]"
                  />
                </form>
              </div>

              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-[#8a9278] dark:text-zinc-500 mb-3">Sort By</p>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-[#ece7db] dark:border-zinc-700 rounded-2xl text-sm text-slate-700 dark:text-zinc-200 focus:outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-[#8a9278] dark:text-zinc-500 mb-3">Category</p>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-[#ece7db] dark:border-zinc-700 rounded-2xl text-sm text-slate-700 dark:text-zinc-200 focus:outline-none"
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
              </div>

              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-[#8a9278] dark:text-zinc-500 mb-3">Price Range ($)</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-3 bg-white dark:bg-zinc-800 border border-[#ece7db] dark:border-zinc-700 rounded-2xl text-sm text-center text-slate-700 dark:text-zinc-200 focus:outline-none"
                  />
                  <span className="text-[#b3b8a3]">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-3 bg-white dark:bg-zinc-800 border border-[#ece7db] dark:border-zinc-700 rounded-2xl text-sm text-center text-slate-700 dark:text-zinc-200 focus:outline-none"
                  />
                </div>
                <button onClick={() => { setPage(1); fetchArtworks(); }} className="mt-3 w-full bg-[#5a6b48] hover:bg-[#48573a] text-white text-xs font-bold py-2.5 rounded-2xl transition">
                  Apply
                </button>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="animate-spin text-[#5a6b48] mb-4" size={40} />
                <p className="text-[#8a9278]">Loading gallery...</p>
              </div>
            ) : artworks.length === 0 ? (
              <div className="text-center py-24 bg-[#fbf9f4] dark:bg-zinc-900 border border-[#ece7db] dark:border-zinc-800 rounded-3xl">
                <p className="text-[#8a9278] text-lg">No artworks match your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
                {artworks.map((art) => (
                  <div key={art._id} className="group bg-[#fbf9f4] dark:bg-zinc-900 border border-[#ece7db] dark:border-zinc-800 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-[#5a6b48]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    <div className="relative aspect-[4/3] w-full bg-[#efece3] dark:bg-zinc-800 overflow-hidden">
                      <img
                        src={art.featuredImage}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {art.isPremiumOnly ? (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-md z-10 tracking-wide">
                          PRO
                        </span>
                      ) : (
                        <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-md z-10 tracking-wide">
                          FREE
                        </span>
                      )}
                      <span className="absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur text-slate-800 dark:text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-sm">
                        ${Number(art.price || 0).toFixed(0)}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-black text-slate-800 dark:text-white line-clamp-1">
                          {art.title}
                        </h3>
                        <p className="text-xs text-[#8a9278] dark:text-zinc-400 mt-1.5 flex items-center gap-1.5">
                          <img
                            src={art.author?.profileImage || "https://i.ibb.co/4pDNDk1/avatar.png"}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover border border-[#e4dfcf]"
                          />
                          by <span className="font-bold text-slate-700 dark:text-zinc-200">{art.author?.name || "Anonymous"}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#ece7db] dark:border-zinc-800">
                        <Link href={`/artwork/${art._id}`} className="text-xs font-bold text-[#5a6b48] dark:text-emerald-300 bg-[#e9e6d8] dark:bg-emerald-950/30 hover:bg-[#dcd8c6] dark:hover:bg-emerald-950/50 px-4 py-2 rounded-full transition">
                          View Artwork
                        </Link>
                        <button
                          onClick={() => setLiked((prev) => ({ ...prev, [art._id]: !prev[art._id] }))}
                          className={`p-2.5 rounded-full transition ${liked[art._id] ? "bg-red-50 dark:bg-red-950/30 text-red-500" : "bg-[#e9e6d8] dark:bg-zinc-800 text-[#5a6b48] dark:text-zinc-300 hover:bg-[#dcd8c6]"}`}
                          aria-label="Save to wishlist"
                        >
                          <Heart size={16} className={liked[art._id] ? "fill-red-500" : ""} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12 pt-8 border-t border-[#ece7db] dark:border-zinc-800">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="p-2.5 bg-[#fbf9f4] dark:bg-zinc-900 border border-[#ece7db] dark:border-zinc-800 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#efece3] transition-all text-[#5a6b48]"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm font-semibold text-[#8a9278]">
                  Page <span className="text-slate-800 dark:text-white font-bold">{page}</span> of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  className="p-2.5 bg-[#fbf9f4] dark:bg-zinc-900 border border-[#ece7db] dark:border-zinc-800 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#efece3] transition-all text-[#5a6b48]"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
