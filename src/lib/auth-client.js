import { createAuthClient } from "better-auth/react"; // 🚀 FIX: /client বদলে /react ইম্পোর্ট করা হলো
import { API_URL } from "./constants";

// =========================================================================
// 👑 FIX: Better-Auth পিওর রিয়্যাক্ট ক্লায়েন্ট নোড (ডাইনামিক গেটওয়ে)
// =========================================================================
// 🧠 Developer Thought Process: প্রোডাকশনে ভিন্ন ডোমেইন (Vercel to Render) 
// থাকার কারণে Better-Auth-কে কঠোরভাবে অ্যাবসলিউট লাইভ ইউআরএল চেনাতে হবে।
// আমরা প্রথমে .env এর নির্দিষ্ট ভ্যারিয়েবল খুঁজব, না পেলে ফলব্যাক হিসেবে constants ব্যবহার করব।

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || `${API_URL}/api/auth`
});