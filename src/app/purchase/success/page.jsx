"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, LogIn, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";

import { API_URL } from "@/lib/constants";

const FALLBACK_AVATAR = "https://i.ibb.co/4pDNDk1/avatar.png";

// Receipts that could not be verified yet (usually because the collector was signed
// out when Stripe bounced them back) are parked here and reconciled automatically.
const PENDING_RECEIPT_KEY = "artisano:pendingReceipt";

function Center({ children }) {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center">
      {children}
    </div>
  );
}

function SuccessContent() {
  const [sessionId, setSessionId] = useState(null);
  const [status, setStatus] = useState("verifying"); // verifying | auth | done | error
  const [attempt, setAttempt] = useState(0);
  const [ready, setReady] = useState(false);
  const [masterpiece, setMasterpiece] = useState({ title: "Your Masterpiece", image: "" });
  const [collector, setCollector] = useState({ name: "Verified Collector", image: FALLBACK_AVATAR });
  const verifiedRef = useRef(false);

  // Prefer the receipt Stripe just handed us; otherwise fall back to one we parked
  // during an earlier, unauthenticated attempt so no payment is ever lost.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("session_id");
    setSessionId(fromUrl || window.localStorage.getItem(PENDING_RECEIPT_KEY));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!sessionId) {
      setStatus("error");
      return;
    }
    // React 18/19 StrictMode double-invokes effects — the server endpoint is
    // idempotent, but guard anyway so we never show duplicate toasts.
    if (verifiedRef.current) return;
    verifiedRef.current = true;

    (async () => {
      const verifyingToast = toast.loading("Securing your digital asset ownership… 🛡️");
      try {
        // 1) Verify the payment — the server reads artworkId/userId from Stripe's
        //    own session metadata, so nothing here can forge an acquisition.
        const verifyRes = await fetch(`${API_URL}/stripe/verify-single-purchase`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const verifyData = await verifyRes.json().catch(() => ({}));

        // Signed out mid-flight: park the receipt and finish the job after login
        // instead of dropping a payment we already charged for.
        if (verifyRes.status === 401) {
          window.localStorage.setItem(PENDING_RECEIPT_KEY, sessionId);
          toast.error("Please sign in to finish securing this acquisition.", { id: verifyingToast });
          setStatus("auth");
          return;
        }

        if (!verifyRes.ok || !verifyData.success) {
          throw new Error(verifyData.message || "Payment verification failed.");
        }

        window.localStorage.removeItem(PENDING_RECEIPT_KEY);

        // 2) Pull the certificate details for the receipt view.
        const [artRes, meRes] = await Promise.all([
          fetch(`${API_URL}/content/${verifyData.artworkId}`, { credentials: "include" }),
          fetch(`${API_URL}/auth/me`, { credentials: "include" }),
        ]);

        const artData = await artRes.json();
        const meData = await meRes.json();

        if (artData.success && artData.data) {
          setMasterpiece({
            title: artData.data.title,
            image: artData.data.featuredImage,
            id: artData.data._id,
          });
        }
        if (meData.success && meData.user) {
          setCollector({
            name: meData.user.name || "Verified Collector",
            image: meData.user.profileImage || meData.user.image || FALLBACK_AVATAR,
          });
        }

        setStatus("done");
        toast.success("Ownership verified & logged in the gallery ledger ✨", { id: verifyingToast });
      } catch (error) {
        console.error("Acquisition verification error:", error);
        toast.error(error.message || "Payment could not be verified.", { id: verifyingToast });
        setStatus("error");
      }
    })();
  }, [ready, sessionId, attempt]);

  const retryVerification = () => {
    verifiedRef.current = false;
    setStatus("verifying");
    setAttempt((n) => n + 1);
  };

  if (status === "verifying") {
    return (
      <Center>
        <Loader2 className="animate-spin text-[#5a6b48] dark:text-emerald-400" size={38} />
        <p className="mt-5 text-sm font-bold text-slate-500 dark:text-zinc-400">
          Securing your acquisition in the gallery ledger…
        </p>
      </Center>
    );
  }

  // Signed out when Stripe bounced back: the receipt is parked in this browser and
  // will be sealed automatically the next time this collector opens their vault.
  if (status === "auth") {
    return (
      <Center>
        <span className="w-20 h-20 rounded-3xl bg-[#e9f0dc] dark:bg-emerald-950/40 text-[#5a6b48] dark:text-emerald-300 flex items-center justify-center">
          <LogIn size={32} />
        </span>
        <h1 className="font-display text-3xl sm:text-4xl mt-6">One Step Left</h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-3 max-w-md leading-relaxed">
          Your payment is safe. Sign in with the same account you checked out with and this receipt will be
          sealed into your vault automatically.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-[#5a6b48] hover:bg-[#4c5b3d] text-white font-black text-xs px-5 py-3 rounded-full
                       shadow-md shadow-[#5a6b48]/25 transition-all"
          >
            <LogIn size={14} /> Sign In &amp; Secure It
          </Link>
          <Link
            href="/browse"
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 font-black text-xs px-5 py-3 rounded-full
                       hover:border-[#5a6b48] transition-all"
          >
            Back to Gallery
          </Link>
        </div>
      </Center>
    );
  }

  if (status === "error") {
    return (
      <Center>
        <span className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
          <ShieldCheck size={32} />
        </span>
        <h1 className="font-display text-3xl sm:text-4xl mt-6">Verification Unavailable</h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-3 max-w-md leading-relaxed">
          We could not confirm this payment session. If you were charged, your acquisition is safe —
          retry below and it will be logged in the gallery ledger.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={retryVerification}
            className="inline-flex items-center gap-2 bg-[#5a6b48] hover:bg-[#4c5b3d] text-white font-black text-xs px-5 py-3 rounded-full
                       shadow-md shadow-[#5a6b48]/25 transition-all"
          >
            <RefreshCw size={14} /> Retry Verification
          </button>
          <Link
            href="/dashboard"
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 font-black text-xs px-5 py-3 rounded-full
                       hover:border-[#5a6b48] transition-all"
          >
            Collector Dashboard
          </Link>
          <Link
            href="/browse"
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 font-black text-xs px-5 py-3 rounded-full
                       hover:border-[#5a6b48] transition-all"
          >
            Back to Gallery
          </Link>
        </div>
      </Center>
    );
  }

  return (
    <Center>
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[32px] shadow-sm p-8 sm:p-10 max-w-xl w-full">
        <span className="mx-auto w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
          <ShieldCheck size={34} />
        </span>

        <span className="mt-6 inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900
                         text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full">
          <Sparkles size={12} /> Provenance Certified
        </span>

        <h1 className="font-display text-4xl sm:text-5xl tracking-tight mt-4">Acquisition Confirmed</h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-3 max-w-md mx-auto leading-relaxed">
          Your acquisition has been completed and cryptographically logged in the gallery ledger.
        </p>

        {/* Certificate credentials */}
        <div className="bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700 rounded-3xl p-5 mt-7 text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-3">
            Certificate Credentials
          </p>

          <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-zinc-700/60">
            <span className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">Acquired Masterpiece</span>
            <span className="font-black text-sm sm:text-base capitalize text-right">{masterpiece.title}</span>
          </div>

          <div className="flex items-center justify-between gap-4 py-2">
            <span className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">Authenticated Collector</span>
            <span className="flex items-center gap-2 min-w-0">
              <img
                src={collector.image}
                alt={collector.name}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_AVATAR;
                }}
                className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
              />
              <span className="font-black text-sm sm:text-base truncate">{collector.name}</span>
            </span>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="mt-7 w-full bg-[#5a6b48] hover:bg-[#4c5b3d] text-white font-black py-4 rounded-2xl
                     flex items-center justify-center gap-2 text-sm shadow-md shadow-[#5a6b48]/25 transition-all"
        >
          View in Collector Dashboard <ArrowRight size={16} />
        </Link>

        <Link
          href="/browse"
          className="inline-block mt-4 text-xs font-black text-slate-500 dark:text-zinc-400 hover:text-[#5a6b48] transition-colors"
        >
          Explore More Salons
        </Link>
      </div>
    </Center>
  );
}

export default function PurchaseSuccessPage() {
  return (
    <Suspense
      fallback={
        <Center>
          <Loader2 className="animate-spin text-[#5a6b48] dark:text-emerald-400" size={32} />
        </Center>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
