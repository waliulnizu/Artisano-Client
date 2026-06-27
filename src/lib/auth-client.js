import { createAuthClient } from "better-auth/react"; // 🚀 FIX: /client বদলে /react ইম্পোর্ট করা হলো
import { API_URL } from "./constants";

// =========================================================================
// 👑 FIX: Better-Auth পিওর রিয়্যাক্ট ক্লায়েন্ট নোড
// =========================================================================
// 🧠 Developer Thought Process: 'better-auth/react' থেকে তৈরি করা ক্লায়েন্ট 
// স্বয়ংক্রিয়ভাবে নেক্সট জেএস অ্যাপের জন্য 'useSession()' এবং 'signOut()' হুকগুলো 
// মেমরিতে বিল্ট-ইন ইনজেক্ট করে দেয়। ফলে নেভবার ফাইল কোনো ক্র্যাশ ছাড়াই সচল হবে।
export const authClient = createAuthClient({
    baseURL: `${API_URL}/auth` // 🎯 আপনার ব্যাকঅ্যান্ড এক্সপ্রেস অ্যাপের অফিশিয়াল এপিআই গেটওয়ে
});