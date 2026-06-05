"use client";

import { useUser } from "@clerk/nextjs";
import { Calendar, MapPin, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user } = useUser();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("/api/get-trips");
        const data = await res.json();
        if (data.trips) setTrips(data.trips);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Welcome back, {user?.firstName || "Traveler"}!
      </h1>
      <p className="text-gray-600 mb-8">Ready to plan your next adventure?</p>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/dashboard/plan">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition cursor-pointer group">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition">
              <Calendar className="text-indigo-600" size={20} />
            </div>
            <h3 className="font-semibold text-gray-900">Plan a New Trip</h3>
            <p className="text-sm text-gray-500 mt-1">Create a personalized itinerary</p>
            <div className="flex items-center gap-1 text-indigo-600 text-sm mt-3 font-medium">
              Start planning <ArrowRight size={14} />
            </div>
          </div>
        </Link>

        <Link href="/dashboard/trips">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-pink-200 transition cursor-pointer group">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-pink-200 transition">
              <MapPin className="text-pink-600" size={20} />
            </div>
            <h3 className="font-semibold text-gray-900">My Trips</h3>
            <p className="text-sm text-gray-500 mt-1">View your past and upcoming trips</p>
            <div className="flex items-center gap-1 text-pink-600 text-sm mt-3 font-medium">
              View all <ArrowRight size={14} />
            </div>
          </div>
        </Link>

        <Link href="/explore">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition cursor-pointer group">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200 transition">
              <Sparkles className="text-purple-600" size={20} />
            </div>
            <h3 className="font-semibold text-gray-900">AI Recommendations</h3>
            <p className="text-sm text-gray-500 mt-1">Get personalized suggestions</p>
            <div className="flex items-center gap-1 text-purple-600 text-sm mt-3 font-medium">
              Explore <ArrowRight size={14} />
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Trips */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-900">Recent Trips</h2>
          <Link href="/dashboard/trips" className="text-indigo-600 text-sm hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center py-8">Loading trips...</p>
        ) : trips.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No trips yet. Start planning your first adventure!</p>
            <Link href="/dashboard/plan">
              <button className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition">
                Plan My First Trip
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {trips.slice(0, 3).map((trip: any) => (
              <div key={trip.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center">
                    <MapPin size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{trip.destination}</p>
                    <p className="text-sm text-gray-500">{trip.startDate} → {trip.endDate}</p>
                  </div>
                </div>
                <Link href="/dashboard/trips">
                  <button className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
                    View <ArrowRight size={13} />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}