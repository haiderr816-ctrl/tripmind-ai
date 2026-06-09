'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, MapPin, Calendar, DollarSign, Heart, Loader2, Globe, Plus, X } from 'lucide-react';

function parseDateString(raw: string): string {
  if (!raw) return '';
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  try {
    // Handle "July 10", "Aug 10", "August 10" etc
    const year = new Date().getFullYear();
    // Try with current year
    let d = new Date(`${raw} ${year}`);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    // Try next year (for dates that have passed)
    d = new Date(`${raw} ${year + 1}`);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  } catch {}
  return '';
}

function PlanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    country: '',
    cities: [''],
    startDate: '',
    endDate: '',
    budget: 'Medium',
    interests: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoSubmitting, setAutoSubmitting] = useState(false);

  useEffect(() => {
    const destination = searchParams.get('destination');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const budget = searchParams.get('budget');
    const interests = searchParams.get('interests');

    if (!destination) return;

    const parts = destination.split(',').map(s => s.trim()).filter(Boolean);
    const country = parts[parts.length - 1] || destination;
    const cities = parts.length > 1 ? parts.slice(0, -1) : [''];

    const parsedStart = parseDateString(startDate || '');
    const parsedEnd = parseDateString(endDate || '');

    let mappedBudget = 'Medium';
    const b = (budget || '').toLowerCase();
    if (b.includes('budget') || b.includes('500')) mappedBudget = 'Budget';
    else if (b.includes('luxury') || b.includes('3000')) mappedBudget = 'Luxury';

    setForm({
      country,
      cities: cities.length > 0 ? cities : [''],
      startDate: parsedStart,
      endDate: parsedEnd,
      budget: mappedBudget,
      interests: interests || ''
    });

    if (destination && parsedStart && parsedEnd) {
      setAutoSubmitting(true);
      setLoading(true);

      const filledCities = cities.filter(c => c.trim());
      const dest = filledCities.length > 0 ? `${filledCities.join(', ')}, ${country}` : country;

      fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: dest,
          country,
          cities: filledCities,
          startDate: parsedStart,
          endDate: parsedEnd,
          budget: mappedBudget,
          interests: interests || ''
        })
      })
        .then(r => r.json())
        .then(data => {
          if (data.tripId) {
            router.push('/dashboard/trips/' + data.tripId);
          } else {
            setError(data.error || 'Failed to generate. Please fill the form and try again.');
            setLoading(false);
            setAutoSubmitting(false);
          }
        })
        .catch(() => {
          setError('Something went wrong. Please try again.');
          setLoading(false);
          setAutoSubmitting(false);
        });
    }
  }, []);

  function addCity() {
    setForm({ ...form, cities: [...form.cities, ''] });
  }

  function removeCity(i: number) {
    const updated = form.cities.filter((_, idx) => idx !== i);
    setForm({ ...form, cities: updated.length ? updated : [''] });
  }

  function updateCity(i: number, value: string) {
    const updated = [...form.cities];
    updated[i] = value;
    setForm({ ...form, cities: updated });
  }

  async function handleSubmit() {
    if (!form.country || !form.startDate || !form.endDate) {
      setError('Please fill in country and dates.');
      return;
    }
    const filledCities = form.cities.filter(c => c.trim());
    const destination = filledCities.length > 0
      ? `${filledCities.join(', ')}, ${form.country}`
      : form.country;

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          country: form.country,
          cities: filledCities,
          startDate: form.startDate,
          endDate: form.endDate,
          budget: form.budget,
          interests: form.interests
        })
      });
      const data = await res.json();
      if (data.tripId) {
        router.push('/dashboard/trips/' + data.tripId);
      } else {
        setError(data.error || 'Failed to generate itinerary. Please try again.');
      }
    } catch {
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

        {autoSubmitting && (
          <div className="mb-6 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl p-4 flex items-center gap-3 text-white shadow-lg shadow-violet-200">
            <Loader2 size={20} className="animate-spin shrink-0" />
            <div>
              <p className="font-bold text-sm">Generating your itinerary from Sarah's chat...</p>
              <p className="text-white/80 text-xs">Usually takes 15-30 seconds. Hang tight! ✨</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-violet-600 to-pink-600" />
          <div className="p-8 space-y-6">

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#0f172a] mb-2">
                <Globe size={15} className="text-violet-500" /> Country
              </label>
              <input type="text" placeholder="e.g. Japan, France, Thailand"
                value={form.country}
                onChange={e => setForm({ ...form, country: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-[#0f172a] placeholder-gray-400 transition" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#0f172a] mb-2">
                <MapPin size={15} className="text-violet-500" /> Cities to Visit
                <span className="text-xs text-[#64748b] font-normal">(optional — leave blank for full country plan)</span>
              </label>
              <div className="space-y-2">
                {form.cities.map((city, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" placeholder={`City ${i + 1} — e.g. Tokyo`}
                      value={city}
                      onChange={e => updateCity(i, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-[#0f172a] placeholder-gray-400 transition" />
                    {form.cities.length > 1 && (
                      <button onClick={() => removeCity(i)}
                        className="w-11 h-11 flex items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 transition">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                {form.cities.length < 5 && (
                  <button onClick={addCity}
                    className="flex items-center gap-2 text-sm text-violet-600 font-semibold hover:text-violet-700 transition mt-1">
                    <Plus size={15} /> Add another city
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#0f172a] mb-2">
                  <Calendar size={15} className="text-violet-500" /> Start Date
                </label>
                <input type="date" value={form.startDate}
                  onChange={e => setForm({ ...form, startDate: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-[#0f172a] transition" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#0f172a] mb-2">
                  <Calendar size={15} className="text-violet-500" /> End Date
                </label>
                <input type="date" value={form.endDate}
                  onChange={e => setForm({ ...form, endDate: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-[#0f172a] transition" />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#0f172a] mb-2">
                <DollarSign size={15} className="text-violet-500" /> Budget
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Budget', 'Medium', 'Luxury'].map(b => (
                  <button key={b} onClick={() => setForm({ ...form, budget: b })}
                    className={`py-3 rounded-xl text-sm font-semibold border-2 transition ${form.budget === b ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 text-[#64748b] hover:border-violet-200'}`}>
                    {b === 'Budget' ? '💰 Budget' : b === 'Medium' ? '✈️ Medium' : '👑 Luxury'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#0f172a] mb-2">
                <Heart size={15} className="text-violet-500" /> Interests
              </label>
              <input type="text" placeholder="e.g. food, hiking, museums, beaches"
                value={form.interests}
                onChange={e => setForm({ ...form, interests: e.target.value })}
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
            { emoji: "🌍", title: "Pick a Country", desc: "Start with country, add cities for multi-city trips" },
            { emoji: "📅", title: "Set Dates", desc: "Exact dates help AI plan city by city" },
            { emoji: "❤️", title: "Add Interests", desc: "Personalize every day of your trip" },
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

export default function PlanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex items-center gap-3 text-violet-600">
          <Loader2 size={24} className="animate-spin" />
          <span className="font-semibold">Loading...</span>
        </div>
      </div>
    }>
      <PlanForm />
    </Suspense>
  );
}