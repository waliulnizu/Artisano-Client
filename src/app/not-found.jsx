"use client";

import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4 transition-colors duration-300">
      <div className="text-center space-y-6 max-w-md">
        {/* আর্টওয়ার্ক স্টাইলের অ্যানিমেটেড আইকন */}
        <div className="inline-flex p-4 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full animate-bounce">
          <Compass className="h-12 w-12" />
        </div>

        {/* এরর কোড ও মেসেজ */}
        <div className="space-y-2">
          <h1 className="text-8xl font-black tracking-extrawide text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            404
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
            Art Space Not Found!
          </h2>
          <p className="text-gray-500 dark:text-zinc-400 text-sm sm:text-base">
            আপনি যে সৃজনশীল ক্যানভাসটি খুঁজছেন, সেটি হয়তো আর্ট গ্যালারি থেকে সরিয়ে নেওয়া হয়েছে অথবা লিংকটি ভুল ছিল।
          </p>
        </div>

        {/* ব্যাক টু হোম বাটন */}
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20 dark:shadow-none transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
            গ্যালারিতে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}