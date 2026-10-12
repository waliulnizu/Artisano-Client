"use client";

import { useEffect } from "react";

export default function ScrollAnimator() {
  useEffect(() => {
    const targets = document.querySelectorAll(
      "section, .animate-on-scroll"
    );
    targets.forEach((el, index) => {
      el.style.transitionDelay = "80ms";
      el.classList.add("opacity-0", "translate-y-16", "transition-all", "duration-1000", "ease-out", "will-change-transform");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.remove("opacity-0", "translate-y-16");
              entry.target.classList.add("opacity-100", "translate-y-0");
            }, 120);
          } else {
            entry.target.classList.remove("opacity-100", "translate-y-0");
            entry.target.classList.add("opacity-0", "translate-y-16");
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
