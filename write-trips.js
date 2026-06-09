const fs = require('fs');
const path = require('path');

const content = `'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ArrowRight, Plus, Sparkles, Clock, Trash2 } from 'lucide-react';
import Link from 'next/link';

function TripCard({ trip, onDelete }: { trip: any, onDelete: (id: string) => void }) {
  const [photo, setPhoto] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch(\`/api/photo?query=\${encodeURIComponent(trip.destination + ' city landmark')}\`)
      .then(r => r.json())
      .then(d => { if (d.url) setPhoto(d.url); });
  }, [trip.destination]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-violet-100 transition group overflow-hidden">
      <div className="relative h-44 bg-gradient-to-br from-violet-500 to-pink-500 overflow-hidden cursor-pointer"
        onClick={() => router.push('/dashboard/trips/' + trip.id)}>
        {photo ? (
          <img src={photo} alt={trip.destination} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-400 to-pink-400 animate-pulse" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <h3 className="text-white font-bold text-lg capitalize">{trip.destination}</h3>
        </div>
        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-2.5 py-1 text-white text-xs font-semibold capitalize">
          {trip.budget}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
            <Calendar size={13} className="text-violet-400" /> {trip.startDate}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
            <Clock size={13} className="text-pink-400" /> {trip.endDate}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-violet-400" />
            <span className="text-xs text-violet-600 font-semibold">AI Generated</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onDelete(trip.id)}
              className="text-gray-300 hover:text-red-400 transition p-1">
              <Trash2 size={15} />
            </button>
            <button onClick={() => router.push('/dashboard/trips/' + trip.id)}
              className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:gap-2 transition-all">
              View <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/get-trips').then(r => r.json()).then(data => {
      if (data.trips) setTrips(data.trips);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this trip?')) return;
    await fetch('/api/delete-trip?id=' + id, { method: 'DELETE' });
    setTrips(prev => prev.filter(t => t.id !== id));
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a] mb-1">My Trips 🗺️</h1>
          <p className="text-[#64748b]">{trips.length} saved {trips.length === 1 ? 'itinerary' : 'itineraries'}</p>
        </div>
        <Link href="/dashboard/plan">
          <button className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-violet-200">
            <Plus size={16} /> Plan New Trip
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i => <div key={i} className="h-56 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
        </div>
      ) : trips.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 shadow-sm border border-gray-100 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">🗺️</span>
          </div>
          <h3 className="text-xl font-bold text-[#0f172a] mb-2">No trips yet</h3>
          <p className="text-[#64748b] mb-6">Start planning your first AI-powered adventure!</p>
          <Link href="/dashboard/plan">
            <button className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg shadow-violet-200">
              Plan My First Trip ✈️
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((trip: any) => (
            <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
`;

const dir = path.join(process.cwd(), 'app', 'dashboard', 'trips');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'page.tsx'), content);
console.log('✅ app/dashboard/trips/page.tsx written');