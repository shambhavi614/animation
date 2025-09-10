"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import Player from "@vimeo/player";
import { videos } from "./video"; // Your array of video data

const Slider = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const playersRef = useRef<Map<string, Player>>(new Map());

  useEffect(() => {
    if (!sliderRef.current) return;

    const cards = Array.from(sliderRef.current.querySelectorAll(".card")) as HTMLElement[];

    // Initial 3D stacked layout
    cards.forEach((card, i) => {
      gsap.set(card, {
        y: i * 30,
        scale: 1 - i * 0.05,
        z: -i * 100,
        rotationX: -2 * i,
        zIndex: cards.length - i,
      });
    });

    // Initialize Vimeo players
    cards.forEach((card) => {
      const iframe = card.querySelector("iframe") as HTMLIFrameElement;
      if (iframe) {
        const player = new Player(iframe);
        playersRef.current.set(iframe.dataset.id || "", player);
      }
    });

    playFrontVideo();
  }, []);

  const playFrontVideo = () => {
    const cards = Array.from(sliderRef.current?.querySelectorAll(".card") || []) as HTMLElement[];
    if (!cards.length) return;

    playersRef.current.forEach((player) => player.pause());

    const frontCard = cards[0];
    const iframe = frontCard.querySelector("iframe") as HTMLIFrameElement;
    const id = iframe?.dataset.id;
    if (id && playersRef.current.has(id)) {
      playersRef.current.get(id)?.play();
    }
  };

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const cards = Array.from(sliderRef.current?.querySelectorAll(".card") || []) as HTMLElement[];
    if (!cards.length) return;

    const firstCard = cards[0];

    gsap.to(firstCard, {
      y: "+=300", // move down before sending to back
      opacity: 0.5,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        // Move to back
        sliderRef.current?.appendChild(firstCard);

        // Restack
        const newCards = Array.from(sliderRef.current?.querySelectorAll(".card") || []) as HTMLElement[];
        newCards.forEach((card, i) => {
          gsap.to(card, {
            y: i * 30,
            scale: 1 - i * 0.05,
            z: -i * 100,
            rotationX: -2 * i,
            zIndex: newCards.length - i,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          });
        });

        playFrontVideo();
        setIsAnimating(false);
      },
    });
  };

  return (
    <div
      className="container"
      onClick={handleClick}
      style={{
        perspective: "2000px",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#e0d79cff", // background to match design
        overflow: "hidden",
      }}
    >
      <div
        className="slider"
        ref={sliderRef}
        style={{
          position: "relative",
          width: "640px",
          height: "360px",
          transformStyle: "preserve-3d",
          cursor: "pointer",
        }}
      >
        {videos.map((video) => (
          <div
            className="card"
            key={video.id}
            style={{
              position: "absolute",
              width: "500%",
              height: "400%",
              borderRadius: "12px",
              overflow: "hidden",
              backgroundColor: "#e8ceceff",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="card-info"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                background: "#d9b5f1ff",
                color: "#fff",
                fontSize: "12px",
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 12px",
                zIndex: 10,
              }}
            >
              <div>{video.date}</div>
              <div>{video.title}</div>
              <div>{video.category}</div>
            </div>

            <div
              className="video-player"
              style={{
                position: "absolute",
                top: "30px",
                bottom: 0,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <iframe
                src={`https://player.vimeo.com/video/${video.id}?muted=1&autoplay=0&background=1`}
                data-id={video.id}
                width="640"
                height="360"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
