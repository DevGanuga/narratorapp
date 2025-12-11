'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface DemoSession {
  id: string;
  project_id: string;
  status: string;
  expires_at: string;
  conversation_id?: string;
  conversation_url?: string;
}

interface Project {
  id: string;
  name: string;
  custom_greeting?: string;
  branding?: {
    logo_url?: string;
    company_name?: string;
    primary_color?: string;
  } | null;
}

interface DemoViewerProps {
  session: DemoSession;
  project: Project;
}

export function DemoViewer({ session, project }: DemoViewerProps) {
  const [status, setStatus] = useState<'ready' | 'loading' | 'active' | 'ended' | 'error'>('ready');
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'active' && startTime) {
      interval = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [status, startTime]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startConversation = async () => {
    setStatus('loading');
    setError(null);

    try {
      const response = await fetch('/api/demo/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: session.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to start conversation');
      }

      const data = await response.json();
      setConversationUrl(data.conversation_url);
      setStatus('active');
      setStartTime(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStatus('error');
    }
  };

  const endConversation = async () => {
    setStatus('ended');
  };

  const branding = project.branding;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e6e3] flex flex-col">
      {/* Subtle grid pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none"></div>
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.04] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {branding?.logo_url ? (
              <img 
                src={branding.logo_url} 
                alt={branding?.company_name || 'Partner'} 
                className="h-8 object-contain"
              />
            ) : (
              <Image
                src="/White logo - no background.png"
                alt="Narrator"
                width={100}
                height={32}
                className="opacity-90"
              />
            )}
            {branding?.company_name && (
              <>
                <div className="h-5 w-px bg-white/10"></div>
                <span className="text-[13px] text-[#6a6a6a]">{branding.company_name}</span>
              </>
            )}
          </div>
          
          {status === 'active' && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] rounded-full border border-white/[0.06]">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[12px] text-[#8a8a8a] font-mono">{formatDuration(duration)}</span>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex items-center justify-center p-8">
        <div className="w-full max-w-5xl">
          {/* Ready State */}
          {status === 'ready' && (
            <div className="text-center">
              <div className="mb-12">
                <div className="w-20 h-20 mx-auto mb-8 border border-white/[0.08] rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#4a4a4a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-[2.5rem] font-light tracking-[-0.02em] mb-4">
                  {project.name}
                </h1>
                {project.custom_greeting ? (
                  <p className="text-[15px] text-[#5a5a5a] leading-relaxed max-w-lg mx-auto">
                    {project.custom_greeting}
                  </p>
                ) : (
                  <p className="text-[15px] text-[#5a5a5a] leading-relaxed max-w-lg mx-auto">
                    Experience an interactive conversation with our AI-powered video agent.
                  </p>
                )}
              </div>
              
              <button
                onClick={startConversation}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#0a0a0a] rounded-xl text-[14px] font-medium tracking-wide hover:bg-white/90 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Start Demo
              </button>
              
              <div className="mt-12 pt-8 border-t border-white/[0.04]">
                <p className="text-[12px] text-[#3a3a3a]">
                  This demo will use your camera and microphone for the video conversation.
                </p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-8">
                <div className="absolute inset-0 border border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-t border-white/60 rounded-full animate-spin"></div>
              </div>
              <h2 className="text-[1.5rem] font-light mb-4">Connecting</h2>
              <p className="text-[14px] text-[#5a5a5a]">Initializing your session...</p>
            </div>
          )}

          {/* Active State */}
          {status === 'active' && conversationUrl && (
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl">
              <iframe
                src={conversationUrl}
                className="absolute inset-0 w-full h-full"
                allow="camera; microphone; autoplay; display-capture; fullscreen"
                title="Demo Conversation"
              />
              
              {/* Overlay Controls */}
              <div className="absolute bottom-6 right-6">
                <button
                  onClick={endConversation}
                  className="px-5 py-2.5 bg-red-500/90 hover:bg-red-500 text-white rounded-lg text-[13px] font-medium transition-colors"
                >
                  End Session
                </button>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-8 border border-red-500/20 bg-red-500/5 rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-red-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-[1.5rem] font-light mb-4">Connection Error</h2>
              <p className="text-[14px] text-[#5a5a5a] mb-8">{error}</p>
              <button
                onClick={() => setStatus('ready')}
                className="px-6 py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg text-[13px] transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Ended State */}
          {status === 'ended' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-8 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-emerald-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-[1.5rem] font-light mb-4">Session Complete</h2>
              <p className="text-[14px] text-[#5a5a5a] mb-2">Duration: {formatDuration(duration)}</p>
              <p className="text-[13px] text-[#3a3a3a]">Thank you for trying our demo.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.04] py-6 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[11px] text-[#3a3a3a]">
            Powered by Narrator Research · Conversational Video Intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}
