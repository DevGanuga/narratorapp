import Link from 'next/link';
import Image from 'next/image';

export default function DemoNotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e6e3] flex flex-col items-center justify-center p-8">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none"></div>
      
      <div className="relative z-10 text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-8 border border-white/[0.08] rounded-2xl flex items-center justify-center">
          <svg className="w-10 h-10 text-[#3a3a3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-[2rem] font-light tracking-[-0.02em] mb-4">
          Demo Unavailable
        </h1>
        
        <p className="text-[15px] text-[#5a5a5a] leading-relaxed mb-8">
          This demo link has expired or is no longer available. 
          Please contact your representative for a new link.
        </p>
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] text-[#6a6a6a] hover:text-[#e8e6e3] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Return Home
        </Link>
        
        <div className="mt-16">
          <Image
            src="/White logo - no background.png"
            alt="Narrator"
            width={80}
            height={26}
            className="mx-auto opacity-30"
          />
        </div>
      </div>
    </div>
  );
}

