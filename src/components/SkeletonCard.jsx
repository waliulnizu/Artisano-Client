export default function SkeletonCard() {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 space-y-4 animate-pulse">
      {/* ইমেজ এরিয়া কঙ্কাল */}
      <div className="w-full h-52 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
      
      {/* টাইটেল এরিয়া কঙ্কাল */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded-md w-2/3"></div>
        <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded-md w-1/2"></div>
      </div>

      {/* ফুটার/প্রাইস এরিয়া কঙ্কাল */}
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded-md w-1/4"></div>
        <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded-lg w-1/3"></div>
      </div>
    </div>
  );
}