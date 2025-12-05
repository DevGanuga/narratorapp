import Link from 'next/link';
import Image from 'next/image';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e6e3]">
      {/* Subtle grid pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none"></div>
      
      {/* Header */}
      <header className="border-b border-white/[0.04]">
        <nav className="max-w-4xl mx-auto px-8 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-xl font-semibold tracking-tight">
              CONVO<span className="text-[#6a6a6a]">AI</span>
            </span>
            <span className="text-[10px] tracking-[0.2em] text-[#4a4a4a] uppercase">Studio</span>
          </Link>
          <Link href="/" className="text-[13px] text-[#5a5a5a] hover:text-[#e8e6e3] transition-colors">
            ← Back to Home
          </Link>
        </nav>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-8 py-16">
        <div className="mb-12">
          <span className="text-[11px] tracking-[0.25em] text-[#5a5a5a] uppercase font-light mb-4 block">Legal</span>
          <h1 className="text-[2.5rem] font-light tracking-[-0.02em] mb-4">Terms of Use</h1>
          <p className="text-[14px] text-[#5a5a5a]">Last updated: December 4, 2024</p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none">
          <div className="space-y-8 text-[#6a6a6a] text-[15px] leading-[1.9]">
            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using ConvoAI Studio (&quot;the Service&quot;), operated by Narrator Inc. (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), 
                you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">2. Description of Service</h2>
              <p>
                ConvoAI Studio provides conversational video intelligence technology, including but not limited to:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Digital replica creation and management</li>
                <li>Real-time video conversation capabilities</li>
                <li>Custom persona configuration</li>
                <li>Voice synthesis and speech recognition</li>
                <li>Knowledge base integration</li>
                <li>API access for third-party integrations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">3. User Accounts</h2>
              <p>
                To access certain features of the Service, you may be required to create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Ensuring your account information is accurate and up-to-date</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">4. Acceptable Use</h2>
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Create content that is illegal, harmful, threatening, abusive, or otherwise objectionable</li>
                <li>Impersonate any person or entity without proper authorization</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Use the Service for any fraudulent or deceptive purposes</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">5. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are owned by Narrator Inc. and are 
                protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="mt-3">
                You retain ownership of any content you create using the Service, subject to our license to use such 
                content as necessary to provide the Service.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">6. Digital Replicas and Consent</h2>
              <p>
                When creating digital replicas, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>You have obtained all necessary consents from individuals whose likeness is used</li>
                <li>You have the right to use any training materials provided</li>
                <li>The use of digital replicas complies with all applicable laws</li>
                <li>You will not create replicas of individuals for deceptive or harmful purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Narrator Inc. shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred 
                directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from 
                your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">8. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless Narrator Inc. and its officers, directors, employees, and 
                agents from any claims, damages, losses, liabilities, and expenses arising out of your use of the 
                Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">9. Termination</h2>
              <p>
                We may terminate or suspend your access to the Service immediately, without prior notice or liability, 
                for any reason, including breach of these Terms. Upon termination, your right to use the Service will 
                immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of any material changes 
                by posting the new Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of 
                the Service after such changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">11. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of California, 
                United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">12. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-3 p-4 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                <p className="text-[#8a8a8a]">
                  Narrator Inc.<br />
                  San Francisco, CA<br />
                  <a href="mailto:legal@narrator.studio" className="text-amber-500/80 hover:text-amber-400">legal@narrator.studio</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 px-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <p className="text-[12px] text-[#3a3a3a]">© 2024 Narrator Inc.</p>
          <div className="flex gap-6">
            <Link href="/legal/privacy" className="text-[12px] text-[#4a4a4a] hover:text-[#8a8a8a] transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}





