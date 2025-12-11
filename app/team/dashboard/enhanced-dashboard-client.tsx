'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Project } from '@/types/database';
import type { PersonaDetails, ReplicaDetails } from '@/types/tavus';

type View = 'projects' | 'new-project' | 'edit-project';
type FormTab = 'basic' | 'branding' | 'customization' | 'advanced';

interface EnhancedProjectForm {
  // Basic
  name: string;
  description: string;
  partner: string;
  persona_id: string;
  replica_id: string;

  // Branding
  brand_name: string;
  brand_logo_url: string;
  brand_primary_color: string;
  brand_background_color: string;

  // Customization
  welcome_title: string;
  welcome_message: string;
  instructions: string;
  custom_greeting: string;
  conversational_context: string;
  cta_text: string;
  cta_url: string;

  // Advanced
  session_duration_hours: number;
  show_narrator_branding: boolean;
}

export function EnhancedDashboardClient() {
  const router = useRouter();
  const supabase = createClient();
  const [view, setView] = useState<View>('projects');
  const [activeTab, setActiveTab] = useState<FormTab>('basic');
  const [projects, setProjects] = useState<Project[]>([]);
  const [personas, setPersonas] = useState<PersonaDetails[]>([]);
  const [replicas, setReplicas] = useState<ReplicaDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<EnhancedProjectForm>({
    name: '',
    description: '',
    partner: '',
    persona_id: '',
    replica_id: '',
    brand_name: '',
    brand_logo_url: '',
    brand_primary_color: '#ffffff',
    brand_background_color: '#0a0a0a',
    welcome_title: '',
    welcome_message: '',
    instructions: '',
    custom_greeting: '',
    conversational_context: '',
    cta_text: '',
    cta_url: '',
    session_duration_hours: 24,
    show_narrator_branding: true,
  });
  const [saving, setSaving] = useState(false);
  const [generatingLink, setGeneratingLink] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [projectsRes, personasRes, replicasRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/personas'),
        fetch('/api/replicas'),
      ]);

      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(data);
      }
      if (personasRes.ok) {
        const data = await personasRes.json();
        setPersonas(data.data || []);
      }
      if (replicasRes.ok) {
        const data = await replicasRes.json();
        setReplicas((data.data || []).filter((r: ReplicaDetails) => r.status === 'completed'));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/team/login');
    router.refresh();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      partner: '',
      persona_id: '',
      replica_id: '',
      brand_name: '',
      brand_logo_url: '',
      brand_primary_color: '#ffffff',
      brand_background_color: '#0a0a0a',
      welcome_title: '',
      welcome_message: '',
      instructions: '',
      custom_greeting: '',
      conversational_context: '',
      cta_text: '',
      cta_url: '',
      session_duration_hours: 24,
      show_narrator_branding: true,
    });
    setEditingProject(null);
    setActiveTab('basic');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : '/api/projects';

      const method = editingProject ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        resetForm();
        setView('projects');
        loadData();
      }
    } catch (error) {
      console.error('Failed to save project:', error);
    }

    setSaving(false);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return;

    try {
      const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (response.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleToggleStatus = async (project: Project) => {
    const newStatus = project.status === 'active' ? 'draft' : 'active';

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleGenerateLink = async (projectId: string) => {
    setGeneratingLink(projectId);

    try {
      const response = await fetch(`/api/projects/${projectId}/demo-link`, {
        method: 'POST',
      });

      if (response.ok) {
        const { demo_url } = await response.json();
        await navigator.clipboard.writeText(demo_url);
        alert('Demo link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to generate link:', error);
    }

    setGeneratingLink(null);
  };

  const startEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      partner: project.partner || '',
      persona_id: project.persona_id,
      replica_id: project.replica_id,
      brand_name: project.brand_name || '',
      brand_logo_url: project.brand_logo_url || '',
      brand_primary_color: project.brand_primary_color || '#ffffff',
      brand_background_color: project.brand_background_color || '#0a0a0a',
      welcome_title: project.welcome_title || '',
      welcome_message: project.welcome_message || '',
      instructions: project.instructions || '',
      custom_greeting: project.custom_greeting || '',
      conversational_context: project.conversational_context || '',
      cta_text: project.cta_text || '',
      cta_url: project.cta_url || '',
      session_duration_hours: project.session_duration_hours || 24,
      show_narrator_branding: project.show_narrator_branding ?? true,
    });
    setView('edit-project');
  };

  const selectedPersona = personas.find(p => p.persona_id === formData.persona_id);

  const tabs: { id: FormTab; label: string; icon: string }[] = [
    { id: 'basic', label: 'Basic Info', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'branding', label: 'Branding', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
    { id: 'customization', label: 'Content', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { id: 'advanced', label: 'Advanced', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e6e3]">
      {/* Grid pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.04] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/White logo - no background.png"
              alt="Narrator"
              width={100}
              height={32}
              className="opacity-90"
            />
            <div className="h-5 w-px bg-white/10"></div>
            <span className="text-[11px] tracking-[0.3em] text-[#8a8a8a] font-light uppercase">Admin</span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-[13px] text-[#5a5a5a] hover:text-[#e8e6e3] transition-colors"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="text-[13px] text-[#5a5a5a] hover:text-[#e8e6e3] transition-colors"
            >
              Sign Out
            </button>
          </div>
        </nav>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        {/* Projects List View */}
        {view === 'projects' && (
          <div>
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-[11px] tracking-[0.25em] text-[#5a5a5a] uppercase font-light mb-3 block">Demo Projects</span>
                <h1 className="text-[2rem] font-light tracking-[-0.02em]">
                  Manage Experiences
                </h1>
              </div>
              <button
                onClick={() => { resetForm(); setView('new-project'); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg text-[13px] tracking-wide transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                New Project
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border border-white/20 border-t-white/60 rounded-full animate-spin"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="border border-white/[0.04] rounded-xl p-16 text-center">
                <div className="w-12 h-12 mx-auto mb-6 border border-white/[0.08] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#3a3a3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-[#5a5a5a] mb-2">No projects yet</p>
                <p className="text-[13px] text-[#3a3a3a]">Create your first demo experience to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="group border border-white/[0.04] hover:border-white/[0.08] rounded-xl p-6 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-[16px] font-medium truncate">{project.name}</h3>
                          <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full ${
                            project.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : project.status === 'archived'
                              ? 'bg-white/[0.02] text-[#4a4a4a] border border-white/[0.04]'
                              : 'bg-amber-500/10 text-amber-400/80 border border-amber-500/20'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        {project.partner && (
                          <p className="text-[13px] text-[#5a5a5a] mb-1">Partner: {project.partner}</p>
                        )}
                        {project.description && (
                          <p className="text-[13px] text-[#4a4a4a] line-clamp-1">{project.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-4 text-[12px] text-[#3a3a3a]">
                          <span>{project.demo_count || 0} demos</span>
                          <span>·</span>
                          <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleToggleStatus(project)}
                          className="p-2 hover:bg-white/[0.04] rounded-lg transition-colors"
                          title={project.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          <svg className={`w-4 h-4 ${project.status === 'active' ? 'text-emerald-400' : 'text-[#4a4a4a]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => startEdit(project)}
                          className="p-2 hover:bg-white/[0.04] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4 text-[#5a5a5a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleGenerateLink(project.id)}
                          disabled={project.status !== 'active' || generatingLink === project.id}
                          className="p-2 hover:bg-white/[0.04] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Generate Demo Link"
                        >
                          {generatingLink === project.id ? (
                            <svg className="w-4 h-4 text-[#5a5a5a] animate-spin" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-[#5a5a5a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          )}
                        </button>
                        <Link
                          href={`/demo/preview/${project.id}`}
                          className="p-2 hover:bg-white/[0.04] rounded-lg transition-colors"
                          title="Preview"
                        >
                          <svg className="w-4 h-4 text-[#5a5a5a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4 text-[#5a5a5a] hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Form View - New/Edit Project */}
        {(view === 'new-project' || view === 'edit-project') && (
          <div>
            <div className="flex items-center justify-between mb-12">
              <div>
                <button
                  onClick={() => { resetForm(); setView('projects'); }}
                  className="inline-flex items-center gap-2 text-[13px] text-[#5a5a5a] hover:text-[#e8e6e3] transition-colors mb-4"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Projects
                </button>
                <h1 className="text-[2rem] font-light tracking-[-0.02em]">
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h1>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-white/[0.04] mb-8">
              <div className="flex gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 text-[13px] border-b-2 transition-all ${
                      activeTab === tab.id
                        ? 'border-white/40 text-[#e8e6e3]'
                        : 'border-transparent text-[#5a5a5a] hover:text-[#8a8a8a]'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
                    </svg>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-3xl">
              {/* Tab 1: Basic Info */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-transparent border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-white/20 transition-colors"
                      placeholder="BB King Performance Demo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-transparent border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-white/20 transition-colors resize-none"
                      placeholder="Interactive performance for venue demos"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">
                      Partner/Client
                    </label>
                    <input
                      type="text"
                      value={formData.partner}
                      onChange={(e) => setFormData({ ...formData, partner: e.target.value })}
                      className="w-full bg-transparent border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-white/20 transition-colors"
                      placeholder="Will Rogers Theatre"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">
                      Persona *
                    </label>
                    <select
                      value={formData.persona_id}
                      onChange={(e) => setFormData({ ...formData, persona_id: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-white/20 transition-colors"
                      required
                    >
                      <option value="">Select a persona...</option>
                      {personas.filter((p: any) => p.persona_type === 'user').length > 0 && (
                        <optgroup label="Your Personas">
                          {personas
                            .filter((p: any) => p.persona_type === 'user')
                            .map((persona) => (
                              <option key={persona.persona_id} value={persona.persona_id}>
                                {persona.persona_name}
                              </option>
                            ))}
                        </optgroup>
                      )}
                      {personas.filter((p: any) => p.persona_type === 'system').length > 0 && (
                        <optgroup label="Tavus System Personas">
                          {personas
                            .filter((p: any) => p.persona_type === 'system')
                            .map((persona) => (
                              <option key={persona.persona_id} value={persona.persona_id}>
                                {persona.persona_name}
                              </option>
                            ))}
                        </optgroup>
                      )}
                    </select>
                    {selectedPersona && (
                      <p className="mt-2 text-[12px] text-[#5a5a5a]">
                        {selectedPersona.context?.substring(0, 150)}...
                      </p>
                    )}
                    <p className="mt-2 text-[12px] text-[#4a4a4a]">
                      {personas.filter((p: any) => p.persona_type === 'user').length} your personas, {personas.filter((p: any) => p.persona_type === 'system').length} Tavus personas
                    </p>
                  </div>

                  <div>
                    <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">
                      Replica *
                    </label>
                    <select
                      value={formData.replica_id}
                      onChange={(e) => setFormData({ ...formData, replica_id: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-white/20 transition-colors"
                      required
                    >
                      <option value="">Select a replica...</option>
                      {replicas.filter((r: any) => r.replica_type === 'user').length > 0 && (
                        <optgroup label="Your Replicas">
                          {replicas
                            .filter((r: any) => r.replica_type === 'user')
                            .map((replica) => (
                              <option key={replica.replica_id} value={replica.replica_id}>
                                {replica.replica_name}
                              </option>
                            ))}
                        </optgroup>
                      )}
                      {replicas.filter((r: any) => r.replica_type === 'system').length > 0 && (
                        <optgroup label="Tavus System Replicas">
                          {replicas
                            .filter((r: any) => r.replica_type === 'system')
                            .map((replica) => (
                              <option key={replica.replica_id} value={replica.replica_id}>
                                {replica.replica_name}
                              </option>
                            ))}
                        </optgroup>
                      )}
                    </select>
                    <p className="mt-2 text-[12px] text-[#4a4a4a]">
                      {replicas.filter((r: any) => r.replica_type === 'user').length} your replicas, {replicas.filter((r: any) => r.replica_type === 'system').length} Tavus replicas
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Branding */}
              {activeTab === 'branding' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={formData.brand_name}
                      onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                      className="w-full bg-transparent border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-white/20 transition-colors"
                      placeholder="Will Rogers Productions"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">
                      Brand Logo URL
                    </label>
                    <input
                      type="url"
                      value={formData.brand_logo_url}
                      onChange={(e) => setFormData({ ...formData, brand_logo_url: e.target.value })}
                      className="w-full bg-transparent border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-white/20 transition-colors"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">
                        Primary Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={formData.brand_primary_color}
                          onChange={(e) => setFormData({ ...formData, brand_primary_color: e.target.value })}
                          className="w-12 h-10 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.brand_primary_color}
                          onChange={(e) => setFormData({ ...formData, brand_primary_color: e.target.value })}
                          className="flex-1 bg-transparent border border-white/[0.08] rounded-lg px-4 py-2 text-[14px] focus:outline-none focus:border-white/20 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">
                        Background Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={formData.brand_background_color}
                          onChange={(e) => setFormData({ ...formData, brand_background_color: e.target.value })}
                          className="w-12 h-10 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.brand_background_color}
                          onChange={(e) => setFormData({ ...formData, brand_background_color: e.target.value })}
                          className="flex-1 bg-transparent border border-white/[0.08] rounded-lg px-4 py-2 text-[14px] focus:outline-none focus:border-white/20 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Content */}
              {activeTab === 'customization' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">
                      Welcome Title
                    </label>
                    <input
                      type="text"
                      value={formData.welcome_title}
                      onChange={(e) => setFormData({ ...formData, welcome_title: e.target.value })}
                      className="w-full bg-transparent border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-white/20 transition-colors"
                      placeholder="Experience BB King AI"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">
                      Welcome Message
                    </label>
                    <textarea
                      value={formData.welcome_message}
                      onChange={(e) => setFormData({ ...formData, welcome_message: e.target.value })}
                      className="w-full bg-transparent border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-white/20 transition-colors resize-none"
                      placeholder="Interactive conversation with the legend"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">
                      Instructions
                    </label>
                    <textarea
                      value={formData.instructions}
                      onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                      className="w-full bg-transparent border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-white/20 transition-colors resize-none"
                      placeholder="Click 'Start Conversation' and speak naturally"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">
                      Custom Greeting
                      <span className="text-[#4a4a4a] ml-2">(AI's first words)</span>
                    </label>
                    <textarea
                      value={formData.custom_greeting}
                      onChange={(e) => setFormData({ ...formData, custom_greeting: e.target.value })}
                      className="w-full bg-transparent border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-white/20 transition-colors resize-none"
                      placeholder="Hey there! I'm BB King. Ready to talk about the blues?"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">
                      Conversational Context
                      <span className="text-[#4a4a4a] ml-2">(Additional persona instructions)</span>
                    </label>
                    <textarea
                      value={formData.conversational_context}
                      onChange={(e) => setFormData({ ...formData, conversational_context: e.target.value })}
                      className="w-full bg-transparent border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-white/20 transition-colors resize-none"
                      placeholder="You are BB King performing at Will Rogers Theatre. Discuss blues history, guitar techniques..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">
                        Call-to-Action Text
                      </label>
                      <input
                        type="text"
                        value={formData.cta_text}
                        onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                        className="w-full bg-transparent border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-white/20 transition-colors"
                        placeholder="Book This Experience"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">
                        CTA URL
                      </label>
                      <input
                        type="url"
                        value={formData.cta_url}
                        onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                        className="w-full bg-transparent border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-white/20 transition-colors"
                        placeholder="https://example.com/book"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Advanced */}
              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">
                      Session Duration (hours)
                    </label>
                    <input
                      type="number"
                      value={formData.session_duration_hours}
                      onChange={(e) => setFormData({ ...formData, session_duration_hours: parseInt(e.target.value) || 24 })}
                      className="w-full bg-transparent border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-white/20 transition-colors"
                      min="1"
                      max="168"
                    />
                    <p className="mt-2 text-[12px] text-[#4a4a4a]">
                      How long demo links remain valid (1-168 hours)
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.show_narrator_branding}
                        onChange={(e) => setFormData({ ...formData, show_narrator_branding: e.target.checked })}
                        className="w-4 h-4 rounded border-white/[0.08] bg-transparent"
                      />
                      <span className="text-[13px] text-[#8a8a8a]">
                        Show "Powered by Narrator" branding
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex items-center gap-4 mt-12 pt-8 border-t border-white/[0.04]">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.08] rounded-lg text-[13px] tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                </button>
                <button
                  type="button"
                  onClick={() => { resetForm(); setView('projects'); }}
                  className="px-6 py-3 text-[13px] text-[#5a5a5a] hover:text-[#e8e6e3] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
