'use client';

import { useState, useEffect, useRef } from 'react';
import type { Project, DemoSession } from '@/types/database';

interface BrandedDemoViewerProps {
  session: DemoSession;
  project: Project;
}

export function BrandedDemoViewer({ session, project }: BrandedDemoViewerProps) {
  const [conversationUrl, setConversationUrl] = useState<string | null>(session.conversation_url);
  const [loading, setLoading] = useState(!session.conversation_url);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(!!project.welcome_message);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const bgColor = project.brand_background_color || '#0a0a0a';
  const textColor = project.brand_primary_color || '#ffffff';
  
  // Calculate accent color
  const getAccentColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#d97706' : '#f59e0b';
  };
  const accentColor = getAccentColor(textColor);

  useEffect(() => {
    setMounted(true);
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

      if (!response.ok) {
        throw new Error('Failed to start conversation');
      }

      const data = await response.json();
      setConversationUrl(data.conversation_url);
      setLoading(false);
    } catch (err) {
      setError('Unable to start the demo. Please try refreshing the page.');
      setLoading(false);
    }
  };

  const handleStartDemo = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowWelcome(false);
    }, 400);
  };

  // Custom CSS for animations
  const animationStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(1deg); }
    }
    @keyframes pulse-ring {
      0% { transform: scale(0.95); opacity: 0.5; }
      50% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(0.95); opacity: 0.5; }
    }
    @keyframes gradient-shift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    @keyframes fade-up {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scale-in {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-fade-up { animation: fade-up 0.8s ease-out forwards; }
    .animate-fade-up-delay-1 { animation: fade-up 0.8s ease-out 0.1s forwards; opacity: 0; }
    .animate-fade-up-delay-2 { animation: fade-up 0.8s ease-out 0.2s forwards; opacity: 0; }
    .animate-fade-up-delay-3 { animation: fade-up 0.8s ease-out 0.3s forwards; opacity: 0; }
    .animate-fade-up-delay-4 { animation: fade-up 0.8s ease-out 0.4s forwards; opacity: 0; }
    .animate-scale-in { animation: scale-in 0.6s ease-out 0.5s forwards; opacity: 0; }
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }
  `;

  if (loading) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <style>{animationStyles}</style>
        
        {/* Animated background elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[120px] animate-float"
            style={{ backgroundColor: `${accentColor}15` }}
          />
          <div 
            className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full blur-[100px] animate-float"
            style={{ backgroundColor: `${textColor}10`, animationDelay: '-3s' }}
          />
        </div>
        
        {/* Grid pattern */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-30"
          style={{ 
            backgroundImage: `linear-gradient(${textColor}08 1px, transparent 1px), linear-gradient(90deg, ${textColor}08 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        
        <div className="text-center relative z-10 px-6">
          {/* Animated loader */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-10">
            <div 
              className="absolute inset-0 rounded-full animate-pulse-ring"
              style={{ border: `1px solid ${textColor}20` }}
            />
            <div 
              className="absolute inset-2 rounded-full animate-pulse-ring"
              style={{ border: `1px solid ${textColor}15`, animationDelay: '-0.5s' }}
            />
            <div 
              className="absolute inset-0 rounded-full animate-spin"
              style={{ 
                borderTop: `2px solid ${accentColor}`,
                borderRight: '2px solid transparent',
                borderBottom: '2px solid transparent',
                borderLeft: '2px solid transparent',
                animationDuration: '1.5s'
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${textColor}08` }}
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-light mb-4 tracking-tight">Preparing Your Experience</h2>
          <p className="text-sm sm:text-base max-w-xs mx-auto" style={{ opacity: 0.5 }}>
            Setting up your interactive video session...
          </p>
          
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ 
                  backgroundColor: accentColor,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center p-6 relative overflow-hidden"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <style>{animationStyles}</style>
        
        {/* Grid pattern */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-30"
          style={{ 
            backgroundImage: `linear-gradient(${textColor}08 1px, transparent 1px), linear-gradient(90deg, ${textColor}08 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        
        <div className="max-w-md text-center relative z-10 animate-fade-up">
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-8 rounded-3xl flex items-center justify-center"
            style={{ backgroundColor: '#ef444415', border: '1px solid #ef444425' }}
          >
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light mb-4">{error}</h2>
          <p className="text-sm sm:text-base mb-10" style={{ opacity: 0.5 }}>
            Don't worry—this happens sometimes. A quick refresh usually fixes it.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-sm sm:text-base font-medium transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: `${textColor}10`,
              border: `1px solid ${textColor}15`,
            }}
          >
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-dvh flex flex-col relative overflow-hidden"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <style>{animationStyles}</style>
      
      {/* Animated background elements */}
      {showWelcome && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute top-1/4 -right-20 sm:-right-32 w-64 sm:w-[500px] h-64 sm:h-[500px] rounded-full blur-[100px] sm:blur-[150px] animate-float"
            style={{ backgroundColor: `${accentColor}12` }}
          />
          <div 
            className="absolute bottom-1/4 -left-20 sm:-left-32 w-48 sm:w-[400px] h-48 sm:h-[400px] rounded-full blur-[80px] sm:blur-[120px] animate-float"
            style={{ backgroundColor: `${textColor}08`, animationDelay: '-3s' }}
          />
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px]"
            style={{ backgroundColor: `${accentColor}05` }}
          />
        </div>
      )}
      
      {/* Grid pattern */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{ 
          backgroundImage: `linear-gradient(${textColor}05 1px, transparent 1px), linear-gradient(90deg, ${textColor}05 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          opacity: showWelcome ? 0.5 : 0.3
        }}
      />

      {/* Header */}
      <header
        className={`relative z-20 border-b px-4 sm:px-6 lg:px-8 py-4 sm:py-5 backdrop-blur-xl transition-all duration-500 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
        style={{ 
          borderColor: `${textColor}08`,
          backgroundColor: `${bgColor}80`
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            {project.brand_logo_url ? (
              <img
                src={project.brand_logo_url}
                alt={project.brand_name || 'Logo'}
                className="h-7 sm:h-8 object-contain"
                style={{ maxHeight: '40px' }}
              />
            ) : project.brand_name ? (
              <span className="text-base sm:text-lg font-medium tracking-tight">{project.brand_name}</span>
            ) : null}
          </div>
          
          {/* Live indicator when in conversation */}
          {!showWelcome && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${textColor}08` }}>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium" style={{ opacity: 0.7 }}>Live</span>
            </div>
          )}
          
          {project.cta_text && project.cta_url && !showWelcome && (
            <a
              href={project.cta_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: `${textColor}10`,
                border: `1px solid ${textColor}12`,
              }}
            >
              {project.cta_text}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </header>

      {/* Welcome Screen */}
      {showWelcome && (
        <div 
          className={`flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 transition-all duration-500 ${
            isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          <div className="max-w-4xl w-full">
            {/* Hero Section */}
            <div className="text-center mb-10 sm:mb-16">
              {/* Status badge */}
              <div className={`inline-flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-full mb-8 sm:mb-12 ${mounted ? 'animate-fade-up' : ''}`}
                style={{ backgroundColor: `${textColor}06`, border: `1px solid ${textColor}08` }}
              >
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                <span className="text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] uppercase font-medium" style={{ opacity: 0.7 }}>
                  Interactive Experience
                </span>
              </div>
              
              {project.welcome_title && (
                <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-6 sm:mb-8 tracking-[-0.02em] leading-[1.1] ${mounted ? 'animate-fade-up-delay-1' : ''}`}>
                  {project.welcome_title}
                </h1>
              )}
              
              {project.welcome_message && (
                <p className={`text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto ${mounted ? 'animate-fade-up-delay-2' : ''}`} style={{ opacity: 0.65 }}>
                  {project.welcome_message}
                </p>
              )}
            </div>

            {/* Features Grid */}
            <div className={`mb-10 sm:mb-14 ${mounted ? 'animate-fade-up-delay-3' : ''}`}>
              <div 
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl sm:rounded-3xl"
                style={{ backgroundColor: `${textColor}03`, border: `1px solid ${textColor}06` }}
              >
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    ),
                    title: 'Real-Time Video',
                    desc: 'Face-to-face conversation powered by AI'
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    ),
                    title: 'Natural Speech',
                    desc: 'Just speak naturally—no scripts needed'
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ),
                    title: 'Instant Response',
                    desc: 'Low-latency, fluid interaction'
                  }
                ].map((feature, i) => (
                  <div 
                    key={i}
                    className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-0 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                    style={{ backgroundColor: `${textColor}03` }}
                  >
                    <div 
                      className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center sm:mb-4"
                      style={{ backgroundColor: `${textColor}06`, border: `1px solid ${textColor}08` }}
                    >
                      <span style={{ color: accentColor }}>{feature.icon}</span>
                    </div>
                    <div className="sm:text-left">
                      <h3 className="text-sm sm:text-base font-medium mb-1">{feature.title}</h3>
                      <p className="text-xs sm:text-sm leading-relaxed" style={{ opacity: 0.5 }}>
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className={`text-center ${mounted ? 'animate-scale-in' : ''}`}>
              <button
                onClick={handleStartDemo}
                className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 sm:px-12 py-5 sm:py-6 rounded-2xl text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl active:scale-[0.98] overflow-hidden"
                style={{
                  backgroundColor: textColor,
                  color: bgColor,
                }}
              >
                {/* Shimmer effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${bgColor}20, transparent)`,
                    animation: 'gradient-shift 2s ease infinite',
                    backgroundSize: '200% 100%'
                  }}
                />
                
                <span className="relative flex items-center gap-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Start Demo
                </span>
              </button>
              
              {/* Permission note with icons */}
              <div 
                className="flex items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10 pt-6 sm:pt-8"
                style={{ borderTop: `1px solid ${textColor}08` }}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" style={{ opacity: 0.4 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs sm:text-sm" style={{ opacity: 0.4 }}>Camera</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" style={{ opacity: 0.4 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <span className="text-xs sm:text-sm" style={{ opacity: 0.4 }}>Microphone</span>
                </div>
              </div>
              
              <p className="text-[11px] sm:text-xs mt-4" style={{ opacity: 0.3 }}>
                We'll ask for permission when you start
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Conversation Iframe */}
      {!showWelcome && conversationUrl && (
        <div className="flex-1 relative z-10">
          <iframe
            ref={iframeRef}
            src={conversationUrl}
            className="absolute inset-0 w-full h-full border-0"
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            title="Conversational AI Demo"
          />
        </div>
      )}

      {/* Footer */}
      <footer
        className={`relative z-20 border-t px-4 sm:px-6 lg:px-8 py-4 sm:py-5 backdrop-blur-xl transition-all duration-500 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ 
          borderColor: `${textColor}06`,
          backgroundColor: `${bgColor}80`
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-[11px] sm:text-xs" style={{ opacity: 0.35 }}>
            {project.show_narrator_branding ? (
              <span className="flex items-center gap-1.5">
                Powered by{' '}
                <a
                  href="https://narrator.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity font-medium"
                >
                  Narrator
                </a>
              </span>
            ) : (
              <span>© {new Date().getFullYear()} {project.brand_name || 'All rights reserved'}</span>
            )}
          </div>
          
          {project.cta_url && showWelcome && (
            <a
              href={project.cta_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] sm:text-xs transition-all duration-300 hover:opacity-80"
              style={{ opacity: 0.4 }}
            >
              {project.cta_text || 'Learn More'}
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          )}
        </div>
      </footer>
    </div>
  );
}
