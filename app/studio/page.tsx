'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  createConversationAction,
  endConversationAction,
  listPersonasAction,
  listReplicasAction,
  getConversationAction,
} from '@/lib/tavus-server';
import type { PersonaDetails, ReplicaDetails } from '@/types/tavus';

interface ConversationState {
  conversationId: string | null;
  conversationUrl: string | null;
  status: 'setup' | 'loading' | 'active' | 'ending' | 'ended' | 'error';
  error: string | null;
  startTime: number | null;
}

export default function StudioPage() {
  const [conversation, setConversation] = useState<ConversationState>({
    conversationId: null,
    conversationUrl: null,
    status: 'setup',
    error: null,
    startTime: null,
  });

  const [personas, setPersonas] = useState<PersonaDetails[]>([]);
  const [replicas, setReplicas] = useState<ReplicaDetails[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<PersonaDetails | null>(null);
  const [selectedReplica, setSelectedReplica] = useState<ReplicaDetails | null>(null);
  const [loadingResources, setLoadingResources] = useState(true);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    async function loadResources() {
      setLoadingResources(true);
      const [personasResult, replicasResult] = await Promise.all([
        listPersonasAction({ limit: 50 }),
        listReplicasAction({ limit: 50, verbose: true }),
      ]);

      if (personasResult.success) {
        setPersonas(personasResult.data.data);
      }
      if (replicasResult.success) {
        const completedReplicas = replicasResult.data.data.filter(r => r.status === 'completed');
        setReplicas(completedReplicas);
      }
      setLoadingResources(false);
    }
    loadResources();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (conversation.status === 'active' && conversation.startTime) {
      interval = setInterval(() => {
        setDuration(Math.floor((Date.now() - conversation.startTime!) / 1000));
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [conversation.status, conversation.startTime]);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    if (conversation.status === 'active' && conversation.conversationId) {
      pollInterval = setInterval(async () => {
        const result = await getConversationAction(conversation.conversationId!, false);
        if (result.success && result.data.status === 'ended') {
          setConversation(prev => ({ ...prev, status: 'ended' }));
        }
      }, 5000);
    }
    return () => { if (pollInterval) clearInterval(pollInterval); };
  }, [conversation.status, conversation.conversationId]);

  const startConversation = async () => {
    if (!selectedPersona || !selectedReplica) return;

    setConversation({
      conversationId: null,
      conversationUrl: null,
      status: 'loading',
      error: null,
      startTime: null,
    });
    setDuration(0);

    const result = await createConversationAction({
      replica_id: selectedReplica.replica_id,
      persona_id: selectedPersona.persona_id,
      conversation_name: `${selectedPersona.persona_name} - ${new Date().toLocaleString()}`,
    });

    if (result.success) {
      setConversation({
        conversationId: result.data.conversation_id,
        conversationUrl: result.data.conversation_url,
        status: 'active',
        error: null,
        startTime: Date.now(),
      });
    } else {
      setConversation({
        conversationId: null,
        conversationUrl: null,
        status: 'error',
        error: result.error,
        startTime: null,
      });
    }
  };

  const endConversation = async () => {
    if (!conversation.conversationId) return;
    setConversation(prev => ({ ...prev, status: 'ending' }));
    const result = await endConversationAction(conversation.conversationId);
    if (result.success) {
      setConversation(prev => ({ ...prev, status: 'ended' }));
    } else {
      setConversation(prev => ({ ...prev, status: 'error', error: result.error }));
    }
  };

  const backToSetup = () => {
    setConversation({
      conversationId: null,
      conversationUrl: null,
      status: 'setup',
      error: null,
      startTime: null,
    });
    setDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isInConversation = ['loading', 'active', 'ending'].includes(conversation.status);

  // Setup Screen
  if (conversation.status === 'setup') {
  return (
      <div className="min-h-screen bg-black text-white overflow-auto">
        {/* Premium Header */}
        <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
          <nav className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3 transition-opacity hover:opacity-70">
              <svg className="w-4 h-4 text-gray-500 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
              <span className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">Home</span>
          </Link>
          
            <div className="flex items-center gap-3">
              <Image 
                src="/White logo - no background.png" 
                alt="ConvoAI" 
                width={100} 
                height={32}
                className="opacity-90"
              />
              <div className="h-6 w-px bg-white/10"></div>
              <span className="text-lg font-light tracking-wider text-gray-300">STUDIO</span>
            </div>
            
            <div className="w-16"></div>
        </nav>
      </header>

        {/* Main Content with proper spacing for fixed header */}
        <main className="pt-32 pb-20 px-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50"></div>
                <span className="text-gray-300">New Session</span>
                    </div>
              <h1 className="text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-gray-200 to-gray-400">
                Configure Your Experience
              </h1>
              <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
                Select a persona and replica to begin your intelligent video conversation
              </p>
                  </div>

            {loadingResources ? (
              <div className="text-center py-32">
                <div className="relative inline-block mb-8">
                  <div className="w-20 h-20 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin"></div>
                  <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-xl"></div>
                </div>
                <p className="text-gray-400 text-lg font-light">Loading resources...</p>
                </div>
              ) : (
              <div className="space-y-16">
                {/* Persona Selection */}
                <div className="animate-fade-in">
                  <div className="flex items-end justify-between mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-1 h-8 bg-linear-to-b from-purple-500 to-purple-600 rounded-full"></div>
                        <h2 className="text-3xl font-bold">Persona</h2>
                      </div>
                      <p className="text-gray-400 ml-7">Choose the conversational intelligence</p>
                    </div>
                    <div className="text-sm text-gray-600 font-mono">{personas.length} AVAILABLE</div>
                  </div>

                  {personas.length === 0 ? (
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-20 text-center backdrop-blur-sm">
                      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 mb-2 font-light">No personas configured</p>
                      <p className="text-gray-700 text-sm">Create one in your Tavus dashboard</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {personas.map((persona, idx) => (
                        <button
                          key={persona.persona_id}
                          onClick={() => setSelectedPersona(persona)}
                          style={{ animationDelay: `${idx * 50}ms` }}
                          className={`group relative text-left p-8 rounded-2xl border transition-all duration-500 animate-fade-in ${
                            selectedPersona?.persona_id === persona.persona_id
                              ? 'bg-white/[0.04] border-purple-500/50 shadow-2xl shadow-purple-500/10'
                              : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
                          }`}
                        >
                          {/* Selection glow effect */}
                          {selectedPersona?.persona_id === persona.persona_id && (
                            <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-purple-500/10 via-purple-600/5 to-transparent"></div>
                          )}
                          
                          <div className="relative flex items-start gap-6">
                            {/* Avatar/Icon */}
                            <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 ${
                              selectedPersona?.persona_id === persona.persona_id
                                ? 'bg-linear-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30'
                                : 'bg-white/5 group-hover:bg-white/10'
                            }`}>
                              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                  </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-xl font-semibold text-white">{persona.persona_name}</h3>
                                {selectedPersona?.persona_id === persona.persona_id && (
                                  <div className="flex items-center gap-1.5 text-xs text-purple-400 font-medium">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    SELECTED
                </div>
              )}
            </div>
                              {persona.system_prompt && (
                                <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">
                                  {persona.system_prompt}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-2">
                                {persona.pipeline_mode && (
                                  <span className="text-xs px-3 py-1 bg-white/5 rounded-full text-gray-500 border border-white/5">
                                    {persona.pipeline_mode}
                                  </span>
                                )}
                                {persona.document_ids && persona.document_ids.length > 0 && (
                                  <span className="text-xs px-3 py-1 bg-blue-500/10 rounded-full text-blue-400 border border-blue-500/20">
                                    {persona.document_ids.length} document{persona.document_ids.length > 1 ? 's' : ''}
                                  </span>
                                )}
              </div>
            </div>
                </div>
                        </button>
                      ))}
              </div>
            )}
          </div>

                {/* Replica Selection */}
                <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                  <div className="flex items-end justify-between mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-1 h-8 bg-linear-to-b from-blue-500 to-blue-600 rounded-full"></div>
                        <h2 className="text-3xl font-bold">Replica</h2>
                      </div>
                      <p className="text-gray-400 ml-7">Choose your digital avatar</p>
                    </div>
                    <div className="text-sm text-gray-600 font-mono">{replicas.length} READY</div>
                  </div>

                  {replicas.length === 0 ? (
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-20 text-center backdrop-blur-sm">
                      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                      </div>
                      <p className="text-gray-500 mb-2 font-light">No replicas available</p>
                      <p className="text-gray-700 text-sm">Train one in your Tavus dashboard</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {replicas.map((replica, idx) => (
                        <button
                          key={replica.replica_id}
                          onClick={() => setSelectedReplica(replica)}
                          style={{ animationDelay: `${idx * 50}ms` }}
                          className={`group relative text-left p-8 rounded-2xl border transition-all duration-500 animate-fade-in ${
                            selectedReplica?.replica_id === replica.replica_id
                              ? 'bg-white/[0.04] border-blue-500/50 shadow-2xl shadow-blue-500/10'
                              : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
                          }`}
                        >
                          {selectedReplica?.replica_id === replica.replica_id && (
                            <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500/10 via-blue-600/5 to-transparent"></div>
                          )}
                          
                          <div className="relative flex items-start gap-6">
                            <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 ${
                              selectedReplica?.replica_id === replica.replica_id
                                ? 'bg-linear-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30'
                                : 'bg-white/5 group-hover:bg-white/10'
                            }`}>
                              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-xl font-semibold text-white">
                                  {replica.replica_name || `Replica ${replica.replica_id.slice(0, 8)}`}
                                </h3>
                                {selectedReplica?.replica_id === replica.replica_id && (
                                  <div className="flex items-center gap-1.5 text-xs text-blue-400 font-medium">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                                    SELECTED
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <span className="text-xs px-3 py-1 bg-green-500/10 rounded-full text-green-400 border border-green-500/20 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                  Ready
                                </span>
                                {replica.training_progress && (
                                  <span className="text-xs px-3 py-1 bg-white/5 rounded-full text-gray-500 border border-white/5">
                                    {replica.training_progress}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Section */}
                <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                  {selectedPersona && selectedReplica ? (
                    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Ready to Start</h3>
                          <p className="text-sm text-gray-400">
                            <span className="text-purple-400 font-medium">{selectedPersona.persona_name}</span>
                            {' '} with {' '}
                            <span className="text-blue-400 font-medium">{selectedReplica.replica_name || 'your replica'}</span>
                          </p>
                        </div>
                      </div>
                <button
                        onClick={startConversation}
                        className="w-full py-5 rounded-xl font-semibold text-lg transition-all duration-300 bg-white text-black hover:bg-gray-100 shadow-2xl hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                        Launch Conversation
                </button>
              </div>
                  ) : (
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center backdrop-blur-sm">
                      <p className="text-gray-500 font-light">Select a persona and replica above to continue</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer Branding */}
        <footer className="border-t border-white/5 py-8">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <p className="text-sm text-gray-600">
              ConvoAI Studio <span className="text-gray-700">·</span> Powered by <span className="text-gray-500">NR8R</span>
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Conversation Screen
  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      <header className="border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <nav className="px-8 py-5 flex items-center justify-between">
                <button
            onClick={backToSetup}
            disabled={isInConversation}
            className="group flex items-center gap-2 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-70"
                >
            <svg className="w-4 h-4 text-gray-500 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
            <span className="text-sm text-gray-500 group-hover:text-gray-400">Back</span>
                </button>

          <div className="flex items-center gap-3">
            <Image 
              src="/White logo - no background.png" 
              alt="ConvoAI" 
              width={80} 
              height={24}
              className="opacity-90"
            />
            <div className="h-5 w-px bg-white/10"></div>
            <span className="text-base font-light tracking-wider text-gray-400">STUDIO</span>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <div className={`w-2 h-2 rounded-full ${
              conversation.status === 'active' ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50' : 
              conversation.status === 'loading' ? 'bg-yellow-500 animate-pulse' : 
              'bg-gray-500'
            }`} />
            <span className="text-sm text-gray-400 font-light">
              {conversation.status === 'active' ? 'Live' : 
               conversation.status === 'loading' ? 'Connecting' : 
               conversation.status === 'ending' ? 'Ending' :
               'Offline'}
            </span>
          </div>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="w-full max-w-7xl relative">
          <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {conversation.status === 'active' && conversation.conversationUrl ? (
              <iframe
                src={conversation.conversationUrl}
                className="absolute inset-0 w-full h-full"
                allow="camera; microphone; autoplay; display-capture; fullscreen"
                title="Tavus Conversation"
              />
            ) : conversation.status === 'loading' ? (
              <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-gray-950 to-black">
                <div className="text-center">
                  <div className="relative inline-block mb-8">
                    <div className="w-24 h-24 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin"></div>
                    <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-xl"></div>
                  </div>
                  <p className="text-2xl font-light mb-3">Connecting to {selectedReplica?.replica_name || 'Replica'}</p>
                  <p className="text-gray-500">Initializing secure video session...</p>
                </div>
              </div>
            ) : conversation.status === 'error' ? (
              <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-gray-950 to-black">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-light mb-4">Connection Failed</h3>
                  <p className="text-gray-400 mb-8 font-light">{conversation.error}</p>
                <button
                    onClick={backToSetup}
                    className="px-8 py-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl transition-all"
                >
                    Return to Setup
                </button>
              </div>
            </div>
            ) : conversation.status === 'ended' ? (
              <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-gray-950 to-black">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-light mb-4">Session Complete</h3>
                  <p className="text-gray-500 mb-2">Duration: {formatDuration(duration)}</p>
                  <p className="text-gray-700 text-sm mb-8 font-mono">{conversation.conversationId}</p>
                  <button
                    onClick={backToSetup}
                    className="px-8 py-3 bg-white text-black hover:bg-gray-100 rounded-xl transition-all font-medium"
                  >
                    New Conversation
                  </button>
                </div>
              </div>
            ) : null}

            {conversation.status === 'active' && (
              <>
                <div className="absolute top-6 left-6">
                  <div className="px-4 py-2 bg-black/80 backdrop-blur-md rounded-full text-sm border border-white/10 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="font-light">LIVE</span>
                  </div>
                </div>
                <div className="absolute top-6 right-6">
                  <div className="px-4 py-2 bg-black/80 backdrop-blur-md rounded-full text-sm border border-white/10 font-mono font-light">
                    {formatDuration(duration)}
                  </div>
                </div>
              </>
            )}
          </div>

          {conversation.status === 'active' && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={endConversation}
                className="px-12 py-4 rounded-xl font-semibold transition-all duration-300 bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-500/20 hover:scale-105 active:scale-95 flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                End Session
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
