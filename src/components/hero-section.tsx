"use client";

import { useEffect, useState } from "react";
import { Sparkles, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { FadeTransition } from "@/components/transitions/FadeTransition";
import { SlideTransition } from "@/components/transitions/SlideTransition";
import { ScaleTransition } from "@/components/transitions/ScaleTransition";

export default function HeroSection() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
      <div className="flex-1 text-center lg:text-left">
        <SlideTransition in={isVisible} duration={600}>
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              轻记 AI Chat
            </h1>
            <Sparkles className="absolute -top-6 -right-6 w-8 h-8 text-blue-400" />
          </div>
        </SlideTransition>

        <SlideTransition in={isVisible} duration={600}>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            智能对话新体验
          </h2>
        </SlideTransition>

        <FadeTransition in={isVisible} duration={600}>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            轻记 AI 聊天室，基于 GPT
            技术，为您提供流畅自然的对话体验。简单易用，随时随地开启智能对话。
          </p>
        </FadeTransition>

        <SlideTransition in={isVisible} duration={600}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() => router.push("/chat")}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold transition-all duration-300 transform hover:scale-105"
            >
              立即体验
            </button>
            <button className="px-8 py-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-white font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              了解更多
            </button>
          </div>
        </SlideTransition>
      </div>

      <ScaleTransition in={isVisible} duration={800}>
        <div className="flex-1 relative">
          <div className="relative w-[400px] h-[400px]">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 animate-pulse" />
            <div
              className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-500/40 to-cyan-500/40 animate-pulse"
              style={{ animationDelay: "200ms" }}
            />
            <div
              className="absolute inset-8 rounded-full bg-gradient-to-r from-blue-500/60 to-cyan-500/60 animate-pulse"
              style={{ animationDelay: "400ms" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <MessageCircle className="w-32 h-32 text-white" />
                <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
                  <span className="text-white font-bold">AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScaleTransition>
    </div>
  );
}
