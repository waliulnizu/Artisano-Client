import { NextResponse } from 'next/server';

// ==========================================
// 🛡️ Next.js Proxy (Frontend Route Protector)
// ==========================================

export function proxy(request) {
  // ১. ব্রাউজারের কুকি থেকে 'token' খুঁজে বের করা
  const token = request.cookies.get('token')?.value;

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
    // তাকে রিডাইরেক্ট করে হোমপেজে বা ড্যাশবোর্ডে পাঠিয়ে দাও
    return NextResponse.redirect(new URL('/', request.url));
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