'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Calendar, DollarSign, Clock, ChevronLeft, Hotel, Lightbulb, Cloud, Globe, Plane, Utensils, Bus, Phone, Wallet } from 'lucide-react';
import DownloadPDF from '@/components/DownloadPDF';

export default function TripDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(0);
  const [dayPhotos, setDayPhotos] = useState<Record<number, string>>({});
  const [heroPhoto, setHeroPhoto] = useState('');

  useEffect(() => {
    const tripId = Array.isArray(id) ? id[0] : id;
    fetch(`/api/get-trip?id=${tripId}`)
      .then(r => r.json())
      .then(data => { setTrip(data.trip || null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!trip) return;
    fetch(`/api/photo?query=${encodeURIComponent(trip.destination + ' city landmark aerial')}`)
      .then(r => r.json()).then(d => { if (d.url) setHeroPhoto(d.url); });
  }, [trip]);

  useEffect(() => {
    if (!trip) return;
    const itinerary = typeof trip.itinerary === 'string' ? JSON.parse(trip.itinerary) : trip.itinerary;
    const days = itinerary?.days || [];
    days.forEach((day: any, i: number) => {
      const query = day.cityOrArea || day.title || trip.destination;
      fetch(`/api/photo?query=${encodeURIComponent(query + ' travel')}`)
        .then(r => r.json()).then(d => {
          if (d.url) setDayPhotos(prev => ({ ...prev, [i]: d.url }));
        });
    });
  }, [trip]);

  if (loading) return (
    <div className="min-h-screen bg-[#f8fafc] p-8">
      <div className="max-w-3xl mx-auto space-y-4">
        {[1,2,3].map(i => <div key={i} className="h-32 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
      </div>
    </div>
  );

  if (!trip) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <p className="text-[#64748b] mb-4">Trip not found.</p>
        <button onClick={() => router.push('/dashboard/trips')} className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold">Back to Trips</button>
      </div>
    </div>
  );

  const itinerary = typeof trip.itinerary === 'string' ? JSON.parse(trip.itinerary) : trip.itinerary;
  const days = itinerary?.days || [];
  const weather = itinerary?.weather;
  const countryInfo = itinerary?.countryInfo;
  const flightEstimate = itinerary?.flightEstimate;
  const budgetBreakdown = itinerary?.budgetBreakdown;
  const moneyTips = itinerary?.moneyTips;
  const emergencyContacts = itinerary?.emergencyContacts;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.push('/dashboard/trips')}
            className="flex items-center gap-2 text-[#64748b] hover:text-[#0f172a] font-medium transition group">
            <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition" /> Back to Trips
          </button>
          <DownloadPDF trip={trip} />
        </div>

        <div className="relative rounded-3xl overflow-hidden h-64 mb-6 shadow-xl">
          {heroPhoto ? (
            <img src={heroPhoto} alt={trip.destination} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-400 to-pink-400 animate-pulse" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-3xl font-bold text-white mb-2 capitalize">{trip.destination}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-1.5 text-white text-xs font-medium">
                <Calendar size={12} /> {trip.startDate} → {trip.endDate}
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-1.5 text-white text-xs font-medium">
                <DollarSign size={12} /> {trip.budget} budget
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-1.5 text-white text-xs font-medium">
                <Clock size={12} /> {days.length} days
              </div>
            </div>
          </div>
        </div>

        {(weather || countryInfo) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {weather && (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Cloud size={22} className="text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-[#0f172a] text-sm mb-0.5">Weather Forecast</p>
                  <p className="text-xs text-[#64748b]">{weather.tempMin}°C – {weather.tempMax}°C</p>
                  <p className="text-xs text-blue-600 font-medium">{weather.rainChance}% chance of rain</p>
                </div>
              </div>
            )}
            {countryInfo && (
              <div className="bg-gradient-to-br from-violet-50 to-pink-50 border border-violet-100 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center shrink-0">
  <Globe size={22} className="text-violet-500" />
</div>
                <div>
                  <p className="font-bold text-[#0f172a] text-sm mb-0.5">Country Info</p>
                  <p className="text-xs text-[#64748b]">Currency: {typeof countryInfo.currency === 'object' ? (countryInfo.currency as any)?.name : countryInfo.currency}</p>
                  <p className="text-xs text-[#64748b]">Language: {countryInfo.language} · {countryInfo.timezone}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {itinerary?.summary && (
          <div className="bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-100 rounded-2xl p-5 mb-6">
            <p className="text-[#0f172a] leading-relaxed">{itinerary.summary}</p>
            {itinerary.totalEstimatedCost && (
              <div className="mt-3 inline-flex items-center gap-2 bg-white border border-violet-100 rounded-xl px-3 py-1.5">
                <DollarSign size={14} className="text-violet-500" />
                <span className="text-sm font-bold text-violet-700">Est. Total: {itinerary.totalEstimatedCost}</span>
              </div>
            )}
          </div>
        )}

        {flightEstimate && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Plane size={18} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-[#0f172a]">✈️ Flight Estimate</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs text-[#64748b] mb-1">Estimated Cost (Return)</p>
                <p className="font-bold text-blue-700 text-lg">{flightEstimate.estimatedCost}</p>
                <p className="text-xs text-[#64748b] mt-1">Flight time: {flightEstimate.estimatedFlightTime}</p>
              </div>
              <div className="bg-[#f8fafc] rounded-xl p-4">
                <p className="text-xs text-[#64748b] mb-1">Recommended Airlines</p>
                <div className="flex flex-wrap gap-1.5">
                  {flightEstimate.recommendedAirlines?.map((a: string, i: number) => (
                    <span key={i} className="bg-white border border-gray-200 text-xs font-medium px-2.5 py-1 rounded-lg text-[#0f172a]">{a}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
              <p className="text-xs text-amber-700 font-medium">💡 {flightEstimate.bestBookingTip}</p>
            </div>
            {flightEstimate.bookingLinks && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {flightEstimate.bookingLinks.map((link: string, i: number) => (
                  <a key={i} href={link} target="_blank" rel="noopener noreferrer"
                    className="text-xs bg-violet-50 text-violet-700 border border-violet-100 px-3 py-1.5 rounded-xl font-medium hover:bg-violet-100 transition">
                    {link.includes('skyscanner') ? '🔍 Skyscanner' : link.includes('kayak') ? '🛶 Kayak' : '✈️ Google Flights'}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {budgetBreakdown && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Wallet size={18} className="text-green-600" />
              </div>
              <h3 className="font-bold text-[#0f172a]">💰 Full Budget Breakdown</h3>
            </div>
            <div className="space-y-2.5">
              {[
                { label: '✈️ Flights', value: budgetBreakdown.flights, color: 'bg-blue-50 text-blue-700' },
                { label: '🏨 Accommodation', value: budgetBreakdown.accommodation, color: 'bg-amber-50 text-amber-700' },
                { label: '🍽️ Food', value: budgetBreakdown.food, color: 'bg-orange-50 text-orange-700' },
                { label: '🚌 Local Transport', value: budgetBreakdown.localTransport, color: 'bg-cyan-50 text-cyan-700' },
                { label: '🎯 Activities', value: budgetBreakdown.activities, color: 'bg-violet-50 text-violet-700' },
                { label: '🛍️ Miscellaneous', value: budgetBreakdown.miscellaneous, color: 'bg-gray-50 text-gray-700' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-xl">
                  <span className="text-sm font-medium text-[#0f172a]">{item.label}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg ${item.color}`}>{item.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl mt-2">
                <span className="text-sm font-bold text-white">💎 Total Estimate</span>
                <span className="text-sm font-bold text-white">{budgetBreakdown.total}</span>
              </div>
            </div>
          </div>
        )}

        {days.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {days.map((day: any, i: number) => (
              <button key={i} onClick={() => setActiveDay(i)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition ${activeDay === i ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg shadow-violet-200' : 'bg-white text-[#64748b] border border-gray-100 hover:border-violet-200'}`}>
                Day {day.day}
              </button>
            ))}
          </div>
        )}

        {days[activeDay] && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="relative h-48 overflow-hidden">
              {dayPhotos[activeDay] ? (
                <img src={dayPhotos[activeDay]} alt={days[activeDay].title} className="w-full h-full object-cover transition-all duration-500" loading="lazy" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-100 to-pink-100 animate-pulse" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full mr-2">
                    Day {days[activeDay].day}
                  </span>
                  <span className="text-white font-bold text-lg">{days[activeDay].title}</span>
                </div>
                {days[activeDay].cityOrArea && (
                  <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-1.5 text-white text-xs font-medium">
                    <MapPin size={12} /> {days[activeDay].cityOrArea}
                  </div>
                )}
              </div>
            </div>

            <div className="h-1.5 bg-gradient-to-r from-violet-600 to-pink-600" />
            <div className="p-6">
              {days[activeDay].date && <p className="text-sm text-[#64748b] mb-4">{days[activeDay].date}</p>}

              {days[activeDay].foodEstimate && (
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Utensils size={15} className="text-orange-500" />
                    <p className="font-bold text-[#0f172a] text-sm">Food Budget for Today</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {[
                      { label: '🌅 Breakfast', value: days[activeDay].foodEstimate.breakfast },
                      { label: '☀️ Lunch', value: days[activeDay].foodEstimate.lunch },
                      { label: '🌙 Dinner', value: days[activeDay].foodEstimate.dinner },
                    ].map((meal, i) => (
                      <div key={i} className="bg-white rounded-xl p-2.5 text-center">
                        <p className="text-xs text-[#64748b] mb-1">{meal.label}</p>
                        <p className="text-xs font-bold text-orange-600">{meal.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between bg-white rounded-xl px-3 py-2">
                    <span className="text-xs font-medium text-[#64748b]">Daily food total</span>
                    <span className="text-xs font-bold text-orange-600">{days[activeDay].foodEstimate.totalDay}</span>
                  </div>
                </div>
              )}

              {days[activeDay].transportForDay && (
                <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-3 mb-5 flex items-center gap-3">
                  <Bus size={16} className="text-cyan-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#0f172a]">Transport Today</p>
                    <p className="text-xs text-[#64748b]">{days[activeDay].transportForDay}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3 mb-6">
                {days[activeDay].schedule?.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4 p-4 bg-[#f8fafc] rounded-2xl hover:bg-violet-50 transition">
                    <div className="shrink-0">
                      <span className="text-xs font-bold text-violet-600 bg-violet-100 px-2.5 py-1.5 rounded-lg block text-center min-w-[60px]">
                        {item.time}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#0f172a] mb-0.5">{item.activity}</p>
                      <p className="text-sm text-[#64748b]">{item.description}</p>
                    </div>
                    {item.cost && (
                      <span className="shrink-0 text-xs bg-green-50 text-green-700 font-bold px-2.5 py-1 rounded-xl border border-green-100 h-fit">
                        {item.cost}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {days[activeDay].accommodation && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                      <Hotel size={18} className="text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[#0f172a] text-sm mb-0.5">{days[activeDay].accommodation.name}</p>
                      <p className="text-xs text-[#64748b]">{days[activeDay].accommodation.type} · {days[activeDay].accommodation.estimatedCost}</p>
                      {days[activeDay].accommodation.bookingTip && (
                        <p className="text-xs text-amber-600 mt-1">💡 {days[activeDay].accommodation.bookingTip}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {days[activeDay].tips && (
                <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
                    <Lightbulb size={18} className="text-violet-600" />
                  </div>
                  <div>
                    <p className="font-bold text-violet-800 text-sm mb-0.5">Local Tip</p>
                    <p className="text-sm text-violet-700">{days[activeDay].tips}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between mb-6">
          <button onClick={() => setActiveDay(Math.max(0, activeDay - 1))} disabled={activeDay === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-semibold text-[#64748b] hover:border-violet-200 hover:text-violet-600 disabled:opacity-30 transition shadow-sm">
            <ChevronLeft size={16} /> Previous Day
          </button>
          <button onClick={() => setActiveDay(Math.min(days.length - 1, activeDay + 1))} disabled={activeDay === days.length - 1}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-30 transition shadow-lg shadow-violet-200">
            Next Day <ChevronLeft size={16} className="rotate-180" />
          </button>
        </div>

        {itinerary?.packingTips?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <h3 className="font-bold text-[#0f172a] mb-3">🎒 Packing Tips</h3>
            <div className="flex flex-wrap gap-2">
              {itinerary.packingTips.map((tip: string, i: number) => (
                <span key={i} className="bg-violet-50 text-violet-700 text-xs font-medium px-3 py-1.5 rounded-xl border border-violet-100">{tip}</span>
              ))}
            </div>
          </div>
        )}

        {moneyTips?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <h3 className="font-bold text-[#0f172a] mb-3">💳 Money Tips</h3>
            <div className="space-y-2">
              {moneyTips.map((tip: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[#64748b]">
                  <span className="text-green-500 mt-0.5">✓</span> {tip}
                </div>
              ))}
            </div>
          </div>
        )}

        {emergencyContacts && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Phone size={16} className="text-red-500" />
              <h3 className="font-bold text-[#0f172a]">🆘 Emergency Contacts</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Police', value: emergencyContacts.police },
                { label: 'Ambulance', value: emergencyContacts.ambulance },
                { label: 'Tourist Help', value: emergencyContacts.touristHelpline },
              ].map((c, i) => (
                <div key={i} className="bg-white rounded-xl p-3 text-center">
                  <p className="text-xs text-[#64748b] mb-1">{c.label}</p>
                  <p className="font-bold text-red-600 text-sm">{c.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}