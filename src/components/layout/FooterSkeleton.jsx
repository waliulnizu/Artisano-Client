export default function FooterSkeleton() {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section Skeleton */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-slate-200 dark:bg-zinc-800 rounded-xl"></div>
              <div className="w-24 h-7 bg-slate-200 dark:bg-zinc-800 rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <div className="w-full max-w-[200px] h-4 bg-slate-200 dark:bg-zinc-800 rounded"></div>
              <div className="w-full max-w-[160px] h-4 bg-slate-200 dark:bg-zinc-800 rounded"></div>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800"></div>
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800"></div>
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800"></div>
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800"></div>
            </div>
          </div>

          {/* Quick Links Skeleton */}
          <div>
            <div className="w-24 h-5 bg-slate-200 dark:bg-zinc-800 rounded mb-4"></div>
            <ul className="space-y-4">
              <li className="w-32 h-4 bg-slate-200 dark:bg-zinc-800 rounded"></li>
              <li className="w-36 h-4 bg-slate-200 dark:bg-zinc-800 rounded"></li>
              <li className="w-40 h-4 bg-slate-200 dark:bg-zinc-800 rounded"></li>
              <li className="w-32 h-4 bg-slate-200 dark:bg-zinc-800 rounded"></li>
            </ul>
          </div>

          {/* Support Skeleton */}
          <div>
            <div className="w-20 h-5 bg-slate-200 dark:bg-zinc-800 rounded mb-4"></div>
            <ul className="space-y-4">
              <li className="w-24 h-4 bg-slate-200 dark:bg-zinc-800 rounded"></li>
              <li className="w-32 h-4 bg-slate-200 dark:bg-zinc-800 rounded"></li>
              <li className="w-28 h-4 bg-slate-200 dark:bg-zinc-800 rounded"></li>
              <li className="w-36 h-4 bg-slate-200 dark:bg-zinc-800 rounded"></li>
            </ul>
          </div>

          {/* Contact Info Skeleton */}
          <div>
            <div className="w-28 h-5 bg-slate-200 dark:bg-zinc-800 rounded mb-4"></div>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-slate-200 dark:bg-zinc-800 rounded shrink-0"></div>
                <div className="w-32 h-4 bg-slate-200 dark:bg-zinc-800 rounded"></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-slate-200 dark:bg-zinc-800 rounded shrink-0"></div>
                <div className="w-28 h-4 bg-slate-200 dark:bg-zinc-800 rounded"></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-slate-200 dark:bg-zinc-800 rounded shrink-0"></div>
                <div className="space-y-2">
                  <div className="w-40 h-4 bg-slate-200 dark:bg-zinc-800 rounded"></div>
                  <div className="w-24 h-4 bg-slate-200 dark:bg-zinc-800 rounded"></div>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar Skeleton */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-64 h-4 bg-slate-200 dark:bg-zinc-800 rounded"></div>
          <div className="flex items-center gap-6">
            <div className="w-12 h-4 bg-slate-200 dark:bg-zinc-800 rounded"></div>
            <div className="w-12 h-4 bg-slate-200 dark:bg-zinc-800 rounded"></div>
            <div className="w-16 h-4 bg-slate-200 dark:bg-zinc-800 rounded"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
