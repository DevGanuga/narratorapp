'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function TeamLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [supabaseConfigured, setSupabaseConfigured] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if Supabase is configured
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      setSupabaseConfigured(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabaseConfigured) {
      setError('Please configure Supabase first');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Dynamic import to avoid errors when not configured
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/team/dashboard');
        router.refresh();
      }
    } catch {
      setError('Connection error - check Supabase configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e6e3] flex flex-col">
      {/* Subtle grid pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none"></div>
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.04]">
        <nav className="max-w-6xl mx-auto px-8 py-5">
          <Link href="/" className="inline-flex items-center gap-4 group">
            <Image
              src="/White logo - no background.png"
              alt="Narrator"
              width={100}
              height={32}
              className="opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <div className="h-5 w-px bg-white/10"></div>
            <span className="text-[11px] tracking-[0.3em] text-[#8a8a8a] font-light uppercase">Research</span>
          </Link>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-8">
        <div className="w-full max-w-sm">
          <div className="mb-12">
            <span className="text-[11px] tracking-[0.25em] text-[#5a5a5a] uppercase font-light mb-4 block">Team Access</span>
            <h1 className="text-[2rem] font-light tracking-[-0.02em]">
              Internal Portal
            </h1>
          </div>

          {!supabaseConfigured ? (
            <div className="space-y-6">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-5">
                <h3 className="text-[14px] font-medium text-amber-400/90 mb-3">Supabase Not Configured</h3>
                <p className="text-[13px] text-[#6a6a6a] leading-relaxed mb-4">
                  To enable team authentication, add your Supabase credentials to <code className="text-[#8a8a8a]">.env.local</code>:
                </p>
                <div className="bg-black/30 rounded-lg p-4 text-[12px] font-mono text-[#6a6a6a] space-y-1">
                  <div>NEXT_PUBLIC_SUPABASE_URL=...</div>
                  <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=...</div>
                </div>
              </div>
              <p className="text-[12px] text-[#3a3a3a]">
                See <code className="text-[#5a5a5a]">SETUP.md</code> for full instructions.
              </p>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border border-white/[0.08] rounded-lg px-4 py-3.5 text-[14px] text-[#e8e6e3] placeholder-[#3a3a3a] focus:outline-none focus:border-white/20 transition-colors"
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <label 
                    htmlFor="password" 
                    className="block text-[12px] text-[#5a5a5a] tracking-wide mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border border-white/[0.08] rounded-lg px-4 py-3.5 text-[14px] text-[#e8e6e3] placeholder-[#3a3a3a] focus:outline-none focus:border-white/20 transition-colors"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </div>

                {error && (
                  <div className="text-[13px] text-red-400/80 font-light">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg px-4 py-3.5 text-[13px] tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in
                    </span>
                  ) : (
                    'Continue'
                  )}
                </button>
              </form>

              <div className="mt-12 pt-8 border-t border-white/[0.04]">
                <p className="text-[12px] text-[#3a3a3a] font-light">
                  This portal is for authorized team members only. 
                  Contact your administrator if you need access.
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
