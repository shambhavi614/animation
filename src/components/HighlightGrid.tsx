"use client";
import { useEffect, useRef } from "react";

export default function HighlightGrid() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const highlight = highlightRef.current;

    if (!container || !highlight) return;

    const gridItems = container.querySelectorAll<HTMLDivElement>(".grid-item");
    const firstItem = gridItems[0];

    const highlightColors = [
      "#E24E1B",
      "#43B1C1",
      "#F79824",
      "#04A777",
      "#5BBC5A",
      "#2176FF",
      "#f2f684ff",
      "#22AAA1",
    ];

    gridItems.forEach((item, index) => {
      item.dataset.color = highlightColors[index % highlightColors.length];
    });

    const moveToElement = (element: HTMLDivElement | null) => {
      if (!element || !highlight || !container) return;
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      highlight.style.transform = `translate(${rect.left - containerRect.left}px, ${rect.top - containerRect.top}px)`;
      highlight.style.width = `${rect.width}px`;
      highlight.style.height = `${rect.height}px`;
      highlight.style.backgroundColor = element.dataset.color || "transparent";
    };

    const moveHighlight = (e: MouseEvent) => {
      const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);

      if (hoveredElement instanceof HTMLElement) {
        if (hoveredElement.classList.contains("grid-item")) {
          moveToElement(hoveredElement as HTMLDivElement);
        } else if (hoveredElement.parentElement?.classList.contains("grid-item")) {
          moveToElement(hoveredElement.parentElement as HTMLDivElement);
        }
      }
    };

    moveToElement(firstItem);
    container.addEventListener("mousemove", moveHighlight);

    return () => {
      container.removeEventListener("mousemove", moveHighlight);
    };
  }, []);

  const skills = ["HTML", "CSS", "JavaScript", "GSAP", "ScrollTrigger", "React", "Next.js", "Three.js"];

  return (
    <div className="highlight-grid-wrapper">
      <nav>
        <p>CODEGRID</p>
        <p>Experiment 448</p>
      </nav>

      <div className="container" ref={containerRef}>
        <div className="grid">
          <div className="grid-row">
            {skills.slice(0, 3).map((skill) => (
              <div key={skill} className="grid-item"><p>({skill})</p></div>
            ))}
          </div>
          <div className="grid-row">
            {skills.slice(3).map((skill) => (
              <div key={skill} className="grid-item"><p>({skill})</p></div>
            ))}
          </div>
        </div>
        <div className="highlight" ref={highlightRef}></div>
      </div>
    </div>
  );
}
