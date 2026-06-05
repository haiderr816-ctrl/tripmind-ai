'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function TripDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/get-trips')
      .then(r => r.json())
      .then(data => {
        const tripId = Array.isArray(id) ? id[0] : id;
        const found = data.trips?.find((t: any) => String(t.id) === String(tripId));
        setTrip(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!trip) return <div className="p-6 text-center">Trip not found. <button onClick={() => router.push('/dashboard/trips')} className="text-blue-600 underline">Go back</button></div>;

  const itinerary = typeof trip.itinerary === 'string' ? JSON.parse(trip.itinerary) : trip.itinerary;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button onClick={() => router.push('/dashboard/trips')} className="text-blue-600 text-sm mb-4 hover:underline">
        ← Back to My Trips
      </button>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">{trip.destination}</h1>
      <p className="text-gray-500 text-sm mb-6">{trip.startDate} → {trip.endDate} · {trip.budget} budget</p>

      {itinerary?.summary && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6">
          <p className="text-blue-800 text-sm">{itinerary.summary}</p>
        </div>
      )}

      <div className="space-y-6">
        {itinerary?.days?.map((day: any) => (
          <div key={day.day} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Day {day.day}</span>
              <h3 className="font-semibold text-gray-800">{day.title}</h3>
              <span className="text-gray-400 text-sm ml-auto">{day.date}</span>
            </div>
            {day.cityOrArea && <p className="text-sm text-blue-500 mb-3">📍 {day.cityOrArea}</p>}
            <div className="space-y-3">
              {day.schedule?.map((item: any, i: number) => (
                <div key={i} className="flex gap-3">
                  <span className="w-20 shrink-0 text-xs font-semibold text-blue-600 pt-0.5">{item.time}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{item.activity}</p>
                    <p className="text-gray-500 text-xs">{item.description}</p>
                  </div>
                  {item.cost && <span className="text-xs bg-green-50 text-green-700 font-semibold px-2 py-1 rounded-lg h-fit">{item.cost}</span>}
                </div>
              ))}
            </div>
            {day.accommodation && (
              <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="text-xs font-bold text-amber-700 mb-1">🏨 {day.accommodation.name}</p>
                <p className="text-xs text-gray-500">{day.accommodation.type} · {day.accommodation.estimatedCost}</p>
              </div>
            )}
            {day.tips && (
              <div className="mt-3 bg-purple-50 border border-purple-100 rounded-xl p-3">
                <p className="text-xs font-bold text-purple-700 mb-1">💡 Local Tip</p>
                <p className="text-xs text-gray-700">{day.tips}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}