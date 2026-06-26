import SkeletonCard from "@/components/SkeletonCard";

export default function Loading() {
  // ডাটা লোড হওয়ার সময় অটোমেটিক এই ৮টি কঙ্কাল কার্ড স্ক্রিনে ভেসে উঠবে
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* হেডার কঙ্কাল */}
      <div className="space-y-2 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded-md w-1/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded-md w-1/3"></div>
      </div>

      {/* আর্টওয়ার্ক গ্রিড কঙ্কাল */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}