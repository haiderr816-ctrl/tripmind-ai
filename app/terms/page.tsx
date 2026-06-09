import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-[#0f172a] mb-2">Terms of Service</h1>
        <p className="text-[#64748b] mb-8">Last updated: June 2026</p>
        <div className="space-y-6 text-[#64748b] leading-relaxed">
          <div><h2 className="font-bold text-[#0f172a] mb-2">Acceptance of Terms</h2><p>By using TripMind AI, you agree to these terms of service. If you do not agree, please do not use our service.</p></div>
          <div><h2 className="font-bold text-[#0f172a] mb-2">Use of Service</h2><p>TripMind AI provides AI-generated travel itineraries for personal use. Itineraries are suggestions only — always verify bookings independently.</p></div>
          <div><h2 className="font-bold text-[#0f172a] mb-2">Subscription & Billing</h2><p>The Pro plan is billed at $3/month. You may cancel at any time. Refunds are handled on a case-by-case basis.</p></div>
          <div><h2 className="font-bold text-[#0f172a] mb-2">Limitation of Liability</h2><p>TripMind AI is not responsible for travel disruptions, booking errors, or any losses arising from use of our itineraries.</p></div>
          <div><h2 className="font-bold text-[#0f172a] mb-2">Contact</h2><p>For questions, contact us at hello@tripmind.ai</p></div>
        </div>
        <Link href="/"><button className="mt-8 bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-bold hover:opacity-90 transition">Back to Home</button></Link>
      </div>
    </div>
  );
}