"use client";

import { useEffect, useRef, forwardRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

// ---- Card component ----
type CardProps = {
  id: string;
  frontSrc: string;
  frontAlt: string;
  backText: string;
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ id, frontSrc, frontAlt, backText }, ref) => {
    return (
      <div
        className="card"
        id={id}
        ref={ref}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          cursor: "pointer",
          width: "90vw",   // Increased width
          height: "90vh",  // Increased height
          maxWidth: "600px",  // Optional max width to control very large screens
          maxHeight: "900px", // Optional max height
        }}
      >
        <div className="card-wrapper" style={{ width: "100%", height: "100%", position: "relative" }}>
          <div className="flip-card-inner" style={{ width: "100%", height: "100%" }}>
            <div className="flip-card-front" style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image
                priority
                src={frontSrc}
                alt={frontAlt}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="flip-card-back" style={{ width: "100%", height: "100%" }}>
              <p>{backText}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Card.displayName = "Card";

// ---- Card Section ----
export default function CardSection() {
  const container = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const hasSpread = useRef(false);

  const toggleCards = () => {
    const total = cardRefs.current.length;
    const spreadAngle = 60;
    const spreadWidth = window.innerWidth * 0.6;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      const offset = index - (total - 1) / 2;
      const angle = (spreadAngle / total) * offset;
      const xOffset = (spreadWidth / (total - 1)) * offset;

      gsap.to(card, {
        rotation: hasSpread.current ? 0 : angle,
        x: hasSpread.current ? 0 : xOffset,
        y: hasSpread.current ? 0 : -Math.abs(offset) * 30,
        duration: 1.2,
        ease: "power3.inOut",
        zIndex: 10 + index,
      });
    });

    hasSpread.current = !hasSpread.current;
  };

  useEffect(() => {
    const lenis = new Lenis();
    function raf(t: number) {
      lenis.raf(t);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    cardRefs.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 150, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <div
      className="cards-section"
      ref={container}
      onClick={toggleCards}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        cursor: "pointer",
        width: "100%",
        height: "100vh",
      }}
    >
      {[...Array(4)].map((_, index) => (
        <Card
          key={index}
          id={`card-${index + 1}`}
          frontSrc="/card-front.png" // <-- Replace with actual image
          frontAlt={`Card ${index + 1}`}
          backText="Your Card Details Appear Here"
          ref={(el) => {
            if (el) cardRefs.current[index] = el;
          }}
        />
      ))}
    </div>
  );
}
