import React from "react";
import MagicalBackground from "./components/MagicalBackground";
import ChatInterface from "./components/ChatInterface";

export default function App() {
  return (
    <div className="min-h-screen overflow-hidden selection:bg-pink-500/30">
      <MagicalBackground />
      <main className="relative z-10 font-sans">
        <ChatInterface />
      </main>
      
      {/* Decorative vignettes and frame accents */}
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] z-20" />
      <div className="fixed top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-500/40 to-transparent z-30" />
      <div className="fixed bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent z-30" />
    </div>
  );
}
