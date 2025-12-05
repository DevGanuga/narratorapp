'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const bgColor = project.brand_background_color || '#0a0a0a';
  const textColor = project.brand_primary_color || '#ffffff';

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
    setShowWelcome(false);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <div className="text-center">
          <div
            className="w-12 h-12 border-2 border-t-current rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: `${textColor}20`, borderTopColor: textColor }}
          ></div>
          <p style={{ opacity: 0.6 }}>Preparing your demo experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-8"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <div className="max-w-md text-center">
          <div
            className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${textColor}10` }}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ opacity: 0.6 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium mb-3">{error}</h2>
          <p style={{ opacity: 0.5 }}>If the problem persists, please contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* Header */}
      <header
        className="border-b px-8 py-5"
        style={{ borderColor: `${textColor}08` }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {project.brand_logo_url ? (
              <img
                src={project.brand_logo_url}
                alt={project.brand_name || 'Logo'}
                className="h-8 object-contain"
                style={{ maxHeight: '40px' }}
              />
            ) : project.brand_name ? (
              <span className="text-lg font-medium">{project.brand_name}</span>
            ) : null}
          </div>
          {project.cta_text && project.cta_url && !showWelcome && (
            <a
              href={project.cta_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: `${textColor}10`,
                border: `1px solid ${textColor}20`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${textColor}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${textColor}10`;
              }}
            >
              {project.cta_text}
            </a>
          )}
        </div>
      </header>

      {/* Welcome Screen */}
      {showWelcome && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-2xl text-center">
            {project.welcome_title && (
              <h1 className="text-4xl font-light mb-6 tracking-tight">
                {project.welcome_title}
              </h1>
            )}
            {project.welcome_message && (
              <p className="text-lg mb-8 leading-relaxed" style={{ opacity: 0.8 }}>
                {project.welcome_message}
              </p>
            )}
            {project.instructions && (
              <div
                className="rounded-lg p-6 mb-8 text-left"
                style={{ backgroundColor: `${textColor}05`, border: `1px solid ${textColor}10` }}
              >
                <h3 className="text-sm font-medium mb-3 uppercase tracking-wider" style={{ opacity: 0.6 }}>
                  How It Works
                </h3>
                <p className="text-sm leading-relaxed" style={{ opacity: 0.8 }}>
                  {project.instructions}
                </p>
              </div>
            )}
            <button
              onClick={handleStartDemo}
              className="px-8 py-4 rounded-lg text-base font-medium transition-all"
              style={{
                backgroundColor: textColor,
                color: bgColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Start Demo
            </button>
          </div>
        </div>
      )}

      {/* Conversation Iframe */}
      {!showWelcome && conversationUrl && (
        <div className="flex-1 relative">
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
        className="border-t px-8 py-4 text-center"
        style={{ borderColor: `${textColor}08` }}
      >
        <div className="text-xs" style={{ opacity: 0.4 }}>
          {project.show_narrator_branding ? (
            <span>
              Powered by{' '}
              <a
                href="https://narrator.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                Narrator
              </a>
            </span>
          ) : (
            <span>© {new Date().getFullYear()} {project.brand_name || 'All rights reserved'}</span>
          )}
        </div>
      </footer>
    </div>
  );
}
