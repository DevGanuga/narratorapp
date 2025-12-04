import Link from 'next/link';

export default function PrivacyPage() {
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
          <h1 className="text-[2.5rem] font-light tracking-[-0.02em] mb-4">Privacy Policy</h1>
          <p className="text-[14px] text-[#5a5a5a]">Last updated: December 4, 2024</p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none">
          <div className="space-y-8 text-[#6a6a6a] text-[15px] leading-[1.9]">
            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">1. Introduction</h2>
              <p>
                Narrator Inc. (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates ConvoAI Studio. This Privacy Policy explains how we 
                collect, use, disclose, and safeguard your information when you use our Service.
              </p>
              <p className="mt-3">
                We are committed to protecting your privacy and handling your data with transparency and care.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">2. Information We Collect</h2>
              
              <h3 className="text-[16px] font-medium text-[#c4c0b8] mb-3 mt-6">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-[#8a8a8a]">Account Information:</strong> Name, email address, password, and other registration details</li>
                <li><strong className="text-[#8a8a8a]">Profile Data:</strong> Organization name, job title, and preferences</li>
                <li><strong className="text-[#8a8a8a]">Content:</strong> Video recordings, audio files, and text used to create digital replicas</li>
                <li><strong className="text-[#8a8a8a]">Communications:</strong> Messages, feedback, and support requests</li>
              </ul>

              <h3 className="text-[16px] font-medium text-[#c4c0b8] mb-3 mt-6">2.2 Information Collected Automatically</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-[#8a8a8a]">Usage Data:</strong> Features accessed, interactions, and session duration</li>
                <li><strong className="text-[#8a8a8a]">Device Information:</strong> Browser type, operating system, and device identifiers</li>
                <li><strong className="text-[#8a8a8a]">Log Data:</strong> IP address, access times, and referring URLs</li>
                <li><strong className="text-[#8a8a8a]">Cookies:</strong> Session and preference cookies for authentication and analytics</li>
              </ul>

              <h3 className="text-[16px] font-medium text-[#c4c0b8] mb-3 mt-6">2.3 Information from Third Parties</h3>
              <p>
                We may receive information from authentication providers, payment processors, and analytics services 
                that help us deliver and improve our Service.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Provide, maintain, and improve the Service</li>
                <li>Create and train digital replicas as requested</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, and security alerts</li>
                <li>Respond to your comments, questions, and support requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent transactions and abuse</li>
                <li>Personalize and improve your experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">4. Data Retention</h2>
              <p>
                We retain your information for as long as your account is active or as needed to provide you services. 
                We will retain and use your information as necessary to:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Comply with our legal obligations</li>
                <li>Resolve disputes</li>
                <li>Enforce our agreements</li>
              </ul>
              <p className="mt-3">
                Training data for digital replicas is retained for the duration of your subscription plus a reasonable 
                period for backup purposes, unless you request earlier deletion.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">5. Information Sharing</h2>
              <p>We may share your information in the following circumstances:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong className="text-[#8a8a8a]">Service Providers:</strong> Third-party vendors who assist in operating our Service</li>
                <li><strong className="text-[#8a8a8a]">Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                <li><strong className="text-[#8a8a8a]">Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong className="text-[#8a8a8a]">With Your Consent:</strong> When you explicitly authorize sharing</li>
              </ul>
              <p className="mt-3">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">6. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your information, including:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and penetration testing</li>
                <li>Access controls and authentication requirements</li>
                <li>Employee training on data protection</li>
                <li>Incident response procedures</li>
              </ul>
              <p className="mt-3">
                However, no method of transmission over the Internet or electronic storage is 100% secure, and we 
                cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">7. Your Rights</h2>
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong className="text-[#8a8a8a]">Access:</strong> Request a copy of your personal data</li>
                <li><strong className="text-[#8a8a8a]">Correction:</strong> Request correction of inaccurate data</li>
                <li><strong className="text-[#8a8a8a]">Deletion:</strong> Request deletion of your personal data</li>
                <li><strong className="text-[#8a8a8a]">Portability:</strong> Request transfer of your data to another service</li>
                <li><strong className="text-[#8a8a8a]">Objection:</strong> Object to certain processing activities</li>
                <li><strong className="text-[#8a8a8a]">Restriction:</strong> Request restriction of processing</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, please contact us at the information provided below.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">8. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. 
                These countries may have different data protection laws. When we transfer your information, we take 
                appropriate steps to ensure your information remains protected.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">9. Children&apos;s Privacy</h2>
              <p>
                Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal 
                information from children. If you become aware that a child has provided us with personal information, 
                please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">10. California Privacy Rights</h2>
              <p>
                If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA):
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Right to know what personal information is collected</li>
                <li>Right to know whether personal information is sold or disclosed</li>
                <li>Right to say no to the sale of personal information</li>
                <li>Right to equal service and price</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to 
                review this Privacy Policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-[18px] font-medium text-[#e8e6e3] mb-4">12. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="mt-3 p-4 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                <p className="text-[#8a8a8a]">
                  Narrator Inc.<br />
                  Privacy Team<br />
                  San Francisco, CA<br />
                  <a href="mailto:privacy@narrator.studio" className="text-amber-500/80 hover:text-amber-400">privacy@narrator.studio</a>
                </p>
              </div>
              <p className="mt-4">
                For EU/EEA residents, you also have the right to lodge a complaint with your local data protection authority.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 px-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <p className="text-[12px] text-[#3a3a3a]">© 2024 Narrator Inc.</p>
          <div className="flex gap-6">
            <Link href="/legal/terms" className="text-[12px] text-[#4a4a4a] hover:text-[#8a8a8a] transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
