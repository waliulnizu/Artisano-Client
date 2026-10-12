import "./globals.css";
import { Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";

import Footer from "@/components/layout/Footer";

// 🎨 Serif display face for gallery headings (detail page, dashboard, confirmations).
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  title: "Artisano",
  description: "Join our community of artists and art lovers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={playfair.variable}>

      <body className="bg-[#e9f0dc] dark:bg-zinc-950 min-h-screen flex flex-col transition-colors duration-300">


        <ThemeProvider>


          <Navbar />


          <main className="flex-grow">
            <Toaster />
            {children}
          </main>


          <Footer />


        </ThemeProvider>

      </body>
    </html>
  );
}
