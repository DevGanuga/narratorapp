import Link from 'next/link';
import Image from 'next/image';
import { Hero } from '@/components/hero';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/5">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <h1 className="text-2xl font-bold tracking-tight transition-all duration-300 group-hover:tracking-wide">
              CONVO<span className="text-gray-400 group-hover:text-gray-300 transition-colors">AI</span> <span className="text-gray-600">STUDIO</span>
          </h1>
            <span className="text-xs text-gray-500 font-light opacity-60 group-hover:opacity-100 transition-opacity">by NR8R</span>
          </Link>
          
          <div className="flex items-center gap-8">
            <Link 
              href="#capabilities" 
              className="text-sm text-gray-400 hover:text-white transition-all duration-200 hover:scale-105"
            >
              Capabilities
            </Link>
            <Link 
              href="#about" 
              className="text-sm text-gray-400 hover:text-white transition-all duration-200 hover:scale-105"
            >
              About
            </Link>
            <Link 
              href="/studio" 
              className="px-6 py-2 bg-white text-black font-medium rounded-full hover:bg-gray-100 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 hover:scale-105"
            >
              Launch Studio
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-blue-900/10 animate-gradient-shift"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-transparent"></div>
        
        <div className="relative">
          <Hero />
        </div>
      </section>

      {/* Demo Preview */}
      <section id="demo" className="py-20 px-6 bg-linear-to-b from-black to-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">See It In Action</h2>
            <p className="text-gray-400 text-lg">Experience production-grade conversational video technology</p>
          </div>
          <div className="group relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl overflow-hidden border border-white/10 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:border-white/20">
            <div className="aspect-video bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 flex items-center justify-center relative">
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="text-center relative z-10">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse"></div>
                </div>
                <p className="text-gray-400 text-lg font-medium">Demo Available Soon</p>
                <p className="text-gray-600 text-sm mt-2">Interactive conversation showcase</p>
              </div>
            </div>
            <div className="p-8 border-t border-white/10 bg-black/40 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-3">Natural Human-Like Interactions</h3>
              <p className="text-gray-400 leading-relaxed">
                Experience how ConvoAI Studio creates authentic conversations with real-time video, 
                voice synthesis, and intelligent multimodal responses powered by state-of-the-art language models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Platform Capabilities</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Enterprise-grade infrastructure for building production-ready 
              conversational video experiences at scale.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* AI Replicas */}
            <div className="group relative bg-gradient-to-br from-gray-950 to-gray-900 rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-purple-500/20">
                  <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-300 transition-colors">Digital Replicas</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  Create photorealistic digital avatars from a 2-minute video. Train custom replicas 
                  with the phoenix-3 model that capture unique personalities and natural speaking patterns.
                </p>
              </div>
            </div>

            {/* Smart Personas */}
            <div className="group relative bg-gradient-to-br from-gray-950 to-gray-900 rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-blue-500/20">
                  <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-300 transition-colors">Custom Personas</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  Configure behavioral parameters, conversational tone, and domain knowledge. 
                  Build specialized conversational agents tailored to your specific use cases and audience.
                </p>
              </div>
            </div>

            {/* Real-Time Conversations */}
            <div className="group relative bg-gradient-to-br from-gray-950 to-gray-900 rounded-2xl p-8 border border-white/10 hover:border-green-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-green-500/20">
                  <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-green-300 transition-colors">Real-Time Conversations</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  Engage in natural, bidirectional video conversations. Multimodal perception enables 
                  visual understanding, speech recognition, and contextually-aware responses in real-time.
                </p>
              </div>
            </div>

            {/* Video Generation */}
            <div className="group relative bg-gradient-to-br from-gray-950 to-gray-900 rounded-2xl p-8 border border-white/10 hover:border-orange-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-orange-500/20">
                  <svg className="w-7 h-7 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-orange-300 transition-colors">Video Synthesis</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  Generate professional videos from text scripts or audio files. Create scalable 
                  marketing content with photorealistic video synthesis and natural text-to-speech.
                </p>
              </div>
            </div>

            {/* Knowledge Base */}
            <div className="group relative bg-gradient-to-br from-gray-950 to-gray-900 rounded-2xl p-8 border border-white/10 hover:border-pink-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-pink-500/20">
                  <svg className="w-7 h-7 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-pink-300 transition-colors">Knowledge Integration</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  Upload proprietary documents and resources up to 50MB. Enable retrieval-augmented 
                  generation (RAG) for accurate, context-aware responses grounded in your data.
                </p>
              </div>
            </div>

            {/* Guardrails & Control */}
            <div className="group relative bg-gradient-to-br from-gray-950 to-gray-900 rounded-2xl p-8 border border-white/10 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-cyan-500/20">
                  <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-cyan-300 transition-colors">Behavioral Guardrails</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  Enforce strict behavioral constraints and compliance policies. Maintain consistent 
                  brand voice and ensure professional interactions with configurable safety parameters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About NR8R */}
      <section id="about" className="py-20 px-6 bg-linear-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">About NR8R</h2>
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            Narrator is an award-winning creative agency, production hub, and post-production campus 
            partnering with storytellers worldwide to create visually compelling marketing materials 
            and immersive campaigns that celebrate diverse narratives.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mt-12 text-left">
            <div>
              <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We partner directly with artists, filmmakers, and storytellers—working shoulder 
                to shoulder to celebrate and amplify their creative vision on a global stage.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Our Values</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We&apos;re driven to continuously innovate and expand our technical capabilities. 
                We celebrate diverse perspectives and take full ownership of our work with 
                transparency and integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="text-center md:text-left">
              <div className="text-xl font-bold mb-3">
                CONVO<span className="text-gray-400">AI</span> <span className="text-gray-600">STUDIO</span>
              </div>
              <div className="text-sm text-gray-500 mb-4">
                Powered by NR8R
              </div>
              <div className="flex items-center gap-3">
            <Image
                  src="/White logo - no background.png"
                  alt="Narrator"
                  width={120}
                  height={40}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-all duration-200 hover:scale-105">
                Privacy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-all duration-200 hover:scale-105">
                Terms
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-all duration-200 hover:scale-105">
                Contact
              </a>
            </div>
          </div>
          <div className="pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-gray-600">
              © 2025 Narrator Inc. All rights reserved. Proprietary & Confidential.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
