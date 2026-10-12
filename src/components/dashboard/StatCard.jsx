"use client";

const TONES = {
  olive: "bg-[#e9f0dc] text-[#5a6b48] dark:bg-emerald-950/40 dark:text-emerald-300",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300",
};

export default function StatCard({ icon: Icon, tone = "olive", label, value, sub, className = "", children }) {
  return (
    <div
      className={`group relative overflow-hidden bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#5a6b48]/25 dark:hover:border-emerald-500/25 transition-all duration-300 ${className}`}
    >
      <span
        aria-hidden
        className="absolute -right-8 -top-10 w-28 h-28 rounded-full bg-[#e9f0dc] dark:bg-emerald-950/30 opacity-0 group-hover:opacity-60 blur-2xl transition-opacity duration-500"
      />
      <div className="relative">
        <span
          className={`inline-flex items-center justify-center w-11 h-11 rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${TONES[tone] || TONES.olive}`}
        >
          <Icon size={19} />
        </span>
        <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500 mt-4">{label}</p>
        {value !== undefined && (
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 leading-snug break-words">
            {value}
          </p>
        )}
        {sub && <p className="text-xs font-medium text-slate-400 dark:text-zinc-500 mt-1 leading-snug">{sub}</p>}
      </div>
      {children}
    </div>
  );
}
