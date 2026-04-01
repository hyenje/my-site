"use client";
import { useEffect } from "react";

export default function FadeObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll("[data-fade]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
