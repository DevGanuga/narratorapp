import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e6e3] selection:bg-amber-500/30">
      {/* Subtle texture */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.03]">
        <nav className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-lg font-medium tracking-tight">
              CONVO<span className="text-[#5a5a5a]">AI</span>
            </span>
            <span className="text-[10px] tracking-[0.15em] text-[#3a3a3a] uppercase">Studio</span>
            <div className="h-3 w-px bg-white/10 mx-2"></div>
            <span className="text-[10px] text-[#3a3a3a]">by NR8R</span>
          </Link>
          
          <div className="flex items-center gap-10">
            <Link href="#vision" className="text-[13px] text-[#5a5a5a] hover:text-[#e8e6e3] transition-colors duration-300">
              Vision
            </Link>
            <Link href="#work" className="text-[13px] text-[#5a5a5a] hover:text-[#e8e6e3] transition-colors duration-300">
              Work
            </Link>
            <Link href="#about" className="text-[13px] text-[#5a5a5a] hover:text-[#e8e6e3] transition-colors duration-300">
              About
            </Link>
            <Link href="#connect" className="text-[13px] text-[#5a5a5a] hover:text-[#e8e6e3] transition-colors duration-300">
              Connect
            </Link>
            <Link href="/team/login" className="text-[13px] text-[#5a5a5a] hover:text-[#e8e6e3] transition-colors duration-300">
              Team
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center px-8">
        {/* Ambient glow */}
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-amber-900/[0.04] rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto w-full pt-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500/70"></div>
              <span className="text-[11px] tracking-[0.3em] text-[#4a4a4a] uppercase">
                Conversational Video
              </span>
            </div>
            
            <h1 className="text-[3.5rem] md:text-[4.5rem] font-light leading-[1.05] tracking-[-0.025em] mb-10">
              Where stories
              <br />
              come to <span className="italic font-serif text-[#b8b4ac]">life</span>
            </h1>
            
            <p className="text-[17px] text-[#6a6a6a] leading-[1.9] max-w-lg font-light mb-12">
              We partner with filmmakers, artists, and storytellers to explore 
              the frontier of conversational video—creating experiences that 
              feel genuinely human.
            </p>
            
            <div className="flex items-center gap-8">
              <Link
                href="#connect"
                className="inline-flex items-center gap-3 text-[13px] tracking-wide text-[#e8e6e3] hover:text-amber-400 transition-colors duration-300"
              >
                <span>Start a conversation</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        </div>
      </section>

      {/* Statement */}
      <section className="py-32 px-8 border-t border-white/[0.03]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[28px] md:text-[36px] font-light leading-[1.5] text-[#6a6a6a] max-w-4xl">
            We believe the most powerful stories are the ones you can 
            <span className="text-[#c4c0b8]"> step inside</span>. 
            ConvoAI Studio is where we explore what happens when 
            <span className="text-[#c4c0b8]"> narratives become conversations</span>.
          </p>
        </div>
      </section>

      {/* Vision */}
      <section id="vision" className="py-32 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <span className="text-[11px] tracking-[0.3em] text-[#4a4a4a] uppercase mb-8 block">Our Approach</span>
              <h2 className="text-[2.5rem] font-light leading-[1.15] tracking-[-0.02em] mb-8">
                Research-first.
                <br />
                <span className="text-[#5a5a5a]">Partnership-driven.</span>
              </h2>
            </div>
            
            <div className="lg:pt-16">
              <p className="text-[16px] text-[#6a6a6a] leading-[2] font-light mb-8">
                We take a deliberate approach to conversational video. Rather than 
                rushing to market, we focus on foundational work that will define 
                the next generation of human-AI interaction.
              </p>
              <p className="text-[16px] text-[#5a5a5a] leading-[2] font-light">
                Through selective partnerships, we co-create with visionaries who 
                share our belief that this technology should serve the story, 
                not the other way around.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Craft */}
      <section className="py-32 px-8 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <span className="text-[11px] tracking-[0.3em] text-[#4a4a4a] uppercase mb-8 block">The Craft</span>
            <h2 className="text-[2.5rem] font-light leading-[1.15] tracking-[-0.02em] max-w-2xl">
              Bringing presence to the 
              <span className="text-[#5a5a5a]"> digital space</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-12">
              <div>
                <h3 className="text-[17px] font-medium mb-4 text-[#9a9a9a]">Digital Replicas</h3>
                <p className="text-[15px] text-[#5a5a5a] leading-[1.9] font-light">
                  We create photorealistic digital representations that capture not just 
                  appearance, but presence—the subtle qualities that make someone recognizable, 
                  relatable, human.
                </p>
              </div>
              
              <div>
                <h3 className="text-[17px] font-medium mb-4 text-[#9a9a9a]">Real-Time Conversation</h3>
                <p className="text-[15px] text-[#5a5a5a] leading-[1.9] font-light">
                  True dialogue, not scripted interaction. Our work enables natural, 
                  flowing exchanges that respond and adapt in the moment—conversations 
                  that feel alive.
                </p>
              </div>
            </div>
            
            <div className="space-y-12">
              <div>
                <h3 className="text-[17px] font-medium mb-4 text-[#9a9a9a]">Narrative Intelligence</h3>
                <p className="text-[15px] text-[#5a5a5a] leading-[1.9] font-light">
                  Every character needs context. We build deep understanding into each 
                  experience—knowledge, personality, purpose—so conversations carry 
                  meaning and authenticity.
                </p>
              </div>
              
              <div>
                <h3 className="text-[17px] font-medium mb-4 text-[#9a9a9a]">Emotional Range</h3>
                <p className="text-[15px] text-[#5a5a5a] leading-[1.9] font-light">
                  Great performances require nuance. Our focus on voice, expression, and 
                  timing allows for the full spectrum of human emotion—from quiet intimacy 
                  to powerful presence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work With Us */}
      <section id="work" className="py-32 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-20">
            <span className="text-[11px] tracking-[0.3em] text-[#4a4a4a] uppercase mb-8 block">Working Together</span>
            <p className="text-[24px] font-light text-[#7a7a7a] leading-[1.6]">
              Every project starts with a conversation. 
              <span className="text-[#c4c0b8]"> Here&apos;s how we bring ideas to life.</span>
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-px bg-white/[0.03]">
            <div className="bg-[#0a0a0a] p-10">
              <div className="text-[48px] font-extralight text-[#2a2a2a] mb-6">01</div>
              <h3 className="text-[15px] font-medium mb-4 text-[#9a9a9a]">Exploration</h3>
              <p className="text-[14px] text-[#4a4a4a] leading-[1.8] font-light">
                We listen. What&apos;s the story you want to tell? Who needs to be part of it? 
                We explore the creative vision and identify where conversational video 
                can elevate the experience.
              </p>
            </div>
            
            <div className="bg-[#0a0a0a] p-10">
              <div className="text-[48px] font-extralight text-[#2a2a2a] mb-6">02</div>
              <h3 className="text-[15px] font-medium mb-4 text-[#9a9a9a]">Prototyping</h3>
              <p className="text-[14px] text-[#4a4a4a] leading-[1.8] font-light">
                Rapid iteration brings concepts to life quickly. We build working 
                prototypes that let you experience ideas before committing to 
                full production—testing, refining, discovering.
              </p>
            </div>
            
            <div className="bg-[#0a0a0a] p-10">
              <div className="text-[48px] font-extralight text-[#2a2a2a] mb-6">03</div>
              <h3 className="text-[15px] font-medium mb-4 text-[#9a9a9a]">Creation</h3>
              <p className="text-[14px] text-[#4a4a4a] leading-[1.8] font-light">
                With direction set, we build. Our team works shoulder-to-shoulder 
                with yours, combining technical craft with creative vision to 
                produce something genuinely new.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="py-32 px-8 border-t border-white/[0.03]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <span className="text-[11px] tracking-[0.3em] text-[#4a4a4a] uppercase mb-8 block">Who We Work With</span>
              <h2 className="text-[2rem] font-light leading-[1.3] tracking-[-0.02em] text-[#8a8a8a]">
                Creators who believe stories can be 
                <span className="text-[#c4c0b8]"> more than watched</span>—they can be 
                <span className="text-[#c4c0b8]"> lived</span>.
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-8 lg:pt-8">
              <div className="border-l border-white/[0.06] pl-6">
                <h3 className="text-[14px] text-[#6a6a6a] mb-2">Filmmakers</h3>
                <p className="text-[13px] text-[#4a4a4a] leading-[1.7]">
                  Extending narratives beyond the frame
                </p>
              </div>
              <div className="border-l border-white/[0.06] pl-6">
                <h3 className="text-[14px] text-[#6a6a6a] mb-2">Artists</h3>
                <p className="text-[13px] text-[#4a4a4a] leading-[1.7]">
                  Creating interactive installations and experiences
                </p>
              </div>
              <div className="border-l border-white/[0.06] pl-6">
                <h3 className="text-[14px] text-[#6a6a6a] mb-2">Storytellers</h3>
                <p className="text-[13px] text-[#4a4a4a] leading-[1.7]">
                  Building worlds audiences can inhabit
                </p>
              </div>
              <div className="border-l border-white/[0.06] pl-6">
                <h3 className="text-[14px] text-[#6a6a6a] mb-2">Visionaries</h3>
                <p className="text-[13px] text-[#4a4a4a] leading-[1.7]">
                  Exploring the edges of what&apos;s possible
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* R&D */}
      <section className="py-32 px-8 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-16">
            <div className="lg:col-span-2">
              <span className="text-[11px] tracking-[0.3em] text-[#4a4a4a] uppercase mb-8 block">Research</span>
              <h2 className="text-[2rem] font-light leading-[1.3] tracking-[-0.02em] mb-6">
                Pushing the
                <br />
                <span className="text-[#5a5a5a]">boundaries</span>
              </h2>
            </div>
            
            <div className="lg:col-span-3 lg:pt-2">
              <p className="text-[16px] text-[#6a6a6a] leading-[2] font-light mb-8">
                Some of our most meaningful work happens before a project begins. 
                We dedicate significant resources to research—exploring new techniques, 
                testing hypotheses, and building capabilities that don&apos;t exist yet.
              </p>
              <p className="text-[16px] text-[#5a5a5a] leading-[2] font-light mb-8">
                For partners interested in frontier work, we offer dedicated R&D 
                collaborations. Together, we can tackle challenges that require 
                sustained focus and deep technical investment.
              </p>
              <div className="flex items-center gap-6 pt-4">
                <div className="text-center">
                  <div className="text-[28px] font-light text-amber-500/60">∞</div>
                  <div className="text-[11px] text-[#4a4a4a] mt-1">Curiosity</div>
                </div>
                <div className="h-8 w-px bg-white/[0.06]"></div>
                <div className="text-center">
                  <div className="text-[28px] font-light text-amber-500/60">→</div>
                  <div className="text-[11px] text-[#4a4a4a] mt-1">Progress</div>
                </div>
                <div className="h-8 w-px bg-white/[0.06]"></div>
                <div className="text-center">
                  <div className="text-[28px] font-light text-amber-500/60">◎</div>
                  <div className="text-[11px] text-[#4a4a4a] mt-1">Purpose</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Narrator */}
      <section id="about" className="py-32 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-16 items-start">
            <div className="lg:col-span-2">
              <Image
                src="/Narrator_Logo_Wide_BW_White.png"
                alt="Narrator"
                width={200}
                height={50}
                className="opacity-80 mb-10"
              />
              <p className="text-[15px] text-[#5a5a5a] leading-[1.9] font-light">
                Award-winning creative agency, production hub, and post-production 
                campus partnering with storytellers worldwide to create visually 
                compelling work that celebrates diverse narratives.
              </p>
            </div>
            
            <div className="lg:col-span-3 grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-[12px] tracking-[0.2em] text-[#4a4a4a] uppercase mb-5">Our Mission</h3>
                <p className="text-[15px] text-[#6a6a6a] leading-[1.9] font-light">
                  We partner directly with artists, filmmakers, and storytellers—working 
                  shoulder to shoulder to celebrate and amplify their creative vision 
                  on a global stage.
                </p>
              </div>
              
              <div>
                <h3 className="text-[12px] tracking-[0.2em] text-[#4a4a4a] uppercase mb-5">Our Values</h3>
                <p className="text-[15px] text-[#6a6a6a] leading-[1.9] font-light">
                  We&apos;re driven to continuously innovate and expand our creative capabilities. 
                  We celebrate diverse perspectives and take full ownership of our work 
                  with transparency and integrity.
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-8 mt-20 pt-16 border-t border-white/[0.03]">
            <div>
              <div className="text-[32px] font-light text-[#6a6a6a] mb-2">10+</div>
              <div className="text-[12px] text-[#3a3a3a]">Years of storytelling</div>
            </div>
            <div>
              <div className="text-[32px] font-light text-[#6a6a6a] mb-2">100+</div>
              <div className="text-[12px] text-[#3a3a3a]">Creative partners</div>
            </div>
            <div>
              <div className="text-[32px] font-light text-[#6a6a6a] mb-2">SF</div>
              <div className="text-[12px] text-[#3a3a3a]">San Francisco based</div>
            </div>
            <div>
              <div className="text-[32px] font-light text-[#6a6a6a] mb-2">∞</div>
              <div className="text-[12px] text-[#3a3a3a]">Stories to tell</div>
            </div>
          </div>
        </div>
      </section>

      {/* Connect */}
      <section id="connect" className="py-32 px-8 bg-gradient-to-b from-[#0a0a0a] to-[#080808]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <span className="text-[11px] tracking-[0.3em] text-[#4a4a4a] uppercase mb-8 block">Let&apos;s Talk</span>
              <h2 className="text-[2.5rem] font-light leading-[1.15] tracking-[-0.02em] mb-8">
                Have a story
                <br />
                <span className="text-[#5a5a5a]">worth telling?</span>
              </h2>
              <p className="text-[16px] text-[#5a5a5a] leading-[1.9] font-light mb-10">
                We&apos;re selectively partnering with creators who are pushing boundaries. 
                If you&apos;re working on something interesting, we&apos;d like to hear from you.
              </p>
              <a
                href="mailto:research@narrator.studio"
                className="inline-flex items-center gap-4 text-[15px] text-amber-500/80 hover:text-amber-400 transition-colors duration-300"
              >
                <span>research@narrator.studio</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
            
            <div className="lg:pt-16">
              <div className="space-y-6">
                <div className="border-l-2 border-white/[0.06] pl-6">
                  <h3 className="text-[14px] text-[#6a6a6a] mb-2">Creative Partnership</h3>
                  <p className="text-[13px] text-[#4a4a4a] leading-[1.7]">
                    Have a project in mind? Let&apos;s explore how conversational video 
                    can bring your vision to life.
                  </p>
                </div>
                <div className="border-l-2 border-white/[0.06] pl-6">
                  <h3 className="text-[14px] text-[#6a6a6a] mb-2">R&D Collaboration</h3>
                  <p className="text-[13px] text-[#4a4a4a] leading-[1.7]">
                    Interested in pushing boundaries together? We&apos;re open to 
                    research partnerships with aligned organizations.
                  </p>
                </div>
                <div className="border-l-2 border-white/[0.06] pl-6">
                  <h3 className="text-[14px] text-[#6a6a6a] mb-2">Just Curious</h3>
                  <p className="text-[13px] text-[#4a4a4a] leading-[1.7]">
                    Want to learn more about what we&apos;re building? 
                    We love talking about this work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.03] py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-center gap-6">
              <span className="text-[13px] text-[#3a3a3a]">
                CONVO<span className="text-[#2a2a2a]">AI</span> Studio
              </span>
              <div className="h-3 w-px bg-white/[0.06]"></div>
              <Image
                src="/Narrator_Logo_Wide_BW_White.png"
                alt="Narrator"
                width={80}
                height={20}
                className="opacity-30"
              />
            </div>
            
            <div className="flex items-center gap-8 text-[12px] text-[#3a3a3a]">
              <span>San Francisco</span>
              <Link href="/legal/terms" className="hover:text-[#6a6a6a] transition-colors">
                Terms
              </Link>
              <Link href="/legal/privacy" className="hover:text-[#6a6a6a] transition-colors">
                Privacy
              </Link>
              <span>© 2024 Narrator</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
