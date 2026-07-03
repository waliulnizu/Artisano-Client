"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-100">
        <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-black mb-2 text-slate-900">System Error</h2>
        <p className="text-slate-500 mb-8 font-medium">Something went wrong. Please try to reload.</p>
        
        <button
          onClick={() => reset()}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all"
        >
          <RefreshCcw size={18} />
          Reload
        </button>
      </div>
    </div>
  );
}
