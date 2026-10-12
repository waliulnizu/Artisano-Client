"use client";

import { useState } from "react";
import { User, Palette } from "lucide-react";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

export default function AuthRoleSelector() {
  const [selectedRole, setSelectedRole] = useState("user");

  return (
    <div className="w-full space-y-5">
      
      
      <div>
        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2.5 text-center">
          Select Your Access Priority
        </label>
        
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200/40">
          
          
          <button
            type="button"
            onClick={() => setSelectedRole("user")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedRole === "user"
                ? "bg-white text-blue-600 shadow-md ring-2 ring-blue-500 scale-[1.03]"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <User size={14} />
            <span>Digital Buyer</span>
          </button>

          
          <button
            type="button"
            onClick={() => setSelectedRole("artist")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedRole === "artist"
                ? "bg-white text-purple-600 shadow-md ring-2 ring-purple-500 scale-[1.03]"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Palette size={14} />
            <span>Asset Creator</span>
          </button>

        </div>
      </div>

      
      <GoogleAuthButton currentSelectedRole={selectedRole} />

      
      <p className="text-[11px] text-slate-400 font-medium text-center leading-relaxed px-4">
        {selectedRole === "artist" 
          ? "Securing creator studio node. You will be redirected to asset publishing blueprints."
          : "Configuring buyer vault node. You will be redirected to asset collection catalogs."
        }
      </p>

    </div>
  );
}