'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Check, Zap } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.primaryEmailAddress?.emailAddress || '' }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Simple, Honest Pricing</h1>
        <p className="text-gray-500 text-lg">Start free. Upgrade when you need more.</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Free Plan */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Free</h2>
            <p className="text-gray-400 text-sm">Perfect to get started</p>
            <div className="mt-4">
              <span className="text-5xl font-bold text-gray-800">$0</span>
              <span className="text-gray-400 ml-2">/month</span>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {[
              '2 itineraries per month',
              'Basic AI travel planning',
              'PDF export',
              'Save trips',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-gray-600">
                <Check size={16} className="text-green-500 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <Link href="/dashboard" className="block w-full text-center bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
            Get Started Free
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="bg-gradient-to-br from-indigo-600 to-pink-600 rounded-3xl shadow-xl p-8 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1.5 rounded-full">
            MOST POPULAR
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Pro</h2>
            <p className="text-white/70 text-sm">For serious travelers</p>
            <div className="mt-4">
              <span className="text-5xl font-bold text-white">$3</span>
              <span className="text-white/70 ml-2">/month</span>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {[
              'Unlimited itineraries',
              'Advanced AI travel manager',
              'PDF export with branding',
              'Priority support',
              'WhatsApp trip sharing',
              'Hotel & flight comparisons',
              'Cancel anytime',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-white">
                <Check size={16} className="text-yellow-400 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Zap size={18} />
            {loading ? 'Redirecting...' : 'Start Pro — $3/month'}
          </button>
          <p className="text-white/50 text-xs text-center mt-3">No contracts. Cancel anytime.</p>
        </div>
      </div>

      <p className="text-center text-gray-400 text-sm mt-12">
        Questions? Email us at <a href="mailto:hello@tripmind.ai" className="text-indigo-600 hover:underline">hello@tripmind.ai</a>
      </p>
    </div>
  );
}