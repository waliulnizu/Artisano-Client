import { NextResponse } from 'next/server';

// =========================================================================
// 🛡️ Next.js New Proxy Engine (Universal Cookie Reader Mode)
// =========================================================================
export function proxy(request) {
  
  // ১. স্ট্যান্ডার্ড উপায়ে কুকি রিড করার চেষ্টা
  let token = 
    request.cookies.get('token')?.value || 
    request.cookies.get('better-auth.session_token')?.value || 
    request.cookies.get('__secure-better-auth.session_token')?.value;

  // 👑 [CROSS-DOMAIN FALLBACK]: স্ট্যান্ডার্ড উপায়ে না পেলে র-হেডার থেকে কুকি পার্স করার ট্রিক
  if (!token) {
    const rawCookie = request.headers.get('cookie') || '';
    const match = rawCookie.match(/token=([^;]+)/);
    if (match) {
      token = match[1].trim();
    }
  }

  // ২. রিকোয়েস্টের বর্তমান ঠিকানা বের করা
  const currentPath = request.nextUrl.pathname;

  // ৩. পেজ গেটওয়ে ক্যাটাগরি ডিফাইন করা
  const isAuthPage = currentPath.startsWith('/login') || currentPath.startsWith('/register');
  const isProtectedPage = currentPath.startsWith('/dashboard') || currentPath === '/profile';

  // ৪. লজিক ১: লগইন করা না থাকলে প্রটেক্টেড পেজ ব্লক করে লগইনে পাঠানো
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ৫. লজিক ২: লগইন করা থাকলে লগইন পেজ ব্লক করে ড্যাশবোর্ডে পাঠানো (লুপ ব্রেকার 🚀)
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ৬. সব প্যারামিটার পাস হলে রিকোয়েস্টটিকে সামনের দিকে যেতে দাও
  return NextResponse.next();
}

// 🧭 প্রক্সি ফিল্টার কনফিগারেশন
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};