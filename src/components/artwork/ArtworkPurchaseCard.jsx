import React from "react";
import { Download, Loader2, ShoppingCart, ShieldCheck, Calendar } from "lucide-react";

export default function ArtworkPurchaseCard({ artwork, buyLoading, isAuthor, handleBuyArtwork }) {
  return (
    <div className="mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-5">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asset Commercial Value</p>
          <p className="text-3xl font-black text-slate-900 mt-0.5">${artwork.price || "0"} <span className="text-xs text-slate-400 font-medium">USD</span></p>
        </div>
        <div className="text-right text-xs font-bold text-slate-400 space-y-0.5">
          <p className="flex items-center gap-1 justify-end text-emerald-600"><ShieldCheck size={14} /> Verified Original</p>
          <p className="flex items-center gap-1 justify-end"><Calendar size={14} /> Published 2026</p>
        </div>
      </div>

      {artwork.price === 0 || artwork.isFree ? (
        <a 
          href={artwork.downloadUrl || "#"} 
          target="_blank"
          rel="noreferrer"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm transition-all"
        >
          <Download size={16} /> Download Free Resource 📥
        </a>
      ) : (
        <button
          onClick={handleBuyArtwork}
          disabled={buyLoading || artwork.isSold || isAuthor}
          className={`w-full font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm ${
            artwork.isSold || isAuthor
              ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
              : "bg-slate-900 hover:bg-slate-800 text-white hover:scale-[1.01] active:scale-[0.99]"
          }`}
        >
          {buyLoading ? (
            <><Loader2 size={16} className="animate-spin text-amber-400" /> Connecting Stripe Gate...</>
          ) : artwork.isSold ? (
            "Artwork Unavailable (Sold)"
          ) : isAuthor ? (
            "Your Own Artwork"
          ) : (
            <><ShoppingCart size={16} /> Instant Secure Purchase 🛒</>
          )}
        </button>
      )}

      <p className="text-[10px] text-center text-slate-400 mt-3">Payments encrypted securely. 100% Artist Proceeds Royalty Protected.</p>
    </div>
  );
}