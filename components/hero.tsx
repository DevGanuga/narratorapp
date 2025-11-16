'use client';

import { MoveRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <div className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-2">
          <div className="flex gap-6 flex-col">
            <div>
              <Badge variant="outline" className="border-white/20 text-white backdrop-blur-sm">
                ✨ Enterprise-Grade Platform
              </Badge>
            </div>
            <div className="flex gap-6 flex-col">
              <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tight text-left font-bold leading-tight">
                Conversational Video
                <br />
                <span className="text-gray-400">Intelligence</span>
              </h1>
              <p className="text-xl leading-relaxed tracking-tight text-gray-400 max-w-lg text-left">
                Create photorealistic digital replicas and real-time video conversations 
                powered by multimodal AI. Professional tools built for creative storytellers.
              </p>
            </div>
            <div className="flex flex-row gap-4">
              <Button size="lg" className="gap-3 bg-white text-black hover:bg-gray-100 rounded-full" asChild>
                <Link href="/studio">
                  Launch Studio <MoveRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" className="gap-3 rounded-full" variant="outline" asChild>
                <Link href="#capabilities">
                  Explore Features
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 border border-purple-500/20 rounded-2xl aspect-square flex items-center justify-center backdrop-blur-sm">
              <div className="text-center p-6">
                <div className="text-4xl font-bold mb-2 text-purple-300">35</div>
                <div className="text-sm text-gray-400">API Endpoints</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-950/20 border border-blue-500/20 rounded-2xl row-span-2 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center p-8">
                <div className="mb-4">
                  <svg className="w-20 h-20 mx-auto text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-lg font-semibold text-blue-200">Real-Time</div>
                <div className="text-sm text-gray-400 mt-2">Video Conversations</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-900/20 to-green-950/20 border border-green-500/20 rounded-2xl aspect-square flex items-center justify-center backdrop-blur-sm">
              <div className="text-center p-6">
                <div className="text-4xl font-bold mb-2 text-green-300">1080p</div>
                <div className="text-sm text-gray-400">HD Quality</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

