"use client";

import { useState } from "react";
import { Crown, CheckCircle2, ShieldCheck, Sparkles, Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VIPRoomPage() {
  const [loadingTier, setLoadingTier] = useState(null);

  const tiers = [
    {
      name: "Starter Spark",
      price: "0",
      description: "Perfect for casual digital art enthusiasts exploring the Artisano gallery.",
      features: [
        "Access to all Free assets & content",
        "Standard download streams (Max 3/day)",
        "Global community review system access",
        "Basic profile customization nodes"
      ],
      buttonText: "Current Free Tier",
      premium: false,
      color: "border-slate-200 text-slate-800 bg-white",
      icon: <Zap className="text-slate-400" size={24} />
    },
    {
      name: "VIP Premium Pro",
      price: "29",
      description: "Our signature tier. Unlock limitless possibilities and premium masterclasses.",
      features: [
        "Unlimited downloads across all Premium assets",
        "Exclusive access to the VIP Room Vault",
        "10GB Premium Creator Storage limit",
        "Prioritized Cloudinary image processing streams",
        "Verified VIP Creator Badges on profile"
      ],
      buttonText: "Upgrade to VIP Pro",
      premium: true,
      color: "border-purple-200 text-purple-900 bg-gradient-to-b from-purple-50/50 to-white shadow-xl shadow-purple-500/5 ring-2 ring-purple-600/10",
      icon: <Crown className="text-purple-600 animate-pulse" size={24} />
    },
    {
      name: "Studio Enterprise",
      price: "99",
      description: "Tailored for studio teams and high-end digital agencies.",
      features: [
        "Everything in VIP Premium Pro included",
        "Multi-seat organization clearance tokens",
        "Direct API token access endpoints",
        "Dedicated account oversight manager"
      ],
      buttonText: "Contact Sales Node",
      premium: false,
      color: "border-slate-900 text-slate-900 bg-slate-950 text-white",
      icon: <ShieldCheck className="text-amber-400" size={24} />
    }
  ];

  const handleCheckoutTrigger = (tierName) => {
    setLoadingTier(tierName);
    // 🎯 [FUTURE STRIPE INJECTION NODE]: 
    // স্ট্রাইপ ইন্টিগ্রেশনের সময় এখানে আমাদের এপিআই কলটি গিয়ে ট্রিগার হবে ভাই!
    setTimeout(() => {
      alert(`Stripe Gateway connecting for ${tierName}...`);
      setLoadingTier(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Navigation Breadcrumb */}
        <div className="flex justify-between items-center">
          <Link href="/dashboard" className="text-xs font-black bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 border border-slate-200/60 shadow-sm">
            <ArrowLeft size={14} /> Return to Dashboard
          </Link>
        </div>

        {/* Header Content Panel */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-200/50 px-3 py-1.5 rounded-full text-purple-700 text-[10px] font-black tracking-widest uppercase">
            <Sparkles size={12} className="fill-purple-500" /> Artisano Premium Vault
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Elevate Your Creative <span className="text-purple-600">Clearance Node</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
            Unlock professional-grade digital assets, premium curation metrics, and infinite download vectors. Choose your clearance layer.
          </p>
        </div>

        {/* 📊 Luxury Pricing Tiers Grid Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`border rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${tier.color}`}
            >
              {/* Badge for VIP Tier */}
              {tier.premium && (
                <div className="absolute top-0 right-0 bg-purple-600 text-white font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow-sm">
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                {/* Tier Top Section */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black tracking-tight">{tier.name}</h3>
                    <p className={`text-xs mt-1 font-medium ${tier.price === "99" ? "text-slate-400" : "text-slate-500"}`}>{tier.description}</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex-shrink-0">
                    {tier.icon}
                  </div>
                </div>

                {/* Pricing Block */}
                <div className="pt-2 flex items-baseline">
                  <span className="text-4xl font-black tracking-tighter">${tier.price}</span>
                  <span className={`text-xs font-bold ml-1 ${tier.price === "99" ? "text-slate-400" : "text-slate-500"}`}>/ month</span>
                </div>

                {/* Features Checklist Node */}
                <ul className="space-y-3.5 pt-4 border-t border-slate-100/60">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs font-semibold">
                      <CheckCircle2 size={16} className={`flex-shrink-0 mt-0.5 ${tier.premium ? "text-purple-600" : tier.price === "99" ? "text-amber-400" : "text-slate-400"}`} />
                      <span className={tier.price === "99" ? "text-slate-200" : "text-slate-600"}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button Trigger */}
              <div className="pt-8">
                <button
                  type="button"
                  disabled={loadingTier !== null || tier.price === "0"}
                  onClick={() => handleCheckoutTrigger(tier.name)}
                  className={`w-full font-black text-xs py-3 rounded-xl uppercase transition-all tracking-wider flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-40 ${
                    tier.price === "0" 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border" 
                      : tier.premium 
                      ? "bg-purple-600 hover:bg-purple-700 text-white" 
                      : "bg-white hover:bg-slate-50 text-slate-900 border border-slate-200"
                  }`}
                >
                  {loadingTier === tier.name ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    tier.buttonText
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}