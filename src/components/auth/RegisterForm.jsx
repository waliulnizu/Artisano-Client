"use client"; // ১. Next.js কে বলা হচ্ছে এটি ক্লায়েন্ট সাইডে চলবে

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { API_URL } from "../../lib/constants";

// ২. Zod Schema: ফর্মের রুলস সেট করা
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function RegisterForm() {
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // ৩. react-hook-form ইনিশিয়ালাইজ করা
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema), // Zod এর রুলসগুলো হুক ফর্মের সাথে জুড়ে দেওয়া হলো
  });

  // ৪. ফর্ম সাবমিট হওয়ার পর এই ফাংশনটি চলবে
  const onSubmit = async (data) => {
    try {
      setServerError("");
      // এখানে আমরা ব্যাকএন্ডের API কে কল করব (যা আমরা আগে বানিয়েছি)
      console.log("Submitting to backend:", data);
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      console.log("Registration Successful!", result);
      // সফল হলে ইউজারকে লগইন পেজে পাঠিয়ে দেওয়া হবে (পরে যোগ করব)
      
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
      
      {serverError && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center">
          {serverError}
        </div>
      )}

      {/* ৫. handleSubmit ফর্মের ডিফল্ট রিলোড বন্ধ করে onSubmit কে ডেটা পাস করে */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            {...register("name")} // ৬. ইনপুটকে hook-form এর সাথে কানেক্ট করা
            type="text"
            className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="John Doe"
          />
          {/* এরর থাকলে দেখানো হবে */}
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            {...register("email")}
            type="email"
            className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          
          {/* ইনপুটের চারপাশে একটি relative div নিলাম, যাতে আইকনটিকে absolute করে এর ভেতরে ভাসিয়ে রাখা যায় */}
          <div className="relative mt-1">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"} // ডায়নামিক টাইপ: সুইচ অন থাকলে text, অফ থাকলে password
              className="w-full pl-4 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400"
              placeholder="Enter your password" // প্লেসহোল্ডার চেঞ্জ করে সুন্দর একটি টেক্সট দিলাম
            />
            
            {/* Eye Icon Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // ক্লিক করলে সুইচ উল্টে যাবে (true থাকলে false হবে)
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? (
                // চোখ খোলা আইকন (Eye Open SVG)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                // চোখ বন্ধ আইকন (Eye Close SVG)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              )}
            </button>
          </div>

          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting} // সাবমিট হওয়ার সময় বাটন ডিজেবল থাকবে
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}