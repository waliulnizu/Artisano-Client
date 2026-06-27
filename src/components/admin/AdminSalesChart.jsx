"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";

export default function AdminSalesChart({ data }) {
  // যদি ডাটা না থাকে তবে ডামি বা ফলব্যাক চার্ট ডাটা (টেস্ট করার সুবিধার্থে)
  const chartData = data && data.length > 0 ? data : [
    { date: "Jun 21", Revenue: 120, Sales: 4 },
    { date: "Jun 22", Revenue: 250, Sales: 7 },
    { date: "Jun 23", Revenue: 180, Sales: 5 },
    { date: "Jun 24", Revenue: 410, Sales: 12 },
    { date: "Jun 25", Revenue: 300, Sales: 9 },
    { date: "Jun 26", Revenue: 560, Sales: 15 },
    { date: "Jun 27", Revenue: 490, Sales: 11 },
  ];

  return (
    <div className="w-full bg-white border border-slate-100 shadow-xl rounded-3xl p-6 space-y-8">
      <div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Platform Sales & Revenue Metrics</h3>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">Live visual tracking of commercial performance over the last 7 days.</p>
      </div>

      {/* 📊 ১. রেভিনিউ এরিয়া চার্ট (Revenue Growth) */}
      <div className="space-y-2">
        <p className="text-xs font-black text-slate-500 uppercase tracking-wider">💰 Gross Revenue Trend (USD)</p>
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }} />
              <Area type="monotone" dataKey="Revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 📊 ২. টোটাল সেলস বার চার্ট (Volume Check) */}
      <div className="space-y-2">
        <p className="text-xs font-black text-slate-500 uppercase tracking-wider">📦 Sales Volume (Units Secured)</p>
        <div className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }} />
              <Bar dataKey="Sales" fill="#10b981" radius={[6, 6, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}