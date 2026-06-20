import "./globals.css";
import Navbar from "@/components/layout/Navbar"; // 📌 ১. Navbar ইমপোর্ট করলাম
import { Toaster } from "react-hot-toast";
export const metadata = {
  title: "Artisano",
  description: "Join our community of artists and art lovers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        {/* 📌 ২. ওয়েবসাইটের একদম উপরে Navbar বসিয়ে দিলাম */}
        <Navbar />
        
        {/* মেইন কন্টেন্ট (যেমন: লগইন পেজ, হোমপেজ) এখানে রেন্ডার হবে */}
        <main className="flex-grow">
          <Toaster />
          {children}
        </main>
      </body>
    </html>
  );
}