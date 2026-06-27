import React from "react";
import WishlistButton from "@/components/wishlist/WishlistButton";

export default function ArtworkMetadata({ artwork }) {
  return (
    <div>
      <div className="flex items-center justify-between w-full">
        <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
          {artwork.category}
        </span>
        <WishlistButton artworkId={artwork._id} />
      </div>

      <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3 capitalize">
        {artwork.title}
      </h1>
      
      <div className="flex items-center gap-2.5 mt-4 pb-4 border-b border-slate-100">
        <img 
          src={artwork.author?.profileImage || "https://i.ibb.co/4pDNDk1/avatar.png"} 
          alt={artwork.author?.name} 
          className="w-8 h-8 rounded-full object-cover border" 
        />
        <p className="text-xs font-bold text-slate-500">
          Created by <span className="text-slate-800 font-extrabold capitalize">{artwork.author?.name || "Artisan"}</span>
        </p>
      </div>

      <p className="text-slate-600 text-sm mt-6 leading-relaxed whitespace-pre-line">
        {artwork.description}
      </p>
    </div>
  );
}