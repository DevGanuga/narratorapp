'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Project } from '@/types/database';
import type { PersonaDetails, ReplicaDetails } from '@/types/tavus';

type View = 'projects' | 'new-project' | 'edit-project';

interface NewProjectForm {
  name: string;
  description: string;
  partner: string;
  persona_id: string;
  replica_id: string;
  custom_greeting: string;
  conversational_context: string;
}

export function DashboardClient() {
  const router = useRouter();
  const supabase = createClient();
  const [view, setView] = useState<View>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [personas, setPersonas] = useState<PersonaDetails[]>([]);
  const [replicas, setReplicas] = useState<ReplicaDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<NewProjectForm>({
    name: '',
    description: '',
    partner: '',
    persona_id: '',
    replica_id: '',
    custom_greeting: '',
    conversational_context: '',
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
      custom_greeting: '',
      conversational_context: '',
    });
    setEditingProject(null);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        resetForm();
        setView('projects');
        loadData();
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
    
    setSaving(false);
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setSaving(true);
    
    try {
      const response = await fetch(`/api/projects/${editingProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        resetForm();
        setView('projects');
        loadData();
      }
    } catch (error) {
      console.error('Failed to update project:', error);
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
      custom_greeting: project.custom_greeting || '',
      conversational_context: project.conversational_context || '',
    });
    setView('edit-project');
  };

  const selectedPersona = personas.find(p => p.persona_id === formData.persona_id);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e6e3]">
      {/* Subtle grid pattern */}
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

      {/* Main Content */}
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

        {/* New/Edit Project View */}
        {(view === 'new-project' || view === 'edit-project') && (
          <div>
            <button
              onClick={() => { resetForm(); setView('projects'); }}
              className="inline-flex items-center gap-2 text-[13px] text-[#5a5a5a] hover:text-[#e8e6e3] transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Projects
            </button>

            <div className="max-w-2xl">
              <span className="text-[11px] tracking-[0.25em] text-[#5a5a5a] uppercase font-light mb-3 block">
                {view === 'edit-project' ? 'Edit Project' : 'New Project'}
              </span>
              <h1 className="text-[2rem] font-light tracking-[-0.02em] mb-12">
                {view === 'edit-project' ? 'Configure Experience' : 'Create Demo Experience'}
              </h1>

              <form onSubmit={view === 'edit-project' ? handleUpdateProject : handleCreateProject} className="space-y-8">
                {/* Basic Info */}
                <div className="space-y-6">
                  <h2 className="text-[13px] tracking-wide text-[#6a6a6a] uppercase">Basic Information</h2>
                  
                  <div>
                    <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">Project Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-transparent border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] placeholder-[#3a3a3a] focus:outline-none focus:border-white/20 transition-colors"
                      placeholder="e.g., Acme Corp Demo"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">Partner / Client</label>
                    <input
                      type="text"
                      value={formData.partner}
                      onChange={(e) => setFormData(prev => ({ ...prev, partner: e.target.value }))}
                      className="w-full bg-transparent border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] placeholder-[#3a3a3a] focus:outline-none focus:border-white/20 transition-colors"
                      placeholder="e.g., Acme Corporation"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-transparent border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] placeholder-[#3a3a3a] focus:outline-none focus:border-white/20 transition-colors resize-none h-24"
                      placeholder="Internal notes about this demo..."
                    />
                  </div>
                </div>

                {/* Configuration */}
                <div className="space-y-6 pt-6 border-t border-white/[0.04]">
                  <h2 className="text-[13px] tracking-wide text-[#6a6a6a] uppercase">Configuration</h2>
                  
                  <div>
                    <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">Persona *</label>
                    <select
                      value={formData.persona_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, persona_id: e.target.value }))}
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-white/20 transition-colors"
                      required
                    >
                      <option value="">Select a persona...</option>
                      {personas.map((persona) => (
                        <option key={persona.persona_id} value={persona.persona_id}>
                          {persona.persona_name}
                        </option>
                      ))}
                    </select>
                    {selectedPersona?.system_prompt && (
                      <p className="mt-2 text-[12px] text-[#3a3a3a] line-clamp-2">{selectedPersona.system_prompt}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">Replica *</label>
                    <select
                      value={formData.replica_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, replica_id: e.target.value }))}
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-white/20 transition-colors"
                      required
                    >
                      <option value="">Select a replica...</option>
                      {replicas.map((replica) => (
                        <option key={replica.replica_id} value={replica.replica_id}>
                          {replica.replica_name || `Replica ${replica.replica_id.slice(0, 8)}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Customization */}
                <div className="space-y-6 pt-6 border-t border-white/[0.04]">
                  <h2 className="text-[13px] tracking-wide text-[#6a6a6a] uppercase">Customization</h2>
                  
                  <div>
                    <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">Custom Greeting</label>
                    <textarea
                      value={formData.custom_greeting}
                      onChange={(e) => setFormData(prev => ({ ...prev, custom_greeting: e.target.value }))}
                      className="w-full bg-transparent border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] placeholder-[#3a3a3a] focus:outline-none focus:border-white/20 transition-colors resize-none h-20"
                      placeholder="Override the default greeting message..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2">Conversational Context</label>
                    <textarea
                      value={formData.conversational_context}
                      onChange={(e) => setFormData(prev => ({ ...prev, conversational_context: e.target.value }))}
                      className="w-full bg-transparent border border-white/[0.08] rounded-lg px-4 py-3 text-[14px] placeholder-[#3a3a3a] focus:outline-none focus:border-white/20 transition-colors resize-none h-32"
                      placeholder="Additional context for this specific demo (e.g., partner background, demo goals)..."
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-8">
                  <button
                    type="submit"
                    disabled={saving || !formData.name || !formData.persona_id || !formData.replica_id}
                    className="px-6 py-3 bg-white text-[#0a0a0a] rounded-lg text-[13px] font-medium tracking-wide hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : view === 'edit-project' ? 'Save Changes' : 'Create Project'}
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
          </div>
        )}
      </main>
    </div>
  );
}
