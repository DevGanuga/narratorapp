'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function StudioPage() {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/90 backdrop-blur-lg">
        <nav className="px-6 py-4 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2 hover:opacity-100 transition-all duration-200">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium opacity-80 group-hover:opacity-100">Back to Home</span>
          </Link>
          
          <h1 className="text-xl font-bold tracking-tight">
            CONVO<span className="text-gray-400">AI</span> <span className="text-gray-600">STUDIO</span>
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'} transition-colors`} />
              <span className="text-sm text-gray-400">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <button className="text-sm text-gray-400 hover:text-white transition-all duration-200 hover:scale-105">
              Settings
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/5 via-transparent to-transparent"></div>
        
        {/* Video Container */}
        <div className="w-full max-w-6xl relative z-10">
          <div className="relative aspect-video bg-gradient-to-br from-gray-900 via-gray-950 to-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/10">
            {/* Video Player */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isConnected ? (
                <div className="text-center animate-fade-in">
                  <div className="relative inline-block mb-6">
                    <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20 border-2 border-purple-500/30 flex items-center justify-center backdrop-blur-sm animate-pulse-glow">
                      <svg className="w-20 h-20 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl"></div>
                  </div>
                  <p className="text-gray-300 text-lg font-medium mb-2">Replica Connected</p>
                  <p className="text-gray-500 text-sm">Multimodal perception active</p>
                </div>
              ) : (
                <div className="text-center animate-fade-in">
                  <div className="relative inline-block mb-8">
                    <div className="w-32 h-32 mx-auto rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center hover:border-white/20 transition-colors">
                      <svg className="w-16 h-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-200">Ready to Connect</h3>
                  <p className="text-gray-500 mb-6">Click "Start Conversation" below to initiate your session</p>
                  <div className="flex gap-2 justify-center text-xs text-gray-600">
                    <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">1080p Video</span>
                    <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">Low Latency</span>
                    <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">Vision + Audio</span>
                  </div>
                </div>
              )}
            </div>

            {/* Status Indicators */}
            <div className="absolute top-6 left-6 flex gap-2">
              <div className="px-4 py-2 bg-black/70 backdrop-blur-md rounded-full text-sm font-medium border border-white/10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
                Studio Mode
              </div>
            </div>

            {/* Conversation Info */}
            {isConnected && (
              <div className="absolute top-6 right-6 animate-fade-in">
                <div className="px-4 py-2 bg-black/70 backdrop-blur-md rounded-full text-sm font-medium border border-white/10 font-mono">
                  00:00:00
                </div>
              </div>
            )}
          </div>

          {/* Control Dock */}
          <div className="mt-8 bg-gradient-to-br from-gray-900 via-gray-950 to-black rounded-3xl border border-white/10 p-8 backdrop-blur-lg shadow-2xl">
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`group relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isMuted 
                      ? 'bg-red-500/20 text-red-400 border-2 border-red-500/40 hover:bg-red-500/30 shadow-lg shadow-red-500/20' 
                      : 'bg-white/10 hover:bg-white/20 border-2 border-white/10 hover:border-white/20'
                  } hover:scale-110`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={() => setIsCameraOff(!isCameraOff)}
                  className={`group relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isCameraOff 
                      ? 'bg-red-500/20 text-red-400 border-2 border-red-500/40 hover:bg-red-500/30 shadow-lg shadow-red-500/20' 
                      : 'bg-white/10 hover:bg-white/20 border-2 border-white/10 hover:border-white/20'
                  } hover:scale-110`}
                  title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
                >
                  {isCameraOff ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>

                <button
                  className="group w-14 h-14 rounded-xl bg-white/10 hover:bg-white/20 border-2 border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center hover:scale-110"
                  title="Screen Share"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              {/* Center - Main Action */}
              <button
                onClick={() => setIsConnected(!isConnected)}
                className={`group px-10 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                  isConnected
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-xl shadow-red-500/30 hover:scale-105'
                    : 'bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white shadow-xl shadow-white/20 hover:scale-105'
                }`}
              >
                <span className="flex items-center gap-2">
                  {isConnected ? (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      End Conversation
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Start Conversation
                    </>
                  )}
                </span>
              </button>

              {/* Right Controls */}
              <div className="flex items-center gap-3">
                <button
                  className="group w-14 h-14 rounded-xl bg-white/10 hover:bg-white/20 border-2 border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center hover:scale-110"
                  title="More Options"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>

                <button
                  className="group w-14 h-14 rounded-xl bg-white/10 hover:bg-white/20 border-2 border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center hover:scale-110"
                  title="Settings"
                >
                  <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            {isConnected && (
              <div className="mt-8 pt-8 border-t border-white/10 animate-fade-in">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-bold mb-1">0</div>
                    <div className="text-sm text-gray-500">Messages</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20">
                    <div className="text-3xl font-bold text-green-400 mb-1">Good</div>
                    <div className="text-sm text-gray-400">Connection</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-bold font-mono mb-1">0:00</div>
                    <div className="text-sm text-gray-500">Duration</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Help Button */}
      <button className="group fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-2xl shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-white/20">
        <svg className="w-7 h-7 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>
  );
}

