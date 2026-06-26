"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggler() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // React 19 ও SSR এর কারণে ফ্লিকারিং ঠেকাতে মাউন্ট চেকিং
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-9 h-9 bg-gray-100 dark:bg-zinc-800 rounded-xl animate-pulse" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-zinc-700 cursor-pointer"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-500 transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-600 transition-transform rotate-0 scale-100" />
      )}
    </button>
  );
}