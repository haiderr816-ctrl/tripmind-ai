"use client";

import { useEffect, useState } from "react";
import { Calendar, MapPin, DollarSign, Eye } from "lucide-react";
import Link from "next/link";

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  interests: string[];
}

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/get-trips")
      .then(res => res.json())
      .then(data => {
        if (data.trips) {
          setTrips(data.trips);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading your trips...</div>;
  }

  if (trips.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">My Trips</h1>
        <p className="text-gray-600">You haven't saved any trips yet.</p>
        <Link href="/dashboard/plan">
          <button className="mt-4 bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-6 py-2 rounded-xl">
            Plan Your First Trip
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Trips</h1>
      <div className="space-y-4">
        {trips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 capitalize">{trip.destination}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {trip.startDate} → {trip.endDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign size={14} /> ${trip.budget}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {Array.isArray(trip.interests) && trip.interests.map((interest, i) => (
                    <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">{interest}</span>
                  ))}
                </div>
              </div>
              <Link href={`/dashboard/trips/${trip.id}`}>
                <button className="flex items-center gap-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-xl transition font-medium">
                  <Eye size={16} /> View Trip
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}