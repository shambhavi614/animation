"use client";

import HighlightGrid from "@/components/HighlightGrid";
import InversionLens from "@/components/InversionLens/InversionLens";
import Orb from "@/components/Orb";
import CardStack from "@/components/CardStack";
import Menu from "@/components/menu/menu";
import Slider from "@/components/slider/Slider";
import ExplosionContainer from "@/components/ExplosionContainer";
import Image from "next/image";
import ImageScroll from "@/components/ImageScroll";
import GlitchText from "@/components/GlitchText";

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      {/* Menu Section */}
      <Menu />

      {/* Glitch Section */}
      <section className="bg-white">
        <GlitchText />
      </section>

      {/* Inversion Lens Section */}
      <section className="min-h-screen flex items-center justify-center bg-gray-900">
        <InversionLens src="/portrait.jpg" />
      </section>

      <div className="section-divider" />

      {/* Orb Section */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-black">
        <Orb />
      </section>

      <div className="section-divider" />

      {/* Card Stack Section */}
      <section className="min-h-screen bg-gray-800 text-white">
        <CardStack />
      </section>

      <div className="section-divider" />

      {/* Highlight Grid Section */}
      <section className="min-h-screen bg-black text-white">
        <HighlightGrid />
      </section>

      <div className="section-divider" />

      {/* Slider Section */}
      <section className="min-h-screen bg-gray-700 text-white flex items-center justify-center">
        <Slider />
      </section>

      <div className="section-divider" />

      {/* Image Scroll Section */}
      <section className="min-h-screen">
        <ImageScroll />
      </section>

      <div className="section-divider" />

      {/* About Section */}
      <section className="about-section">
        <p>
          The world collapsed, but the game survived. In the neon-lit ruins of
          civilization, the last remnants of power aren't in government or
          corporation — they're in the <strong>Oblivion Decks</strong>. Each
          card carries a fragment of history, a code of survival, a weapon of
          deception. The elite hoard them. The rebels steal them. The desperate
          gamble their lives for them. Do you have what it takes to{" "}
          <strong>play the game that decides the future</strong>?
        </p>
      </section>

      <div className="section-divider" />

      {/* Outro Section */}
      <section className="outro-section flex flex-col items-center justify-center text-center py-16 bg-black text-white">
        <h2 className="text-3xl font-bold mb-6">
          The End Is Just the Beginning
        </h2>

        {/* Add your image here */}
        <Image
          src="/assets/car11.jpg"
          alt="Outro Illustration"
          width={400}
          height={300}
          className="rounded-2xl shadow-lg"
        />
      </section>

      {/* Footer — Explosion triggers when this enters the viewport */}
      <footer className="footer-section">
        <h1>The future is in your hands</h1>
        <div className="copywrite-info">
          <p>&copy; 2025 Oblivion Decks</p>
          <p>All Rights Reserved</p>
        </div>

        {/* 💥 Explosion triggers when this footer enters the viewport */}
        <ExplosionContainer />
      </footer>
    </main>
  );
}
