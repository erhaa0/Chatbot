import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Sparkles, User, Bot, Trash2, Settings, Key, X, Check } from "lucide-react";
import { getChatResponse } from "../lib/gemini";

interface Message {
  role: "user" | "model";
  parts: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("KUROMI_API_KEY") || "");
  const [tempKey, setTempKey] = useState(apiKey);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.0; 
      utterance.rate = 1.1;
      utterance.volume = 1;
      
      // Try to find a female/cute voice if available
      const voices = window.speechSynthesis.getVoices();
      const girlVoice = voices.find(v => v.name.toLowerCase().includes("girl") || v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("samantha"));
      if (girlVoice) utterance.voice = girlVoice;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", parts: userMessage }]);
    setIsLoading(true);

    try {
      console.log("Requesting response for:", userMessage);
      const history = messages.slice(-5); // Keep context lean
      const response = await getChatResponse(userMessage, history, apiKey);
      console.log("Received response:", response);
      const textResponse = response || "Something went wrong. Please try again.";
      setMessages(prev => [...prev, { role: "model", parts: textResponse }]);
      speak(textResponse);
    } catch (error) {
      console.error(error);
      const errorMsg = "Unable to process request. Please verify your API key in settings.";
      setMessages(prev => [...prev, { role: "model", parts: errorMsg }]);
      speak(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const saveKey = () => {
    localStorage.setItem("KUROMI_API_KEY", tempKey);
    setApiKey(tempKey);
    setShowSettings(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto relative z-10 font-sans text-white overflow-hidden">
      {/* Top Navigation */}
      <header className="flex justify-between items-center px-8 py-6 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_10px_#ec4899]"></div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-pink-500/80">Neon Chat AI</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden sm:flex items-center gap-6 text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-bold">
            <span className="px-3 py-1 border border-pink-500/20 rounded-full text-pink-400">
              {apiKey ? "Key Set" : "No Key"}
            </span>
          </div>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full transition-all ${showSettings ? "bg-pink-500 text-white" : "hover:bg-white/5 text-zinc-400 hover:text-white"}`}
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 right-8 left-8 sm:left-auto sm:w-96 z-50 p-6 rounded-3xl bg-[#121214] border border-white/10 shadow-2xl backdrop-blur-3xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-pink-500 flex items-center gap-2">
                  <Key size={14} /> Core Neural Key
                </h3>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase leading-relaxed tracking-wider">
                  Enter your Gemini API Key. It stays on your device.
                </p>
              </div>
              <button onClick={() => setShowSettings(false)} className="text-zinc-600 hover:text-white">
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="Paste AIzaS... key here"
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-zinc-300 outline-none focus:border-pink-500/50 transition-all font-mono"
                />
              </div>
              <button 
                onClick={saveKey}
                className="w-full py-3 bg-pink-500 hover:bg-pink-400 transition-colors rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-pink-500/20"
              >
                Save Engine Key
              </button>
              <div className="text-[9px] text-zinc-600 italic text-center">
                Need a key? Get one at aistudio.google.com
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden min-h-0 pt-4">

        {/* Chat History */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto mx-4 sm:mx-8 mb-6 space-y-6 p-6 rounded-3xl bg-[#0c0c0e]/60 backdrop-blur-xl border border-white/5 shadow-2xl custom-scrollbar"
        >
          <AnimatePresence initial={false}>
            {messages.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[85%] px-6 py-4 rounded-3xl relative ${
                    m.role === "user" 
                    ? "bg-pink-600/15 border border-pink-500/30 text-pink-50 rounded-tr-sm" 
                    : "bg-zinc-900/60 border border-white/5 text-zinc-100 rounded-tl-sm"
                  }`}
                >
                  <div className={`flex items-center gap-2 mb-2 opacity-40 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <span className="text-[9px] uppercase tracking-widest font-black">
                      {m.role === "user" ? "You" : "Assistant"}
                    </span>
                  </div>
                  <div className="text-sm leading-relaxed font-medium">{m.parts}</div>
                  
                  {/* Decorative corner accent */}
                  <div className={`absolute top-0 w-2 h-2 ${m.role === "user" ? "right-0 border-t border-r border-pink-500/50" : "left-0 border-t border-l border-white/20"}`} />
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex justify-start px-2"
              >
                <div className="flex gap-1.5 p-3 rounded-full bg-zinc-900/40 border border-white/5">
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Area - Immersive UI Footer */}
      <footer className="px-4 sm:px-8 pb-10 pt-2 shrink-0">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center bg-[#121214] border border-white/5 rounded-2xl p-2 pl-6 backdrop-blur-2xl">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none outline-none text-zinc-200 placeholder-zinc-600 py-3 text-sm"
              />
              <div className="flex items-center gap-1 pr-2">
                <button 
                  onClick={() => setMessages([])}
                  className="p-2.5 text-zinc-600 hover:text-red-400/80 transition-colors"
                  title="Clear history"
                >
                  <Trash2 size={16} />
                </button>
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest text-pink-400 border border-white/10"
                >
                  {isLoading ? "Thinking..." : "Send"}
                </button>
              </div>
            </div>
          </div>
          
          {/* Meta Info */}
          <div className="flex justify-between items-center px-2">
            <div className="flex gap-4">
              <span className="text-[9px] text-zinc-600 flex items-center gap-1.5 uppercase tracking-tighter">
                <span className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></span>
                Neural Link: Secure
              </span>
              <span className="text-[9px] text-zinc-600 flex items-center gap-1.5 uppercase tracking-tighter">
                <span className="w-1 h-1 rounded-full bg-purple-500 shadow-[0_0_5px_#a855f7]"></span>
                Magical WebGL: Active
              </span>
            </div>
            <span className="text-[9px] text-zinc-700 italic tracking-wider">Powered by Gemini AI</span>
          </div>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
