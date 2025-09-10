"use client";

import { useEffect, useRef, useState } from "react";

const ExplosionContainer = () => {
  const explosionContainerRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const [explosionTriggered, setExplosionTriggered] = useState(false);
  const particlesRef = useRef<Particle[]>([]);

  const config = {
    gravity: 0.25,
    friction: 0.99,
    imageSize: 150,
    horizontalForce: 22,
    verticalForce: 18,
    rotationSpeed: 20,
    resetDelay: 800,
  };

  // Increase number of images (change to your max available images)
  const imageParticleCount = 25;
  const imagePaths = Array.from(
    { length: imageParticleCount },
    (_, i) => `/assets/img${i + 1}.jpg`
  );

  class Particle {
    element: HTMLImageElement;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    rotationSpeed: number;

    constructor(element: HTMLImageElement, startX: number, startY: number) {
      this.element = element;

      // Explosion starts from center of footer
      this.x = startX;
      this.y = startY;

      this.vx = (Math.random() - 0.5) * config.horizontalForce;
      this.vy = -config.verticalForce - Math.random() * 10;
      this.rotation = 0;
      this.rotationSpeed = (Math.random() - 0.5) * config.rotationSpeed;

      this.element.style.position = "absolute";
      this.element.style.left = "0";
      this.element.style.top = "0";
    }

    update() {
      this.vy += config.gravity;
      this.vx *= config.friction;
      this.vy *= config.friction;
      this.rotationSpeed *= config.friction;

      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;

      if (this.element) {
        this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
      }
    }
  }

  const createParticles = (startX: number, startY: number) => {
    if (!explosionContainerRef.current) return;

    explosionContainerRef.current.innerHTML = "";
    particlesRef.current = [];

    imagePaths.forEach((path) => {
      const particle = document.createElement("img");
      particle.src = path;
      particle.classList.add("explosion-particle-img");
      particle.style.width = `${config.imageSize}px`;
      particle.style.position = "absolute";
      particle.style.top = "0";
      particle.style.left = "0";

      explosionContainerRef.current!.appendChild(particle);
      particlesRef.current.push(new Particle(particle, startX, startY));
    });
  };

  const playExplosionSound = () => {
    const audio = new Audio("/assets/explosion.mp3"); // 🔊 put your sound file here
    audio.volume = 1.0; // max volume
    audio.play();
  };

  const explode = () => {
    if (explosionTriggered || !footerRef.current) return;
    setExplosionTriggered(true);

    // Play sound
    playExplosionSound();

    // find footer center
    const rect = footerRef.current.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    createParticles(startX, startY);

    let animationId: number;
    let finished = false;

    const animate = () => {
      if (finished) return;

      particlesRef.current.forEach((particle) => particle.update());

      if (
        explosionContainerRef.current &&
        particlesRef.current.every(
          (particle) => particle.y > window.innerHeight + config.imageSize
        )
      ) {
        cancelAnimationFrame(animationId);
        finished = true;
        setTimeout(() => {
          setExplosionTriggered(false);
        }, config.resetDelay);
        return;
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
  };

  const checkFooterPosition = () => {
    if (!footerRef.current) return;

    const footerRect = footerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (!explosionTriggered && footerRect.top < viewportHeight) {
      explode();
    }
  };

  useEffect(() => {
    // Preload images
    imagePaths.forEach((path) => {
      const img = new Image();
      img.src = path;
    });

    footerRef.current = document.querySelector("footer");

    const handleScroll = () => {
      checkFooterPosition();
    };

    window.addEventListener("scroll", handleScroll);

    const checkTimeout = setTimeout(checkFooterPosition, 500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(checkTimeout);
    };
  }, []);

  return <div className="explosion-container" ref={explosionContainerRef}></div>;
};

export default ExplosionContainer;
