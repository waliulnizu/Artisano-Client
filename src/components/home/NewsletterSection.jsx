"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Subscribed! Welcome to the Artisano newsletter.");
    setEmail("");
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
      <div className="rounded-3xl border border-slate-100 dark:border-zinc-800 bg-slate-900 dark:bg-zinc-900 p-8 sm:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Stay in the loop</h2>
        <p className="text-slate-400 text-sm mt-2 mb-6">Get new asset drops and artist spotlights straight to your inbox.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 bg-zinc-800 text-white placeholder-zinc-500 text-sm px-4 py-3 rounded-2xl border border-zinc-700 focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-6 py-3 rounded-2xl transition">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
