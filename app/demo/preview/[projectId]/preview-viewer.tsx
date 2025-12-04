'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  partner?: string;
  persona_id: string;
  persona_name?: string;
  replica_id: string;
  replica_name?: string;
  custom_greeting?: string;
  conversational_context?: string;
}

interface PreviewViewerProps {
  project: Project;
}

export function PreviewViewer({ project }: PreviewViewerProps) {
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
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replica_id: project.replica_id,
          persona_id: project.persona_id,
          conversation_name: `${project.name} - Preview`,
          custom_greeting: project.custom_greeting,
          conversational_context: project.conversational_context,
        }),
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

  const endConversation = () => {
    setStatus('ended');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e6e3] flex flex-col">
      {/* Subtle grid pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none"></div>
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.04] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/team/dashboard" className="flex items-center gap-2 text-[13px] text-[#5a5a5a] hover:text-[#e8e6e3] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[11px] tracking-wider uppercase px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400/80 border border-amber-500/20">
              Preview Mode
            </span>
            {status === 'active' && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] rounded-full border border-white/[0.06]">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[12px] text-[#8a8a8a] font-mono">{formatDuration(duration)}</span>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex items-center justify-center p-8">
        <div className="w-full max-w-5xl">
          {/* Ready State */}
          {status === 'ready' && (
            <div className="text-center">
              <div className="mb-12">
                <span className="text-[11px] tracking-[0.25em] text-[#5a5a5a] uppercase font-light mb-4 block">
                  Previewing
                </span>
                <h1 className="text-[2.5rem] font-light tracking-[-0.02em] mb-4">
                  {project.name}
                </h1>
                {project.partner && (
                  <p className="text-[14px] text-[#5a5a5a] mb-6">Partner: {project.partner}</p>
                )}
                
                <div className="max-w-md mx-auto text-left bg-white/[0.02] border border-white/[0.04] rounded-xl p-6 mb-8">
                  <h3 className="text-[12px] tracking-wide text-[#6a6a6a] uppercase mb-4">Configuration</h3>
                  <div className="space-y-3 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-[#5a5a5a]">Persona</span>
                      <span className="text-[#8a8a8a]">{project.persona_name || project.persona_id.slice(0, 12)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5a5a5a]">Replica</span>
                      <span className="text-[#8a8a8a]">{project.replica_name || project.replica_id.slice(0, 12)}...</span>
                    </div>
                    {project.custom_greeting && (
                      <div className="pt-3 border-t border-white/[0.04]">
                        <span className="text-[#5a5a5a] block mb-1">Greeting</span>
                        <span className="text-[#6a6a6a] text-[12px] line-clamp-2">{project.custom_greeting}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={startConversation}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#0a0a0a] rounded-xl text-[14px] font-medium tracking-wide hover:bg-white/90 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Test Conversation
              </button>
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
              <p className="text-[14px] text-[#5a5a5a]">Initializing conversation...</p>
            </div>
          )}

          {/* Active State */}
          {status === 'active' && conversationUrl && (
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl">
              <iframe
                src={conversationUrl}
                className="absolute inset-0 w-full h-full"
                allow="camera; microphone; autoplay; display-capture; fullscreen"
                title="Preview Conversation"
              />
              
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
              <h2 className="text-[1.5rem] font-light mb-4">Preview Complete</h2>
              <p className="text-[14px] text-[#5a5a5a] mb-8">Duration: {formatDuration(duration)}</p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setStatus('ready')}
                  className="px-6 py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg text-[13px] transition-colors"
                >
                  Test Again
                </button>
                <Link
                  href="/team/dashboard"
                  className="px-6 py-3 bg-white text-[#0a0a0a] rounded-lg text-[13px] font-medium hover:bg-white/90 transition-colors"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
