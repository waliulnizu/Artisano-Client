import React from "react";
import { Lock } from "lucide-react";

export default function ArtworkLockGuard() {
  return (
    <div className="bg-amber-50/60 border border-amber-200 p-6 rounded-3xl flex flex-col items-center text-center gap-2 text-amber-900 shadow-sm max-w-xl mx-auto">
      <Lock size={24} className="text-amber-600 animate-bounce" />
      <h4 className="text-sm font-bold tracking-tight">Artisan Review Encryption Lock</h4>
      <p className="text-xs text-amber-700/90 max-w-sm">
        You can only join the review conversation and leave comments for this artwork after securing its commercial ownership.
      </p>
    </div>
  );
}