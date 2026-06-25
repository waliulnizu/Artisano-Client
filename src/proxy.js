import { NextResponse } from 'next/server';

// =========================================================================
// 🛡️ Next.js New Proxy Engine (Frontend Route Protector)
// =========================================================================

// 👑 FIX: নেক্সট জেএস ১৬+ এর নিয়ম অনুযায়ী ফাংশনের নাম 'proxy' করা হলো (এরর ফিক্স 🚀)
export function proxy(request) {
  
  // =========================================================================
  // 👑 FIX: ট্র্যাডিশনাল টোকেন এবং Better-Auth সেশন কুকি ডাবল-ডিটেকশন চেইন
  // =========================================================================
  // 🧠 Developer Thought Process: আপনার ওল্ড ইমেইল-পাসওয়ার্ড সিস্টেমের 'token' এবং 
  // Better-Auth এর 'better-auth.session_token' (লোকাল ও সিকিউর প্রোডাকশন মোড)—সবগুলো কুকিই 
  // এখানে একসাথে চেক করা হলো। এর ফলে যেকোনো একটা সেশন পেলেই প্রক্সি ইউজারকে চিনে ফেলবে 
  // এবং সেই মারাত্মক রিফ্রেশ লুপ ও জ্যাম চিরতরে ভেঙে যাবে।
  const token = 
    request.cookies.get('token')?.value || 
    request.cookies.get('better-auth.session_token')?.value || 
    request.cookies.get('__secure-better-auth.session_token')?.value;

  // ২. রিকোয়েস্টের বর্তমান ঠিকানা (URL Path) বের করা
  const currentPath = request.nextUrl.pathname;

  // ৩. কোন পেজগুলো লগইন ছাড়া দেখা যাবে না, আর কোনগুলো যাবে, তা ডিফাইন করা
  const isAuthPage = currentPath.startsWith('/login') || currentPath.startsWith('/register');
  const isProtectedPage = currentPath.startsWith('/dashboard') || currentPath === '/profile';

  // ৪. লজিক ১: ইউজার যদি লগইন করা না থাকে এবং প্রটেক্টেড পেজে যেতে চায়
  if (isProtectedPage && !token) {
    // তাকে রিডাইরেক্ট করে লগইন পেজে পাঠিয়ে দাও
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ৫. লজিক ২: ইউজার যদি লগইন করা থাকে, কিন্তু আবার লগইন বা রেজিস্ট্রেশন পেজে যেতে চায়
  if (isAuthPage && token) {
    // তাকে রিডাইরেক্ট করে সরাসরি সিকিউর ড্যাশবোর্ডে পাঠিয়ে দাও (লুপ ব্রেকার 🚀)
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ৬. সব ঠিক থাকলে রিকোয়েস্টটিকে সামনের দিকে যেতে দাও
  return NextResponse.next();
}

// ৭. কনফিগারেশন: প্রক্সি কোন কোন লিংকের জন্য কাজ করবে
export const config = {
  // Negative Matching: API, ছবি এবং স্ট্যাটিক ফাইল বাদে সব পেজে এই প্রক্সি চলবে
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};