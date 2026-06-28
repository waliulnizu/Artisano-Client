"use client";

import Link from "next/link";
// 🚀 [MODERN LUCIDE FIX]: লাইব্রেরি আপডেট করায় সব স্ট্যান্ডার্ড নাম (Facebook, Twitter) এখন সরাসরি কার্যকর
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Palette, 
  Mail, 
  MapPin, 
  Phone 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-blue-600 rounded-xl group-hover:bg-blue-700 transition-colors">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Artisano
              </span>
            </Link>
            <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed max-w-xs">
              A premium marketplace for digital buyers and asset creators. Discover, collect, and sell extraordinary digital art.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <SocialLink href="#" icon={<Twitter className="w-4 h-4" />} />
              <SocialLink href="#" icon={<Facebook className="w-4 h-4" />} />
              <SocialLink href="#" icon={<Instagram className="w-4 h-4" />} />
              <SocialLink href="#" icon={<Linkedin className="w-4 h-4" />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <FooterLink href="/browse" text="Explore Artworks" />
              <FooterLink href="/dashboard" text="Creator Dashboard" />
              <FooterLink href="/vip-room" text="VIP Collector's Room" />
              <FooterLink href="/premium" text="Premium Subscriptions" />
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Support</h3>
            <ul className="space-y-3">
              <FooterLink href="#" text="Help Center" />
              <FooterLink href="#" text="Terms of Service" />
              <FooterLink href="#" text="Privacy Policy" />
              <FooterLink href="#" text="Report an Issue" />
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-zinc-400">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <span>support@artisano.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-zinc-400">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-zinc-400">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                <span>123 Art Avenue, Design District<br />New York, NY 10001</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} Artisano Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-zinc-500">
            <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper component for social icons
function SocialLink({ href, icon }) {
  return (
    <a 
      href={href}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-300 shadow-sm"
    >
      {icon}
    </a>
  );
}

// Helper component for text links
function FooterLink({ href, text }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-sm text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
      >
        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700 group-hover:bg-blue-500 transition-colors"></span>
        {text}
      </Link>
    </li>
  );
}