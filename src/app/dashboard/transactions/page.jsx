"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { CreditCard, Calendar, CheckCircle2, AlertTriangle, HelpCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/80 py-10 px-4 sm:px-8 text-slate-800">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <CreditCard size={20} className="text-slate-900" /> Billing & Transactions
            </h1>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">Monitor your premium billing invoices, memberships, and statements.</p>
          </div>
        </div>

        {/* Dynamic Table Layout */}
        {transactions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center shadow-sm">
            <HelpCircle size={36} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-400 font-bold text-xs">No payment records found on this account.</p>
            <p className="text-slate-300 text-[11px] mt-1">Once you purchase a VIP tier or asset, invoices will appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Package Details</th>
                    <th className="py-4 px-6">Transaction ID</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 px-6 font-black text-slate-900 max-w-[200px] truncate">{tx.packageName}</td>
                      <td className="py-4 px-6 font-mono text-slate-400 text-[11px]">{tx.transactionId}</td>
                      <td className="py-4 px-6 text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {new Date(tx.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-black text-slate-900">${tx.amount.toFixed(2)} {tx.currency}</td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          {tx.status === "succeeded" ? (
                            <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-md flex items-center gap-1 border border-emerald-200/50 text-[10px] uppercase tracking-wider">
                              <CheckCircle2 size={10} /> Success
                            </span>
                          ) : (
                            <span className="bg-rose-50 text-rose-700 font-bold px-2.5 py-1 rounded-md flex items-center gap-1 border border-rose-200/50 text-[10px] uppercase tracking-wider">
                              <AlertTriangle size={10} /> Failed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}