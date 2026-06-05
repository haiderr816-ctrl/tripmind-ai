"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, DollarSign, MapPin, ArrowLeft, Clock, Star, Lightbulb } from "lucide-react";

interface ScheduleItem {
  time: string;
  activity: string;
  location: string;
}

interface ItineraryDay {
  day: number;
  date: string;
  summary: string;
  schedule: ScheduleItem[];
  accommodation: string;
  tips: string[];
}

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  interests: string[];
  itinerary: {
    days: ItineraryDay[];
    practicalTips?: string[];
    summary?: string;
  };
}

export default function TripDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/get-trips")
      .then((res) => res.json())
      .then((data) => {
        if (data.trips) {
          const tripId = Array.isArray(id) ? id[0] : id;
          const found = data.trips.find((t: Trip) => String(t.id) === String(tripId));
          setTrip(found || null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-3xl mx-auto text-center py-24">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Trip not found</h1>
        <button
          onClick={() => router.push("/dashboard/trips")}
          className="text-indigo-600 hover:underline"
        >
          Back to My Trips
        </button>
      </div>
    );
  }

  const days = trip.itinerary?.days || [];
  const practicalTips = trip.itinerary?.practicalTips || [];
  const summary = trip.itinerary?.summary || "";

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Back button */}
      <button
        onClick={() => router.push("/dashboard/trips")}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition"
      >
        <ArrowLeft size={16} /> Back to My Trips
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-pink-600 rounded-2xl p-8 text-white mb-8">
        <h1 className="text-3xl font-bold capitalize mb-3">{trip.destination}</h1>
        {summary && <p className="text-white/80 text-sm mb-4">{summary}</p>}
        <div className="flex flex-wrap gap-4 text-sm opacity-90">
          <span className="flex items-center gap-1">
            <Calendar size={14} /> {trip.startDate} → {trip.endDate}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign size={14} /> Budget: ${trip.budget}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={14} /> {trip.destination}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {trip.interests.map((interest, i) => (
            <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Itinerary Days */}
      <div className="space-y-6">
        {days.map((day) => (
          <div key={day.day} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-indigo-600 mb-1">
              Day {day.day} — {day.date}
            </h2>
            <p className="text-sm text-gray-500 mb-4">{day.summary}</p>

            {/* Schedule */}
            <div className="space-y-3 mb-4">
              {(day.schedule || []).map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-400 w-24">
                    <Clock size={12} /> {item.time}
                  </div>
                  <div className="flex-1 border-l-2 border-indigo-100 pl-4">
                    <p className="font-medium text-gray-900 text-sm">{item.activity}</p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <MapPin size={10} /> {item.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Accommodation */}
            {day.accommodation && (
              <div className="flex items-center gap-2 bg-indigo-50 rounded-xl px-4 py-2 text-sm text-indigo-700 mt-3">
                <Star size={14} /> Stay: {day.accommodation}
              </div>
            )}

            {/* Day tips */}
            {(day.tips || []).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {day.tips.map((tip, i) => (
                  <span key={i} className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                    💡 {tip}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Practical Tips */}
      {practicalTips.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mt-6">
          <h2 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <Lightbulb size={18} /> Practical Tips
          </h2>
          <ul className="space-y-2">
            {practicalTips.map((tip, i) => (
              <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                <span className="mt-1">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}