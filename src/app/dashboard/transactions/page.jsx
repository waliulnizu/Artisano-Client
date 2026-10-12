"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Crown,
  CreditCard,
  Loader2,
  ReceiptText,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { API_URL } from "@/lib/constants";

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_URL}/transactions/my-history`, { withCredentials: true });
      if (res.data.success) {
        setTransactions(res.data.data);
      }
    } catch (error) {
      console.error("Error loading payments:", error);
      toast.error("Failed to sync transaction statements.");
    } finally {
      setLoading(false);
    }
  };

  const handleTestPurchase = async () => {
    setBuying(true);
    try {
      const res = await axios.post(`${API_URL}/mock-payment/seed-invoice`, {}, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchTransactions();
      }
    } catch (error) {
      console.error("Test purchase error:", error);
      toast.error("Failed to inject mock payment.");
    } finally {
      setBuying(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const summary = useMemo(() => {
    const total = transactions
      .filter((tx) => tx.status === "succeeded")
      .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
    const artworkCount = transactions.filter((tx) => tx.type === "artwork").length;
    return { total, artworkCount };
  }, [transactions]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#5a6b48] dark:text-emerald-400" size={32} />
        <p className="text-xs font-bold text-slate-400">Syncing your billing ledger…</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-slate-800 dark:text-zinc-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-[#e9f0dc] dark:bg-emerald-950/50 text-[#4a5a3e] dark:text-emerald-300
                           text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
            <ReceiptText size={11} /> Secure Billing
          </span>
          <h1 className="font-display text-3xl sm:text-4xl tracking-tight mt-2">Purchase History</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
            Every acquisition receipt and membership charge, permanently recorded in your collector ledger.
          </p>
        </div>

        <button
          onClick={handleTestPurchase}
          disabled={buying}
          className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:border-[#5a6b48]
                     text-slate-700 dark:text-zinc-200 font-black text-xs px-4 py-2.5 rounded-xl transition-all
                     tracking-wide flex items-center gap-1.5 shadow-sm disabled:opacity-50 flex-shrink-0"
        >
          <Sparkles size={14} className="text-[#5a6b48]" /> {buying ? "Processing…" : "Purchase Test Package"}
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-700 p-14 text-center shadow-sm">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#e9f0dc] dark:bg-emerald-950/40 text-[#5a6b48] dark:text-emerald-300 mb-4">
            <CreditCard size={24} />
          </span>
          <p className="font-black text-sm">No purchases yet</p>
          <p className="text-slate-400 dark:text-zinc-500 text-xs mt-1.5 max-w-sm mx-auto leading-relaxed">
            When you acquire an artwork or upgrade your plan, every receipt shows up right here.
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center gap-1.5 mt-6 text-xs font-black bg-[#5a6b48] hover:bg-[#4c5b3d] text-white
                       px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#5a6b48]/25 active:scale-95"
          >
            Explore Artworks <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <>
          {/* Summary strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">Total Invested</p>
              <p className="font-display text-2xl mt-1">${summary.total.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">Masterpieces Acquired</p>
              <p className="font-display text-2xl mt-1">{summary.artworkCount}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">Ledger Entries</p>
              <p className="font-display text-2xl mt-1">{transactions.length}</p>
            </div>
          </div>

          {/* Ledger */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[680px]">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-zinc-800/60 border-b border-slate-100 dark:border-zinc-800
                                 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                    <th className="py-4 px-6">Masterpiece</th>
                    <th className="py-4 px-6">Receipt ID</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-zinc-800 text-xs text-slate-700 dark:text-zinc-300">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3 min-w-0">
                          {tx.artwork ? (
                            <img
                              src={tx.artwork.image}
                              alt={tx.artwork.title}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-100 dark:border-zinc-700 flex-shrink-0"
                            />
                          ) : (
                            <span className="w-11 h-11 rounded-xl bg-[#e9f0dc] dark:bg-emerald-950/40 text-[#5a6b48] dark:text-emerald-300
                                             flex items-center justify-center flex-shrink-0">
                              <Crown size={16} />
                            </span>
                          )}
                          <div className="min-w-0">
                            {tx.artwork ? (
                              <Link
                                href={`/artwork/${tx.artwork.id}`}
                                className="font-black text-slate-900 dark:text-white hover:text-[#5a6b48] transition-colors block truncate max-w-[220px]"
                              >
                                {tx.artwork.title}
                              </Link>
                            ) : (
                              <p className="font-black text-slate-900 dark:text-white truncate max-w-[220px]">{tx.label}</p>
                            )}
                            <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                              {tx.type === "artwork"
                                ? `Artwork${tx.artwork?.artist ? ` · ${tx.artwork.artist}` : ""}`
                                : "Membership subscription"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-mono text-slate-400 dark:text-zinc-500 text-[11px] max-w-[180px] truncate">
                        {tx.transactionId}
                      </td>

                      <td className="py-4 px-6 text-slate-400 dark:text-zinc-500 font-medium whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {new Date(tx.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-black text-slate-900 dark:text-white whitespace-nowrap">
                        ${Number(tx.amount || 0).toFixed(2)} <span className="text-[10px] text-slate-400">{tx.currency}</span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          <span
                            className={`font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border text-[10px] uppercase tracking-wider ${
                              tx.status === "succeeded"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
                                : tx.status === "pending"
                                  ? "bg-amber-50 text-amber-600 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900"
                                  : "bg-rose-50 text-rose-600 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900"
                            }`}
                          >
                            <CheckCircle2 size={10} /> {tx.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
