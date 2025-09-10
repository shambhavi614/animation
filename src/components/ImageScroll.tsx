"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const images = [
  { src: "/assets/img1.jpg", side: "left" },
  { src: "/assets/car12.jpg", side: "right" },
  { src: "/assets/car13.jpg", side: "left" },
  { src: "/assets/car14.jpg", side: "right" },
];

export default function ImageScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLDivElement>(".scroll-image").forEach((el, i) => {
        const side = el.dataset.side as "left" | "right";

        gsap.fromTo(
          el,
          {
            x: side === "left" ? "-150%" : "150%",
            opacity: 0,
            zIndex: images.length - i, // overlapping effect
          },
          {
            x: "0%",
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              end: "top 40%",
              scrub: true,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black p-10"
    >
      <div className="relative w-full max-w-4xl h-[600px]">
        {images.map((img, i) => (
          <div
            key={i}
            className="scroll-image absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            data-side={img.side}
          >
            <img
              src={img.src}
              alt={`img-${i}`}
              className="w-[200px] h-auto rounded-lg shadow-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
