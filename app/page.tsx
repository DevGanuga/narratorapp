import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e6e3] selection:bg-amber-500/30">
      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none"></div>
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.04]">
        <nav className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-xl font-semibold tracking-tight">
              CONVO<span className="text-[#6a6a6a]">AI</span>
            </span>
            <span className="text-[10px] tracking-[0.2em] text-[#4a4a4a] uppercase">Studio</span>
            <div className="h-4 w-px bg-white/10 mx-1"></div>
            <span className="text-[10px] text-[#3a3a3a]">by NR8R</span>
          </Link>
          
          <div className="flex items-center gap-10">
            <Link 
              href="#capabilities" 
              className="text-[13px] text-[#6a6a6a] hover:text-[#e8e6e3] transition-colors duration-300 tracking-wide"
            >
              Capabilities
            </Link>
            <Link 
              href="#approach" 
              className="text-[13px] text-[#6a6a6a] hover:text-[#e8e6e3] transition-colors duration-300 tracking-wide"
            >
              Approach
            </Link>
            <Link 
              href="#about" 
              className="text-[13px] text-[#6a6a6a] hover:text-[#e8e6e3] transition-colors duration-300 tracking-wide"
            >
              About
            </Link>
            <Link 
              href="/team/login" 
              className="text-[13px] text-[#6a6a6a] hover:text-[#e8e6e3] transition-colors duration-300 tracking-wide"
            >
              Team
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-8 overflow-hidden">
        {/* Animated gradient orb */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.07] blur-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 rounded-full animate-pulse"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-lg shadow-amber-500/50"></div>
              <span className="text-[11px] tracking-[0.25em] text-[#5a5a5a] uppercase font-light">
                Conversational Video Intelligence
              </span>
            </div>
            
            <h1 className="text-[4rem] md:text-[5.5rem] font-light leading-[0.95] tracking-[-0.03em] mb-10">
              Advancing the
              <br />
              <span className="text-[#5a5a5a]">frontier of</span>
              <br />
              human-AI
              <br />
              <span className="italic font-serif text-[#c4c0b8]">dialogue</span>
            </h1>
            
            <p className="text-[18px] text-[#7a7a7a] leading-[1.8] max-w-xl font-light mb-8">
              Create photorealistic digital replicas and engage in real-time video conversations 
              powered by multimodal AI. Professional tools built by storytellers, for storytellers.
            </p>
            
            <div className="flex items-center gap-6 mb-16">
              <Link
                href="#demo"
                className="group inline-flex items-center gap-3 px-7 py-4 bg-white text-[#0a0a0a] rounded-full text-[13px] font-medium tracking-wide hover:bg-white/90 transition-all duration-300 hover:shadow-xl hover:shadow-white/10"
              >
                See It In Action
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="#capabilities"
                className="group inline-flex items-center gap-3 text-[13px] tracking-wide text-[#6a6a6a] hover:text-[#e8e6e3] transition-colors duration-300"
              >
                Explore capabilities
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-8 pt-8 border-t border-white/[0.04]">
              <div>
                <div className="text-[28px] font-light text-white mb-1">Sub-second</div>
                <div className="text-[12px] text-[#4a4a4a] tracking-wide">Latency</div>
              </div>
              <div className="h-10 w-px bg-white/[0.06]"></div>
              <div>
                <div className="text-[28px] font-light text-white mb-1">1080p</div>
                <div className="text-[12px] text-[#4a4a4a] tracking-wide">HD Video</div>
              </div>
              <div className="h-10 w-px bg-white/[0.06]"></div>
              <div>
                <div className="text-[28px] font-light text-white mb-1">Real-time</div>
                <div className="text-[12px] text-[#4a4a4a] tracking-wide">Multimodal AI</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Preview Section */}
      <section id="demo" className="py-24 px-8 bg-gradient-to-b from-[#0a0a0a] to-[#080808]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] tracking-[0.25em] text-[#5a5a5a] uppercase font-light mb-4 block">Experience</span>
            <h2 className="text-[2.5rem] font-light tracking-[-0.02em] mb-4">
              See it in <span className="text-[#5a5a5a]">action</span>
            </h2>
            <p className="text-[15px] text-[#5a5a5a] max-w-lg mx-auto">
              Production-grade conversational video technology that feels natural
            </p>
          </div>
          
          <div className="group relative bg-gradient-to-br from-[#111] to-[#0a0a0a] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500">
            <div className="aspect-video flex items-center justify-center relative">
              {/* Animated background */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="text-center relative z-10">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                    <svg className="w-10 h-10 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-white/10 blur-xl animate-pulse"></div>
                </div>
                <p className="text-[#5a5a5a] text-lg font-light">Interactive Demo</p>
                <p className="text-[#3a3a3a] text-sm mt-2">Coming Soon</p>
              </div>
            </div>
            <div className="p-8 border-t border-white/[0.04] bg-black/20">
              <h3 className="text-lg font-medium mb-2">Natural Human-Like Interactions</h3>
              <p className="text-[14px] text-[#5a5a5a] leading-relaxed">
                Experience authentic conversations with real-time video, voice synthesis, 
                and intelligent multimodal responses powered by state-of-the-art language models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-32 px-8 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <span className="text-[11px] tracking-[0.25em] text-[#5a5a5a] uppercase font-light mb-6 block">Platform</span>
            <h2 className="text-[2.5rem] font-light leading-[1.15] tracking-[-0.02em] mb-6">
              Enterprise-grade <span className="text-[#5a5a5a]">capabilities</span>
            </h2>
            <p className="text-[15px] text-[#5a5a5a] max-w-xl leading-relaxed">
              Everything you need to build production-ready conversational video experiences at scale.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] rounded-xl overflow-hidden">
            <div className="bg-[#080808] p-10 group hover:bg-[#0c0c0c] transition-colors duration-300">
              <div className="w-12 h-12 mb-8 border border-white/[0.08] rounded-xl flex items-center justify-center group-hover:border-amber-500/30 group-hover:bg-amber-500/5 transition-all duration-300">
                <svg className="w-6 h-6 text-[#4a4a4a] group-hover:text-amber-500/70 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-[15px] font-medium mb-3 tracking-wide">Digital Replicas</h3>
              <p className="text-[13px] text-[#4a4a4a] leading-[1.8] font-light">
                Create photorealistic digital avatars from a 2-minute video. Train custom replicas 
                with the phoenix-3 model that capture unique personalities and natural speaking patterns.
              </p>
            </div>
            
            <div className="bg-[#080808] p-10 group hover:bg-[#0c0c0c] transition-colors duration-300">
              <div className="w-12 h-12 mb-8 border border-white/[0.08] rounded-xl flex items-center justify-center group-hover:border-amber-500/30 group-hover:bg-amber-500/5 transition-all duration-300">
                <svg className="w-6 h-6 text-[#4a4a4a] group-hover:text-amber-500/70 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-[15px] font-medium mb-3 tracking-wide">Real-Time Conversations</h3>
              <p className="text-[13px] text-[#4a4a4a] leading-[1.8] font-light">
                Engage in natural, bidirectional video conversations. Multimodal perception enables 
                visual understanding, speech recognition, and contextually-aware responses in real-time.
              </p>
            </div>
            
            <div className="bg-[#080808] p-10 group hover:bg-[#0c0c0c] transition-colors duration-300">
              <div className="w-12 h-12 mb-8 border border-white/[0.08] rounded-xl flex items-center justify-center group-hover:border-amber-500/30 group-hover:bg-amber-500/5 transition-all duration-300">
                <svg className="w-6 h-6 text-[#4a4a4a] group-hover:text-amber-500/70 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-[15px] font-medium mb-3 tracking-wide">Custom Personas</h3>
              <p className="text-[13px] text-[#4a4a4a] leading-[1.8] font-light">
                Configure behavioral parameters, conversational tone, and domain knowledge. 
                Build specialized conversational agents tailored to your specific use cases.
              </p>
            </div>
            
            <div className="bg-[#080808] p-10 group hover:bg-[#0c0c0c] transition-colors duration-300">
              <div className="w-12 h-12 mb-8 border border-white/[0.08] rounded-xl flex items-center justify-center group-hover:border-amber-500/30 group-hover:bg-amber-500/5 transition-all duration-300">
                <svg className="w-6 h-6 text-[#4a4a4a] group-hover:text-amber-500/70 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-[15px] font-medium mb-3 tracking-wide">Voice Synthesis</h3>
              <p className="text-[13px] text-[#4a4a4a] leading-[1.8] font-light">
                Natural speech generation with emotional modulation. Professional text-to-speech 
                with seamless integration into video output for authentic conversations.
              </p>
            </div>
            
            <div className="bg-[#080808] p-10 group hover:bg-[#0c0c0c] transition-colors duration-300">
              <div className="w-12 h-12 mb-8 border border-white/[0.08] rounded-xl flex items-center justify-center group-hover:border-amber-500/30 group-hover:bg-amber-500/5 transition-all duration-300">
                <svg className="w-6 h-6 text-[#4a4a4a] group-hover:text-amber-500/70 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-[15px] font-medium mb-3 tracking-wide">Knowledge Integration</h3>
              <p className="text-[13px] text-[#4a4a4a] leading-[1.8] font-light">
                Upload proprietary documents up to 50MB. Enable retrieval-augmented generation (RAG) 
                for accurate, context-aware responses grounded in your data.
              </p>
            </div>
            
            <div className="bg-[#080808] p-10 group hover:bg-[#0c0c0c] transition-colors duration-300">
              <div className="w-12 h-12 mb-8 border border-white/[0.08] rounded-xl flex items-center justify-center group-hover:border-amber-500/30 group-hover:bg-amber-500/5 transition-all duration-300">
                <svg className="w-6 h-6 text-[#4a4a4a] group-hover:text-amber-500/70 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-[15px] font-medium mb-3 tracking-wide">Behavioral Guardrails</h3>
              <p className="text-[13px] text-[#4a4a4a] leading-[1.8] font-light">
                Enforce strict behavioral constraints and compliance policies. Maintain consistent 
                brand voice and ensure professional interactions with configurable safety parameters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section id="approach" className="py-32 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <span className="text-[11px] tracking-[0.25em] text-[#5a5a5a] uppercase font-light mb-6 block">Our Approach</span>
              <h2 className="text-[2.5rem] font-light leading-[1.15] tracking-[-0.02em] mb-8">
                Research-driven
                <br />
                <span className="text-[#5a5a5a]">development</span>
              </h2>
              <p className="text-[15px] text-[#6a6a6a] leading-[1.9] font-light mb-8">
                We take a deliberate, research-first approach to conversational video. 
                Rather than rushing to market, we focus on foundational capabilities 
                that will define the next generation of human-AI interaction.
              </p>
              <p className="text-[15px] text-[#5a5a5a] leading-[1.9] font-light">
                Our team combines decades of experience in video production, creative storytelling, 
                and AI research to build technology that feels genuinely human.
              </p>
            </div>
            
            <div className="space-y-10">
              <div className="group">
                <div className="flex items-start gap-6">
                  <span className="text-[11px] text-[#4a4a4a] font-mono mt-1.5">01</span>
                  <div>
                    <h3 className="text-[16px] font-medium mb-3 tracking-wide group-hover:text-amber-400/80 transition-colors">Partnership Model</h3>
                    <p className="text-[14px] text-[#5a5a5a] leading-[1.8] font-light">
                      We work with select partners to co-develop applications, sharing 
                      learnings and allocating R&D resources toward frontier capabilities.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group">
                <div className="flex items-start gap-6">
                  <span className="text-[11px] text-[#4a4a4a] font-mono mt-1.5">02</span>
                  <div>
                    <h3 className="text-[16px] font-medium mb-3 tracking-wide group-hover:text-amber-400/80 transition-colors">Rapid Prototyping</h3>
                    <p className="text-[14px] text-[#5a5a5a] leading-[1.8] font-light">
                      Our demo platform enables quick iteration on use cases, allowing 
                      partners to validate concepts before committing to full development.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group">
                <div className="flex items-start gap-6">
                  <span className="text-[11px] text-[#4a4a4a] font-mono mt-1.5">03</span>
                  <div>
                    <h3 className="text-[16px] font-medium mb-3 tracking-wide group-hover:text-amber-400/80 transition-colors">Frontier Focus</h3>
                    <p className="text-[14px] text-[#5a5a5a] leading-[1.8] font-light">
                      With dedicated research funding, we push beyond current limitations 
                      in real-time video synthesis and multimodal understanding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About NR8R Section */}
      <section id="about" className="py-32 px-8 bg-gradient-to-b from-[#0a0a0a] to-[#080808]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <Image
                  src="/White logo - no background.png"
                  alt="Narrator"
                  width={140}
                  height={45}
                  className="opacity-90"
                />
              </div>
              <p className="text-[17px] text-[#7a7a7a] leading-[1.9] font-light">
                Narrator is an award-winning creative agency, production hub, and post-production campus 
                partnering with storytellers worldwide to create visually compelling marketing materials 
                and immersive campaigns that celebrate diverse narratives.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-6">
                <div className="text-[32px] font-light text-amber-500/80 mb-2">10+</div>
                <div className="text-[13px] text-[#5a5a5a]">Years of storytelling</div>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-6">
                <div className="text-[32px] font-light text-amber-500/80 mb-2">100+</div>
                <div className="text-[13px] text-[#5a5a5a]">Global partners</div>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-6">
                <div className="text-[32px] font-light text-amber-500/80 mb-2">Award</div>
                <div className="text-[13px] text-[#5a5a5a]">Winning creative</div>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-6">
                <div className="text-[32px] font-light text-amber-500/80 mb-2">SF</div>
                <div className="text-[13px] text-[#5a5a5a]">Based in San Francisco</div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-white/[0.04]">
            <div>
              <h3 className="text-[13px] tracking-[0.2em] text-[#5a5a5a] uppercase mb-6">Our Mission</h3>
              <p className="text-[15px] text-[#6a6a6a] leading-[1.9] font-light">
                We partner directly with artists, filmmakers, and storytellers—working shoulder 
                to shoulder to celebrate and amplify their creative vision on a global stage. 
                ConvoAI Studio extends this mission into the frontier of AI-powered interaction.
              </p>
            </div>
            
            <div>
              <h3 className="text-[13px] tracking-[0.2em] text-[#5a5a5a] uppercase mb-6">Our Values</h3>
              <p className="text-[15px] text-[#6a6a6a] leading-[1.9] font-light">
                We&apos;re driven to continuously innovate and expand our technical capabilities. 
                We celebrate diverse perspectives and take full ownership of our work with 
                transparency and integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#111] to-[#0a0a0a] rounded-2xl p-12 md:p-16 overflow-hidden border border-white/[0.06]">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/5 to-transparent"></div>
            
            <div className="relative max-w-2xl">
              <span className="text-[11px] tracking-[0.25em] text-amber-500/70 uppercase font-light mb-6 block">Partnership</span>
              <h2 className="text-[2.5rem] font-light leading-[1.15] tracking-[-0.02em] mb-6">
                Let&apos;s build
                <br />
                <span className="text-[#5a5a5a]">something extraordinary</span>
              </h2>
              <p className="text-[15px] text-[#6a6a6a] leading-[1.9] font-light mb-10">
                We&apos;re selectively partnering with organizations who share our vision 
                for the future of conversational AI. If you&apos;re working on interesting 
                problems in this space, we&apos;d like to hear from you.
              </p>
              <div className="flex items-center gap-6">
                <a
                  href="mailto:research@narrator.studio"
                  className="inline-flex items-center gap-3 px-7 py-4 bg-white text-[#0a0a0a] rounded-full text-[13px] font-medium tracking-wide hover:bg-white/90 transition-all duration-300"
                >
                  Get in Touch
                </a>
                <a
                  href="mailto:research@narrator.studio"
                  className="inline-flex items-center gap-3 text-[13px] tracking-wide text-amber-500/80 hover:text-amber-400 transition-colors duration-300"
                >
                  research@narrator.studio
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-12 px-8 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold tracking-tight">
                  CONVO<span className="text-[#4a4a4a]">AI</span>
                </span>
                <span className="text-[10px] text-[#3a3a3a]">Studio</span>
              </div>
              <div className="h-5 w-px bg-white/[0.06]"></div>
              <Image
                src="/White logo - no background.png"
                alt="Narrator"
                width={80}
                height={26}
                className="opacity-40"
              />
            </div>
            <div className="flex gap-8">
              <Link href="#capabilities" className="text-[12px] text-[#4a4a4a] hover:text-[#8a8a8a] transition-colors">
                Capabilities
              </Link>
              <Link href="#approach" className="text-[12px] text-[#4a4a4a] hover:text-[#8a8a8a] transition-colors">
                Approach
              </Link>
              <Link href="#about" className="text-[12px] text-[#4a4a4a] hover:text-[#8a8a8a] transition-colors">
                About
              </Link>
              <Link href="/team/login" className="text-[12px] text-[#4a4a4a] hover:text-[#8a8a8a] transition-colors">
                Team Portal
              </Link>
            </div>
          </div>
          <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[11px] text-[#3a3a3a]">
              © 2025 Narrator Inc. All rights reserved. Proprietary & Confidential.
            </p>
            <div className="flex gap-6">
              <span className="text-[11px] text-[#3a3a3a]">San Francisco, CA</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
