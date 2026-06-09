const fs = require('fs');
const content = `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, MapPin, Calendar, DollarSign, Heart, Loader2 } from 'lucide-react';

export default function PlanPage() {
  const router = useRouter();
  const [form, setForm] = useState({ destination: '', startDate: '', endDate: '', budget: 'Medium', interests: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!form.destination || !form.startDate || !form.endDate) {
      setError('Please fill in destination and dates.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      console.log('API response:', data);
      if (data.tripId) {
        router.push('/dashboard/trips/' + data.tripId);
      } else if (data.error) {
        setError(data.error);
      } else {
        setError('Failed to generate itinerary. Please try again.');
      }
    } catch (e: any) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
              <Sparkles size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#0f172a]">Plan a Trip ✈️</h1>
          </div>
          <p className="text-[#64748b]">Tell TripMind AI where you want to go — get a full itinerary in 30 seconds.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-violet-600 to-pink-600" />
          <div className="p-8 space-y-6">

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#0f172a] mb-2">
                <MapPin size={15} className="text-violet-500" /> Destination
              </label>
              <input type="text" placeholder="e.g. Tokyo, Japan" value={form.destination}
                onChange={e => setForm({...form, destination: e.target.value})}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-[#0f172a] placeholder-gray-400 transition" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#0f172a] mb-2">
                  <Calendar size={15} className="text-violet-500" /> Start Date
                </label>
                <input type="date" value={form.startDate}
                  onChange={e => setForm({...form, startDate: e.target.value})}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-[#0f172a] transition" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#0f172a] mb-2">
                  <Calendar size={15} className="text-violet-500" /> End Date
                </label>
                <input type="date" value={form.endDate}
                  onChange={e => setForm({...form, endDate: e.target.value})}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-[#0f172a] transition" />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#0f172a] mb-2">
                <DollarSign size={15} className="text-violet-500" /> Budget
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Budget', 'Medium', 'Luxury'].map(b => (
                  <button key={b} onClick={() => setForm({...form, budget: b})}
                    className={\`py-3 rounded-xl text-sm font-semibold border-2 transition \${form.budget === b ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 text-[#64748b] hover:border-violet-200'}\`}>
                    {b === 'Budget' ? '💰 Budget' : b === 'Medium' ? '✈️ Medium' : '👑 Luxury'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#0f172a] mb-2">
                <Heart size={15} className="text-violet-500" /> Interests
              </label>
              <input type="text" placeholder="e.g. food, hiking, museums, beaches" value={form.interests}
                onChange={e => setForm({...form, interests: e.target.value})}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-[#0f172a] placeholder-gray-400 transition" />
              <p className="text-xs text-[#64748b] mt-2">Separate with commas for better personalization</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white py-4 rounded-xl font-bold text-base hover:opacity-90 transition shadow-lg shadow-violet-200 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <><Loader2 size={20} className="animate-spin" /> Generating your itinerary...</>
              ) : (
                <><Sparkles size={20} /> Generate My Itinerary</>
              )}
            </button>

            <p className="text-center text-xs text-[#64748b]">Powered by TripMind AI · Usually takes 15-30 seconds</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { emoji: "🎯", title: "Be Specific", desc: "Add a city name for better results" },
            { emoji: "📅", title: "Set Dates", desc: "Exact dates help AI plan better" },
            { emoji: "❤️", title: "Add Interests", desc: "Personalize your experience" },
          ].map(tip => (
            <div key={tip.title} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-2xl mb-2">{tip.emoji}</div>
              <p className="font-semibold text-[#0f172a] text-sm mb-1">{tip.title}</p>
              <p className="text-xs text-[#64748b]">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('app/dashboard/plan/page.tsx', content);
console.log('Done plan');