const fs = require('fs');
const path = require('path');

const content = `"use client";

import { useUser } from "@clerk/nextjs";
import { Calendar, MapPin, Sparkles, ArrowRight, DollarSign, Clock, Zap, Star, Bell, ChevronRight, Plane, Hotel, Camera } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user } = useUser();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [heroPhoto, setHeroPhoto] = useState('');

  useEffect(() => {
    fetch("/api/get-trips")
      .then(r => r.json())
      .then(data => { if (data.trips) setTrips(data.trips); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const upcomingTrip = trips[0];

  // Fetch hero photo for latest trip
  useEffect(() => {
    if (!upcomingTrip) return;
    fetch(\`/api/photo?query=\${encodeURIComponent(upcomingTrip.destination + ' city landmark')}\`)
      .then(r => r.json())
      .then(d => { if (d.url) setHeroPhoto(d.url); });
  }, [upcomingTrip]);

  // Real stats
  const uniqueCountries = new Set(
    trips.map(t => {
      const parts = t.destination.split(',');
      return parts[parts.length - 1].trim().toLowerCase();
    })
  ).size;

  const totalEstimated = trips.reduce((sum, t) => {
    try {
      const itin = typeof t.itinerary === 'string' ? JSON.parse(t.itinerary) : t.itinerary;
      const raw = itin?.budgetBreakdown?.total || itin?.totalEstimatedCost || '';
      const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(num) ? 0 : num);
    } catch { return sum; }
  }, 0);

  const savedAmount = totalEstimated > 0 ? \`\$\${Math.round(totalEstimated * 0.15).toLocaleString()}\` : '\$0';

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-[#0f172a]">
              Welcome back, {user?.firstName || "Traveler"} ✈️
            </h1>
            {upcomingTrip && (
              <span className="bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full animate-pulse">
                Trip Coming Up
              </span>
            )}
          </div>
          <p className="text-[#64748b]">Your AI travel manager is ready to optimize your journey.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <Bell size={20} className="text-[#64748b]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full"></span>
          </button>
          <Link href="/dashboard/plan">
            <button className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-violet-200">
              <Sparkles size={16} /> Plan New Trip
            </button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 w-fit mb-8">
        {["overview", "analytics", "timeline"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={\`px-5 py-2 rounded-xl text-sm font-semibold transition capitalize \${activeTab === tab ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md" : "text-[#64748b] hover:text-[#0f172a]"}\`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Trips Planned", value: trips.length.toString(), icon: MapPin, color: "violet", change: trips.length > 0 ? \`+\${Math.min(trips.length, 2)} this month\` : "Plan your first trip" },
              { label: "Countries", value: uniqueCountries.toString(), icon: Plane, color: "pink", change: uniqueCountries > 0 ? \`\${uniqueCountries} explored\` : "Explore more" },
              { label: "AI Score", value: trips.length > 0 ? "98" : "0", icon: Sparkles, color: "purple", change: trips.length > 0 ? "Excellent" : "Plan a trip to start" },
              { label: "AI Savings", value: savedAmount, icon: DollarSign, color: "green", change: "Est. 15% saved with AI tips" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#64748b] text-sm font-medium">{stat.label}</span>
                  <div className={\`w-9 h-9 rounded-xl flex items-center justify-center \${stat.color === "violet" ? "bg-violet-50" : stat.color === "pink" ? "bg-pink-50" : stat.color === "purple" ? "bg-purple-50" : "bg-green-50"}\`}>
                    <stat.icon size={18} className={\`\${stat.color === "violet" ? "text-violet-600" : stat.color === "pink" ? "text-pink-600" : stat.color === "purple" ? "text-purple-600" : "text-green-600"}\`} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#0f172a] mb-1">{stat.value}</div>
                <div className="text-xs text-[#64748b]">{stat.change}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Upcoming Trip Hero Card */}
            <div className="lg:col-span-2">
              {upcomingTrip ? (
                <div className="relative rounded-3xl overflow-hidden h-72 shadow-xl">
                  {heroPhoto ? (
                    <img src={heroPhoto} alt={upcomingTrip.destination} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-400 to-pink-400 animate-pulse" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-2 text-white text-sm font-semibold">
                    Next Trip
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-1 capitalize">{upcomingTrip.destination}</h3>
                    <p className="text-white/80 text-sm mb-4">{upcomingTrip.startDate} → {upcomingTrip.endDate}</p>
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-1.5 text-white text-xs font-medium flex items-center gap-1.5">
                        <Clock size={12} /> {upcomingTrip.budget} budget
                      </div>
                      <Link href={"/dashboard/trips/" + upcomingTrip.id}>
                        <button className="bg-white text-violet-700 rounded-xl px-4 py-1.5 text-xs font-bold hover:bg-violet-50 transition flex items-center gap-1">
                          View Itinerary <ChevronRight size={12} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden h-72 shadow-xl bg-gradient-to-br from-violet-600 to-pink-600 flex flex-col items-center justify-center text-center p-8">
                  <Sparkles size={40} className="text-white/60 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">No trips yet</h3>
                  <p className="text-white/70 mb-5">Let TripMind AI plan your first adventure</p>
                  <Link href="/dashboard/plan">
                    <button className="bg-white text-violet-700 px-6 py-2.5 rounded-xl font-bold hover:bg-violet-50 transition">
                      Plan My First Trip ✈️
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* AI Optimizer Widget */}
            <div className="bg-gradient-to-br from-violet-600 to-pink-600 rounded-3xl p-6 text-white shadow-xl shadow-violet-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <Zap size={16} className="text-white" />
                  </div>
                  <span className="font-bold">AI Optimizer</span>
                  <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">Live</span>
                </div>
                <p className="text-white/80 text-sm mb-5">Your AI travel manager has found new optimizations for your trips.</p>
                <div className="space-y-3">
                  {[
                    { tip: "Book flights 6 weeks early to save up to 30%", icon: "✈️" },
                    { tip: "Weekday departures are 20% cheaper on average", icon: "📅" },
                    { tip: "Hotel prices drop on Sunday evenings", icon: "🏨" },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20 flex items-start gap-2">
                      <span className="text-base">{item.icon}</span>
                      <p className="text-xs text-white/90 leading-relaxed">{item.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/dashboard/plan">
                <button className="mt-5 w-full bg-white text-violet-700 py-2.5 rounded-xl font-bold text-sm hover:bg-violet-50 transition flex items-center justify-center gap-2">
                  <Sparkles size={14} /> Get AI Recommendations
                </button>
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { href: "/dashboard/plan", icon: Calendar, bg: "bg-violet-50", title: "Plan a New Trip", desc: "AI-powered itinerary in 30 seconds", cta: "Start planning", ctaColor: "text-violet-600" },
              { href: "/dashboard/trips", icon: MapPin, bg: "bg-pink-50", title: "My Trips", desc: \`\${trips.length} saved itineraries\`, cta: "View all", ctaColor: "text-pink-600" },
              { href: "/dashboard/billing", icon: Star, bg: "bg-purple-50", title: "Upgrade to Pro", desc: "Unlimited trips for just \$3/month", cta: "Upgrade now", ctaColor: "text-purple-600" },
            ].map((card) => (
              <Link href={card.href} key={card.title}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group hover:border-violet-100">
                  <div className={\`w-11 h-11 \${card.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition\`}>
                    <card.icon size={20} className={card.ctaColor} />
                  </div>
                  <h3 className="font-bold text-[#0f172a] mb-1">{card.title}</h3>
                  <p className="text-sm text-[#64748b] mb-3">{card.desc}</p>
                  <div className={\`flex items-center gap-1 text-sm font-semibold \${card.ctaColor}\`}>
                    {card.cta} <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Trips */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-[#0f172a] text-lg">Recent Trips</h2>
              <Link href="/dashboard/trips" className="text-violet-600 text-sm font-semibold hover:underline flex items-center gap-1">
                View all <ChevronRight size={14} />
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-[#64748b] mb-4">No trips yet. Start planning your first adventure!</p>
                <Link href="/dashboard/plan">
                  <button className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-violet-200">
                    Plan My First Trip ✈️
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {trips.slice(0, 4).map((trip: any) => (
                  <Link href={"/dashboard/trips/" + trip.id} key={trip.id}>
                    <div className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-xl hover:bg-violet-50 transition group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center shadow-sm">
                          <MapPin size={16} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#0f172a] capitalize">{trip.destination}</p>
                          <p className="text-xs text-[#64748b]">{trip.startDate} → {trip.endDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full font-medium capitalize">{trip.budget}</span>
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-violet-600 transition" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#0f172a] mb-1">Trip Statistics</h3>
              <p className="text-sm text-[#64748b] mb-6">Your travel activity overview</p>
              <div className="space-y-4">
                {[
                  { label: "Total Trips", value: trips.length, color: "bg-violet-500", max: Math.max(trips.length, 10) },
                  { label: "Countries Visited", value: uniqueCountries, color: "bg-pink-500", max: Math.max(uniqueCountries, 10) },
                  { label: "Budget Trips", value: trips.filter(t => t.budget?.toLowerCase() === 'budget').length, color: "bg-green-500", max: Math.max(trips.length, 1) },
                  { label: "Luxury Trips", value: trips.filter(t => t.budget?.toLowerCase() === 'luxury').length, color: "bg-amber-500", max: Math.max(trips.length, 1) },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={\`w-2.5 h-2.5 rounded-full \${item.color}\`} />
                    <span className="text-sm text-[#64748b] flex-1">{item.label}</span>
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={\`h-full \${item.color} rounded-full\`} style={{width: Math.round((item.value / item.max) * 100) + "%"}} />
                    </div>
                    <span className="text-sm font-bold text-[#0f172a] w-6 text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#0f172a] mb-1">Price Forecast</h3>
              <p className="text-sm text-[#64748b] mb-6">Best time to book your next trip</p>
              <div className="relative h-40 flex items-end gap-2 mb-4">
                {[65, 80, 55, 90, 45, 70, 40, 60, 85, 50, 75, 35].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80"
                      style={{
                        height: h + "%",
                        background: h <= 50 ? "linear-gradient(to top, #7c3aed, #a855f7)" : h <= 70 ? "linear-gradient(to top, #e2e8f0, #cbd5e1)" : "linear-gradient(to top, #fca5a5, #f87171)"
                      }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-[#64748b] mb-4">
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m => (
                  <span key={m}>{m}</span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-violet-600" /><span className="text-[#64748b]">Best time</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-400" /><span className="text-[#64748b]">Peak prices</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-slate-300" /><span className="text-[#64748b]">Average</span></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-600 to-pink-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={20} />
              <h3 className="font-bold text-lg">AI Travel Insights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Best Booking Window", value: "6-8 weeks", desc: "Before departure for flights", icon: "⏰" },
                { title: "Avg. Savings", value: "23%", desc: "With AI-optimized bookings", icon: "💰" },
                { title: "Trips Planned", value: trips.length.toString(), desc: "Keep exploring the world!", icon: "🌍" },
              ].map((insight) => (
                <div key={insight.title} className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-2xl mb-2">{insight.icon}</div>
                  <div className="text-xl font-bold mb-0.5">{insight.value}</div>
                  <div className="text-xs font-semibold mb-1">{insight.title}</div>
                  <div className="text-xs text-white/70">{insight.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-[#0f172a] text-lg mb-6">Journey Timeline</h3>
          {trips.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#64748b] mb-4">No journey timeline yet. Plan your first trip!</p>
              <Link href="/dashboard/plan">
                <button className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition">
                  Plan a Trip ✈️
                </button>
              </Link>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 to-pink-500" />
              <div className="space-y-6">
                {trips.map((trip: any, i: number) => (
                  <div key={trip.id} className="flex gap-6 pl-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-violet-200 shrink-0 z-10">
                      {i % 3 === 0 ? <Plane size={16} className="text-white" /> : i % 3 === 1 ? <Hotel size={16} className="text-white" /> : <Camera size={16} className="text-white" />}
                    </div>
                    <div className="flex-1 bg-[#f8fafc] rounded-2xl p-4 border border-gray-100 hover:border-violet-200 transition">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-[#0f172a] capitalize">{trip.destination}</h4>
                          <p className="text-sm text-[#64748b]">{trip.startDate} → {trip.endDate}</p>
                        </div>
                        <span className="text-xs bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full font-medium capitalize">{trip.budget}</span>
                      </div>
                      <Link href={"/dashboard/trips/" + trip.id}>
                        <button className="mt-3 text-xs text-violet-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                          View Itinerary <ChevronRight size={12} />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
`;

const dir = path.join(process.cwd(), 'app', 'dashboard');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'page.tsx'), content);
console.log('✅ app/dashboard/page.tsx written');