import "./globals.css";
import Navbar from "@/components/layout/Navbar"; // 📌 ১. Navbar ইমপোর্ট করলাম
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";

import Footer from "@/components/layout/Footer"; // 📌 ফুটার ইমপোর্ট করা হলো

export const metadata = {
  title: "Artisano",
  description: "Join our community of artists and art lovers",
};

export default function RootLayout({ children }) {
  return (
    // 👑 [HYDRO FIX]: suppressHydrationWarning দেওয়া হলো যাতে ব্রাউজার ও সার্ভার থিম ক্লাসের মিল সেকেন্ডে কোনো এরর না দেয়
    <html lang="en" suppressHydrationWarning>
      {/* 🌙 Tailwind v4 এর জন্য বডিতে 'dark:bg-zinc-950' এবং স্মুথ অ্যানিমেশনের জন্য transition ক্লাস যুক্ত করা হলো */}
      <body className="bg-gray-50 dark:bg-zinc-950 min-h-screen flex flex-col transition-colors duration-300">
        
        {/* 👑 [THE ORDER FIX]: থিম প্রোভাইডারকে সবার উপরে মুড়িয়ে দেওয়া হলো যাতে Navbar-ও এর ভেতরের ডেটা অ্যাক্সেস করতে পারে */}
        <ThemeProvider>
          
          {/* 📌 ২. ওয়েবসাইটের একদম উপরে Navbar (এখন থিমের ছাতার নিচে ১০০% নিরাপদ) */}
          <Navbar />
          
          {/* মেইন কন্টেন্ট (যেমন: লগইন পেজ, হোমপেজ) এখানে রেন্ডার হবে */}
          <main className="flex-grow">
            <Toaster />
            {children}
          </main>

          {/* 📌 ফুটার যুক্ত করা হলো */}
          <Footer />
          
        </ThemeProvider>

      </body>
    </html>
  );
}