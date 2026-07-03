export default function NavbarSkeleton() {
  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 p-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center animate-pulse">
        
        {/* বাম পাশ: লোগো এবং লিংক স্কেলিটন */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-8 bg-slate-200 dark:bg-zinc-700 rounded-lg"></div>
          <div className="hidden sm:block w-32 h-8 bg-slate-200 dark:bg-zinc-700 rounded-xl"></div>
        </div>

        {/* ডান পাশ: আইকন, প্রোফাইল এবং বাটন স্কেলিটন */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="sm:hidden w-6 h-6 bg-slate-200 dark:bg-zinc-700 rounded-full"></div>
          
          {/* থিম টগল স্কেলিটন */}
          <div className="w-8 h-8 bg-slate-200 dark:bg-zinc-700 rounded-xl"></div>

          {/* লিংকস স্কেলিটন */}
          <div className="hidden md:block w-20 h-6 bg-slate-200 dark:bg-zinc-700 rounded-lg"></div>
          <div className="hidden sm:block w-24 h-8 bg-slate-200 dark:bg-zinc-700 rounded-xl"></div>

          {/* প্রোফাইল এবং লগআউট স্কেলিটন */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-200 dark:bg-zinc-700 rounded-full"></div>
              <div className="hidden sm:block w-16 h-4 bg-slate-200 dark:bg-zinc-700 rounded-md"></div>
            </div>
            <div className="w-6 h-6 bg-slate-200 dark:bg-zinc-700 rounded-md"></div>
          </div>
        </div>
        
      </div>
    </nav>
  );
}
