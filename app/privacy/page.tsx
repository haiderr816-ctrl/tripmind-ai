import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-[#0f172a] mb-2">Privacy Policy</h1>
        <p className="text-[#64748b] mb-8">Last updated: June 2026</p>
        <div className="space-y-6 text-[#64748b] leading-relaxed">
          <div><h2 className="font-bold text-[#0f172a] mb-2">Data We Collect</h2><p>We collect your email address, travel preferences, and itinerary data to provide personalized travel planning services.</p></div>
          <div><h2 className="font-bold text-[#0f172a] mb-2">How We Use Your Data</h2><p>Your data is used solely to generate and store your travel itineraries. We never sell your personal information to third parties.</p></div>
          <div><h2 className="font-bold text-[#0f172a] mb-2">Data Security</h2><p>All data is encrypted and stored securely. We use industry-standard security practices to protect your information.</p></div>
          <div><h2 className="font-bold text-[#0f172a] mb-2">Contact</h2><p>For privacy concerns, contact us at hello@tripmind.ai</p></div>
        </div>
        <Link href="/"><button className="mt-8 bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-bold hover:opacity-90 transition">Back to Home</button></Link>
      </div>
    </div>
  );
}