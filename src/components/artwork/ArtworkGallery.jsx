import React from "react";

export default function ArtworkGallery({ artwork }) {
  return (
    <div className="w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden bg-slate-50 border relative">
      <img 
        src={artwork.featuredImage} 
        alt={artwork.title} 
        className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300" 
      />
      
      {artwork.isSold ? (
        <span className="absolute top-4 left-4 bg-rose-600 text-white font-black text-xs px-4 py-1.5 rounded-xl shadow-md uppercase tracking-wider animate-pulse">
          🔴 SOLD OUT
        </span>
      ) : artwork.isPremiumOnly && (
        <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-black text-xs px-4 py-1.5 rounded-xl shadow-md uppercase tracking-wider">
          👑 PRO ACCESS
        </span>
      )}
    </div>
  );
}