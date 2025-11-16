'use client';

import { MoveRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <div className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-16 items-center lg:grid-cols-2">
          <div className="flex gap-6 flex-col">
            <div>
              <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-200 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 mr-1.5" />
                Enterprise Conversational Video AI
              </Badge>
            </div>
            <div className="flex gap-6 flex-col">
              <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tight text-left font-bold leading-[1.1]">
                Conversational Video
                <br />
                <span className="bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent">Intelligence</span>
              </h1>
              <p className="text-lg md:text-xl leading-relaxed text-gray-400 max-w-lg text-left">
                Create photorealistic digital replicas and engage in real-time video conversations 
                powered by multimodal AI. Professional tools built for creative storytellers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="gap-3 bg-white text-black hover:bg-gray-100 hover:shadow-xl hover:shadow-white/20 rounded-full font-semibold transition-all duration-300 hover:scale-105" 
                asChild
              >
                <Link href="/studio">
                  Launch Studio <MoveRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                className="gap-3 rounded-full border-white/20 hover:bg-white/10 font-semibold transition-all duration-300 hover:scale-105" 
                variant="outline" 
                asChild
              >
                <Link href="#capabilities">
                  Explore Capabilities
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Visual Grid */}
          <div className="grid grid-cols-2 gap-6 lg:gap-8">
            {/* Digital Replica Card */}
            <div className="group bg-gradient-to-br from-purple-900/20 to-purple-950/20 border border-purple-500/20 rounded-3xl aspect-square flex items-center justify-center backdrop-blur-sm hover:border-purple-500/40 transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/20">
              <div className="text-center p-6">
                <div className="mb-3">
                  <svg className="w-12 h-12 mx-auto text-purple-300 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-purple-200">Digital</div>
                <div className="text-sm text-gray-400 mt-1">Replicas</div>
              </div>
            </div>
            
            {/* Video Preview - Tall Card */}
            <div className="group relative bg-gradient-to-br from-blue-900/20 to-blue-950/20 border border-blue-500/20 rounded-3xl row-span-2 flex items-center justify-center backdrop-blur-sm hover:border-blue-500/40 transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="text-center p-8 relative z-10">
                <div className="mb-6">
                  <div className="relative inline-block">
                    <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/20 border-2 border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
                  </div>
                </div>
                <div className="text-lg font-semibold text-blue-200 mb-2">Real-Time</div>
                <div className="text-sm text-gray-400">Video Conversations</div>
                <div className="text-xs text-gray-500 mt-3">1080p HD Quality</div>
              </div>
            </div>
            
            {/* Voice Synthesis Card */}
            <div className="group bg-gradient-to-br from-green-900/20 to-green-950/20 border border-green-500/20 rounded-3xl aspect-square flex items-center justify-center backdrop-blur-sm hover:border-green-500/40 transition-all duration-500 hover:shadow-lg hover:shadow-green-500/20">
              <div className="text-center p-6">
                <div className="mb-3">
                  <svg className="w-12 h-12 mx-auto text-green-300 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-green-200">Voice</div>
                <div className="text-sm text-gray-400 mt-1">Synthesis</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

