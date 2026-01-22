'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { Project, DemoSession } from '@/types/database';

interface BrandedDemoViewerProps {
  session: DemoSession;
  project: Project;
}

// Check if this project requires intake form (has intake_form_enabled in branding or is Flo-type)
function requiresIntakeForm(project: Project): boolean {
  const branding = project.branding as Record<string, unknown> | null;
  return branding?.intake_form_enabled === true ||
         project.name?.toLowerCase().includes('flo') ||
         project.name?.toLowerCase().includes('intake');
}

export function BrandedDemoViewer({ session, project }: BrandedDemoViewerProps) {
  const [conversationUrl, setConversationUrl] = useState<string | null>(session.conversation_url);
  const [loading, setLoading] = useState(!session.conversation_url);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Intake form state
  const [showIntakeForm, setShowIntakeForm] = useState(requiresIntakeForm(project));
  const [intakeData, setIntakeData] = useState({
    patientName: '',
    doctorEmail: '',
  });
  const [intakeSubmitting, setIntakeSubmitting] = useState(false);
  const [intakeError, setIntakeError] = useState<string | null>(null);

  const bgColor = project.brand_background_color || '#0a0a0a';
  const textColor = project.brand_primary_color || '#ffffff';
  const accentColor = '#f59e0b';

  // Handle intake form submission
  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!intakeData.patientName.trim()) {
      setIntakeError('Please enter your name');
      return;
    }
    if (!intakeData.doctorEmail.trim() || !intakeData.doctorEmail.includes('@')) {
      setIntakeError('Please enter a valid doctor email');
      return;
    }

    setIntakeSubmitting(true);
    setIntakeError(null);

    try {
      const response = await fetch('/api/demo/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.id,
          prospect_name: intakeData.patientName.trim(),
          report_recipient: intakeData.doctorEmail.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save intake information');
      }

      setShowIntakeForm(false);
    } catch {
      setIntakeError('Unable to save information. Please try again.');
    } finally {
      setIntakeSubmitting(false);
    }
  };

  useEffect(() => {
    if (!session.conversation_url) {
      createConversation();
    }
  }, []);

  const createConversation = async () => {
    try {
      const response = await fetch('/api/demo/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.id,
          project_id: project.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to start');
      const data = await response.json();
      setConversationUrl(data.conversation_url);
      setLoading(false);
    } catch {
      setError('Unable to start the demo. Please refresh the page.');
      setLoading(false);
    }
  };

  const handleStartDemo = () => {
    setIsTransitioning(true);
    setTimeout(() => setShowWelcome(false), 300);
  };

  // Loading State
  if (loading) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <div className="text-center px-6">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div 
              className="absolute inset-0 rounded-full border-2 opacity-20"
              style={{ borderColor: textColor }}
            />
            <div 
              className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
              style={{ borderTopColor: accentColor }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-light mb-3">Preparing Your Experience</h2>
          <p className="text-sm opacity-50">Setting up your interactive session...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-6"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-light mb-3">{error}</h2>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 rounded-xl text-sm font-medium"
            style={{ backgroundColor: `${textColor}15` }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Intake Form (for Flo and intake-enabled projects)
  if (showIntakeForm) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-6"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              <svg className="w-8 h-8" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-light mb-2">Before We Begin</h1>
            <p className="text-sm opacity-50">Please provide the following information</p>
          </div>

          {/* Form */}
          <form onSubmit={handleIntakeSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 opacity-70">Your Name</label>
              <input
                type="text"
                value={intakeData.patientName}
                onChange={(e) => setIntakeData({ ...intakeData, patientName: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all"
                style={{
                  backgroundColor: `${textColor}08`,
                  border: `1px solid ${textColor}15`,
                  color: textColor,
                }}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 opacity-70">Doctor&apos;s Email</label>
              <input
                type="email"
                value={intakeData.doctorEmail}
                onChange={(e) => setIntakeData({ ...intakeData, doctorEmail: e.target.value })}
                placeholder="doctor@clinic.com"
                className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all"
                style={{
                  backgroundColor: `${textColor}08`,
                  border: `1px solid ${textColor}15`,
                  color: textColor,
                }}
              />
              <p className="text-xs opacity-40 mt-2">
                Your intake summary will be sent to this email after the call
              </p>
            </div>

            {intakeError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">{intakeError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={intakeSubmitting}
              className="w-full py-4 rounded-xl text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: textColor, color: bgColor }}
            >
              {intakeSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Continue'
              )}
            </button>
          </form>

          {/* Privacy note */}
          <p className="text-center text-xs opacity-30 mt-6">
            Your information is handled securely and only used for this intake session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col" style={{ backgroundColor: bgColor, color: textColor }}>
      {/* Header */}
      <header 
        className="shrink-0 h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 border-b"
        style={{ borderColor: `${textColor}10`, backgroundColor: bgColor }}
      >
        {/* Left: Branding */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-sm sm:text-base font-semibold tracking-tight">
            CONVO<span className="opacity-40">AI</span>
          </span>
          <span className="hidden sm:inline text-[10px] tracking-widest uppercase opacity-30">Studio</span>
          {project.brand_name && (
            <>
              <div className="h-4 w-px mx-1" style={{ backgroundColor: `${textColor}20` }} />
              <span className="text-xs sm:text-sm opacity-60">{project.brand_name}</span>
            </>
          )}
        </div>

        {/* Center: Live indicator */}
        {!showWelcome && (
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: `${textColor}10` }}>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium opacity-70">Live</span>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={() => setShowAboutModal(true)} className="text-xs sm:text-sm opacity-50 hover:opacity-100 transition-opacity">
            About
          </button>
          {project.cta_url && (
            <a href={project.cta_url} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm opacity-50 hover:opacity-100 transition-opacity">
              {project.cta_text || 'Learn More'}
            </a>
          )}
          {!showWelcome && (
            <button
              onClick={() => setShowWelcome(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ backgroundColor: `${textColor}10` }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {/* Welcome Screen */}
        {showWelcome && (
          <div 
            className={`absolute inset-0 flex items-center justify-center p-4 sm:p-8 overflow-y-auto transition-all duration-300 ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <div className="w-full max-w-2xl py-8">
              {/* Badge */}
              <div className="text-center mb-10">
                <span 
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[11px] tracking-[0.2em] uppercase font-medium"
                  style={{ backgroundColor: `${textColor}08`, border: `1px solid ${textColor}12` }}
                >
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                  Interactive Experience
                </span>
              </div>

              {/* Title */}
              <h1 className="text-center text-4xl sm:text-5xl font-light mb-5 tracking-[-0.02em] leading-tight">
                {project.welcome_title || project.name || 'Interactive Demo'}
              </h1>

              {/* Description */}
              <p className="text-center text-lg opacity-50 max-w-lg mx-auto mb-12 leading-relaxed">
                {project.welcome_message || 'Experience an interactive conversation with our AI-powered video agent.'}
              </p>

              {/* Features - horizontal on desktop */}
              <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-12">
                {[
                  { 
                    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
                    title: 'Real-Time Video', 
                    desc: 'Face-to-face AI conversation' 
                  },
                  { 
                    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
                    title: 'Natural Speech', 
                    desc: 'Just speak naturally' 
                  },
                  { 
                    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                    title: 'Instant Response', 
                    desc: 'Low-latency interaction' 
                  }
                ].map((f, i) => (
                  <div 
                    key={i} 
                    className="flex-1 flex items-center sm:flex-col sm:items-center gap-4 p-5 rounded-2xl text-center"
                    style={{ backgroundColor: `${textColor}05`, border: `1px solid ${textColor}08` }}
                  >
                    <div 
                      className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${textColor}08`, color: accentColor }}
                    >
                      {f.icon}
                    </div>
                    <div className="sm:mt-1">
                      <div className="font-medium text-sm">{f.title}</div>
                      <div className="text-xs opacity-40 mt-0.5">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center">
                <button
                  onClick={handleStartDemo}
                  className="group inline-flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-5 rounded-2xl text-lg font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                  style={{ backgroundColor: textColor, color: bgColor }}
                >
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Start Demo
                </button>

                <div className="flex items-center justify-center gap-8 mt-10 pt-8" style={{ borderTop: `1px solid ${textColor}08` }}>
                  <div className="flex items-center gap-2 text-sm opacity-35">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Camera
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-35">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Microphone
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conversation Iframe */}
        {!showWelcome && conversationUrl && (
          <iframe
            ref={iframeRef}
            src={conversationUrl}
            className="absolute inset-0 w-full h-full border-0"
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            title="Demo"
          />
        )}

        {/* Loading state for conversation */}
        {!showWelcome && !conversationUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${textColor}30`, borderTopColor: accentColor }} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer 
        className="shrink-0 h-12 flex items-center justify-between px-4 sm:px-6 border-t"
        style={{ borderColor: `${textColor}08`, backgroundColor: bgColor }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] sm:text-xs opacity-30">CONVOAI Studio</span>
          {project.show_narrator_branding && (
            <>
              <div className="h-3 w-px" style={{ backgroundColor: `${textColor}15` }} />
              <a href="https://narrator.studio" target="_blank" rel="noopener noreferrer">
                <Image src="/Narrator_Logo_Wide_BW_White.png" alt="Narrator" width={50} height={12} className="opacity-25 hover:opacity-40 transition-opacity" />
              </a>
            </>
          )}
        </div>
        <span className="text-[10px] opacity-20">© {new Date().getFullYear()}</span>
      </footer>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowAboutModal(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div 
            className="relative w-full max-w-md rounded-2xl p-6 sm:p-8"
            style={{ backgroundColor: bgColor, border: `1px solid ${textColor}15` }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setShowAboutModal(false)} className="absolute top-4 right-4 p-2 rounded-full opacity-50 hover:opacity-100" style={{ backgroundColor: `${textColor}10` }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="text-lg font-semibold mb-1">CONVO<span className="opacity-40">AI</span> Studio</div>
              <p className="text-sm opacity-50">Conversational Video Intelligence</p>
            </div>

            <p className="text-sm opacity-60 text-center mb-6">
              Experience the future of interactive storytelling with photorealistic digital replicas that engage in natural, real-time conversations.
            </p>

            <div className="flex items-center justify-center gap-3 pt-4" style={{ borderTop: `1px solid ${textColor}10` }}>
              <span className="text-xs opacity-40">Powered by</span>
              <Image src="/Narrator_Logo_Wide_BW_White.png" alt="Narrator" width={70} height={18} className="opacity-50" />
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full mt-6 py-3 rounded-xl text-sm font-medium"
              style={{ backgroundColor: textColor, color: bgColor }}
            >
              Back to Demo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
