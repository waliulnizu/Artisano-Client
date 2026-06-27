"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client"; // আপনার কারেক্ট করা নতুন ক্লায়েন্ট ফাইল পাথ
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function GoogleAuthButton({ currentSelectedRole = "user" }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      // 👑 FIX: Google-এ যাওয়ার আগেই role cookie-তে save করো
      // OAuth redirect flow-এ headers/query নষ্ট হয়, কিন্তু cookie থাকে
      document.cookie = `pending_role=${currentSelectedRole}; path=/; max-age=300; SameSite=Lax`;

      await authClient.signIn.social({
        provider: "google",
        // 👑 FIX: হার্ডকোড করা লোকালহোস্টের বদলে ডাইনামিক অরিজিন ব্যবহার করা হলো 
        // এতে Vercel থেকে লগইন করলে Vercel-এই ফিরে আসবে, আর লোকাল থেকে করলে লোকালে।
        callbackURL: `${window.location.origin}/dashboard`,
      });

    } catch (error) {
      console.error("Google Auth execution error:", error);
      toast.error("Social authentication node failed to initialize.");
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isSubmitting}
      className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 border border-slate-200 rounded-xl text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="animate-spin text-slate-500" size={18} />
          <span className="text-slate-500">Connecting to Google Vault...</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.33 2.69 1.45 6.614l3.816 3.151z"/>
            <path fill="#4285F4" d="M23.49 12.275c0-.796-.073-1.564-.205-2.304H12v4.359h6.44c-.277 1.478-1.11 2.73-2.36 3.573l3.664 2.84c2.14-1.973 3.37-4.877 3.37-8.468z"/>
            <path fill="#FBBC05" d="M5.266 14.235L1.45 17.386C3.33 21.31 7.33 24 12 24c3.055 0 5.782-1.014 7.71-2.755l-3.665-2.84c-1.11.745-2.527 1.186-4.045 1.186-3.836 0-7.077-2.591-8.234-6.156z"/>
            <path fill="#34A853" d="M1.45 6.614A11.895 11.895 0 000 12c0 1.94.464 3.773 1.45 5.386l4.73-3.905A7.013 7.013 0 016 12c0-1.11.259-2.155.716-3.095L1.45 6.614z"/>
          </svg>
          <span className="text-slate-800 font-bold">Continue with Google</span>
        </>
      )}
    </button>
  );
}