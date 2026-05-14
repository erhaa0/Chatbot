import React from "react";
import { motion } from "motion/react";

const KuromiHead: React.FC<{ isTalking: boolean }> = ({ isTalking }) => {
  return (
    <motion.div 
      className="relative w-48 h-48"
      animate={{ 
        y: isTalking ? [0, -15, 0] : [0, -8, 0],
        rotate: isTalking ? [-2, 2, -2] : [1, -1, 1],
        scale: isTalking ? [1, 1.05, 1] : [1, 0.98, 1]
      }}
      transition={{ 
        y: { duration: isTalking ? 0.4 : 3, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: isTalking ? 0.15 : 4, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: isTalking ? 0.3 : 5, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      {/* Glowing aura behind character */}
      <div className="absolute inset-0 bg-pink-600/10 rounded-full blur-3xl scale-150 z-[-1]" />
      
      {/* This is a CSS-based Kuromi approximation - whimsical and cute */}
      {/* Black Jester Hat */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-32 bg-zinc-900 rounded-t-full relative">
        {/* Hat Ears/Points */}
        <div className="absolute -top-10 -left-6 w-16 h-24 bg-zinc-900 rounded-br-3xl origin-bottom-right rotate-[-15deg]" />
        <div className="absolute -top-10 -right-6 w-16 h-24 bg-zinc-900 rounded-bl-3xl origin-bottom-left rotate-[15deg]" />
        
        {/* Pink Skull on hat */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-black rounded-full mx-0.5" />
            <div className="w-1 h-1 bg-black rounded-full mx-0.5" />
        </div>
      </div>

      {/* Face */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-32 h-28 bg-white rounded-[50%_50%_45%_45%] border-4 border-zinc-900">
        {/* Eyes */}
        <div className="absolute top-10 left-6 w-3 h-5 bg-zinc-900 rounded-full rotate-[-10deg]" />
        <div className="absolute top-10 right-6 w-3 h-5 bg-zinc-900 rounded-full rotate-[10deg]" />
        {/* Eyelashes */}
        <div className="absolute top-9 left-4 w-4 h-1 bg-zinc-900 rotate-[-45deg]" />
        <div className="absolute top-9 right-4 w-4 h-1 bg-zinc-900 rotate-[45deg]" />
        
        {/* Nose */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-2 h-1.5 bg-pink-400 rounded-full" />
        
        {/* Mouth */}
        <motion.div 
            className="absolute top-20 left-1/2 -translate-x-1/2"
            animate={{ scaleY: isTalking ? [1, 0.5, 1] : 1 }}
        >
            <div className="w-4 h-2 border-b-2 border-zinc-900 rounded-full" />
        </motion.div>
      </div>

      {/* Pink Collar with Ball */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-12 bg-pink-500 rounded-full flex items-center justify-center">
        <div className="w-4 h-4 bg-pink-300 rounded-full shadow-sm" />
      </div>
    </motion.div>
  );
};

export default KuromiHead;
