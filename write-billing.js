const fs = require('fs');
const content = `'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Check, Zap, CreditCard, Sparkles, Shield } from 'lucide-react';

export default function BillingPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.primaryEmailAddress?.emailAddress || '' }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch { alert('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
              <CreditCard size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#0f172a]">Billing & Plans 💳</h1>
          </div>
          <p className="text-[#64748b]">Simple pricing. No hidden fees. Cancel anytime.</p>
        </div>

        {/* Current Plan Banner */}
        <div className="bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-100 rounded-2xl p-5 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-violet-100">
              <Sparkles size={18} className="text-violet-600" />
            </div>
            <div>
              <p className="font-bold text-[#0f172a]">You're on the Free Plan</p>
              <p className="text-sm text-[#64748b]">Upgrade to Pro for unlimited trips and features</p>
            </div>
          </div>
          <span className="bg-white text-violet-700 text-xs font-bold px-3 py-1.5 rounded-full border border-violet-100 shadow-sm">
            Free
          </span>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Free */}
          <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#0f172a] mb-1">Free Plan</h2>
            <p className="text-[#64748b] text-sm mb-5">Perfect to get started</p>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-5xl font-bold text-[#0f172a]">$0</span>
              <span className="text-[#64748b] mb-1.5">/forever</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "2 AI itineraries per month",
                "Basic trip planning",
                "PDF export",
                "Save & view trips"
              ].map(f => (
                <li key={f} className="flex items-center gap-3 text-[#64748b] text-sm">
                  <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center shrink-0 border border-green-100">
                    <Check size={12} className="text-green-600" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <button disabled className="w-full py-3 rounded-xl font-semibold bg-[#f8fafc] text-[#64748b] border-2 border-gray-200 cursor-not-allowed">
              Current Plan
            </button>
          </div>

          {/* Pro */}
          <div className="bg-gradient-to-br from-violet-600 to-pink-600 rounded-3xl p-8 shadow-xl shadow-violet-200 relative text-white">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
              MOST POPULAR ⭐
            </div>
            <h2 className="text-xl font-bold mb-1">Pro Plan</h2>
            <p className="text-white/70 text-sm mb-5">For serious travelers</p>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-5xl font-bold">$3</span>
              <span className="text-white/70 mb-1.5">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "Unlimited AI itineraries",
                "AI Travel Manager Sarah",
                "PDF export with branding",
                "Hotel & flight comparisons",
                "WhatsApp trip sharing",
                "Priority support",
                "Cancel anytime"
              ].map(f => (
                <li key={f} className="flex items-center gap-3 text-white text-sm">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0 border border-white/30">
                    <Check size={12} className="text-yellow-300" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <button onClick={handleUpgrade} disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold bg-white text-violet-700 hover:bg-violet-50 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg">
              <Zap size={16} />
              {loading ? 'Redirecting to Stripe...' : 'Upgrade to Pro — $3/month'}
            </button>
            <p className="text-white/50 text-xs text-center mt-3">No contracts. Cancel anytime.</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center border border-violet-100">
              <CreditCard size={18} className="text-violet-600" />
            </div>
            <div>
              <h3 className="font-bold text-[#0f172a]">Payment Method</h3>
              <p className="text-sm text-[#64748b]">Securely processed by Stripe</p>
            </div>
          </div>
          <p className="text-[#64748b] text-sm mb-4">No payment method added yet. Upgrade to Pro to add one.</p>
          <button onClick={handleUpgrade}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-violet-200 text-sm">
            <CreditCard size={15} /> Add Payment Method
          </button>
        </div>

        {/* Security Note */}
        <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl p-4">
          <Shield size={18} className="text-green-600 shrink-0" />
          <p className="text-sm text-green-700">All payments are secured with 256-bit SSL encryption via Stripe. We never store your card details.</p>
        </div>

      </div>
    </div>
  );
}
`;
fs.writeFileSync('app/dashboard/billing/page.tsx', content);
console.log('Done billing');