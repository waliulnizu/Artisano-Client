import SkeletonCard from "./SkeletonCard";

export default function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Hero Banner Skeleton */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Explore Creative Art Assets 🎨
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
            Discover high-quality tutorials, premium brushes, and raw resources built by professional digital artists.
          </p>
        </div>

        {/* Dynamic Feed Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
