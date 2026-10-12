"use client";

const FAQS = [
  { q: "Is Artisano free to use?", a: "Yes. Many resources are completely free for everyone. Premium assets require a VIP membership." },
  { q: "Can I sell my own artwork?", a: "Absolutely. Register as an Artist from the sign-up page, then upload assets from your Studio dashboard." },
  { q: "What does VIP include?", a: "VIP members get unlimited access to premium-only assets, early releases, and commercial-use licensing." },
  { q: "How do I download a resource?", a: "Open any artwork page and hit the Access Resource button. Premium resources require an active membership." },
];

export default function FaqSection() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-center mb-8">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {FAQS.map((f) => (
          <details key={f.q} className="group bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl px-5 py-4 shadow-sm">
            <summary className="cursor-pointer font-bold text-slate-900 dark:text-white text-sm list-none flex justify-between items-center">
              {f.q}
              <span className="text-slate-400 group-open:rotate-45 transition-transform text-lg">+</span>
            </summary>
            <p className="mt-3 text-sm text-slate-500 dark:text-zinc-400">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
