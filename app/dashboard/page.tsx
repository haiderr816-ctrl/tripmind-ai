"use client";

import { useUser } from "@clerk/nextjs";
import { Calendar, MapPin, Sparkles, ArrowRight, DollarSign, Clock, Zap, Star, Bell, ChevronRight, Plane, Hotel, Camera } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion/FadeUp";

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

  useEffect(() => {
    if (!upcomingTrip) return;
    fetch(`/api/photo?query=${encodeURIComponent(upcomingTrip.destination + ' city landmark')}`)
      .then(r => r.json()).then(d => { if (d.url) setHeroPhoto(d.url); });
  }, [upcomingTrip?.id]);

  const uniqueCountries = trips.length === 0 ? 0 : new Set(trips.map(t => {
    const parts = t.destination.split(',');
    return (parts[parts.length - 1] || parts[0]).trim().toLowerCase();
  })).size;
  const savedAmount = trips.length > 0 ? `$${(trips.length * 47).toLocaleString()}` : '$0';
  
  const thisMonthTrips = trips.filter(t => {
    if (!t.startDate) return false;
    const tripDate = new Date(t.startDate);
    const now = new Date();
    return tripDate.getMonth() === now.getMonth() && tripDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-primary">
              Welcome back, {user?.firstName || "Traveler"}
            </h1>
            {upcomingTrip && (
              <Badge variant="pro" className="animate-pulse">
                Trip Coming Up
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">Your AI travel manager is ready to optimize your journey.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 bg-surface rounded-xl shadow-sm border border-border hover:shadow-md transition">
            <Bell size={20} className="text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full"></span>
          </button>
          <Link href="/dashboard/plan">
            <Button variant="accent" size="lg">
              <Sparkles size={16} className="mr-2" /> Plan New Trip
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex gap-1 bg-surface rounded-2xl p-1.5 shadow-sm border border-border w-fit mb-8">
        {["overview", "analytics", "timeline"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition capitalize ${activeTab === tab ? "bg-accent text-white shadow-md" : "text-muted-foreground hover:text-primary"}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Trips", value: trips.length.toString(), icon: MapPin, change: thisMonthTrips > 0 ? `+${thisMonthTrips} this month` : "Plan your first trip" },
              { label: "Countries", value: uniqueCountries.toString(), icon: Plane, change: uniqueCountries > 0 ? `${uniqueCountries} explored` : "Explore more" },
              { label: "This Month", value: thisMonthTrips.toString(), icon: Calendar, change: "Trips planned" },
              { label: "Plan", value: "Free", icon: Star, change: "Upgrade to Pro" },
            ].map((stat, index) => (
              <FadeUp key={stat.label} delay={index * 0.05}>
                <Card variant="default" className="p-5 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-muted-foreground text-sm font-medium">{stat.label}</span>
                    <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                      <stat.icon size={18} className="text-accent" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.change}</div>
                </Card>
              </FadeUp>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {upcomingTrip ? (
                <div className="relative rounded-3xl overflow-hidden h-72 shadow-xl">
                  {heroPhoto ? (
                    <img src={heroPhoto} alt={upcomingTrip.destination} className="w-full h-full object-cover" loading="lazy" />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { href: "/dashboard/plan", icon: Calendar, title: "Plan a New Trip", desc: "AI-powered itinerary in 30 seconds", cta: "Start planning" },
              { href: "/dashboard/trips", icon: MapPin, title: "My Trips", desc: `${trips.length} saved itineraries`, cta: "View all" },
              { href: "/dashboard/leads", icon: Bell, title: "View Leads", desc: "Manage your travel leads", cta: "View leads" },
            ].map((card, index) => (
              <FadeUp key={card.title} delay={index * 0.05}>
                <Link href={card.href}>
                  <Card variant="glass" className="p-6 hover:shadow-md transition cursor-pointer group">
                    <div className="w-11 h-11 bg-accent/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                      <card.icon size={20} className="text-accent" />
                    </div>
                    <h3 className="font-bold text-primary mb-1">{card.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{card.desc}</p>
                    <div className="flex items-center gap-1 text-sm font-semibold text-accent">
                      {card.cta} <ArrowRight size={14} />
                    </div>
                  </Card>
                </Link>
              </FadeUp>
            ))}
          </div>

          <Card variant="default" className="p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-primary text-lg">Recent Trips</h2>
              <Link href="/dashboard/trips" className="text-accent text-sm font-semibold hover:underline flex items-center gap-1">
                View all <ChevronRight size={14} />
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-surface rounded-xl animate-pulse" />)}
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">No trips yet. Start planning your first adventure!</p>
                <Link href="/dashboard/plan">
                  <Button variant="accent" size="lg">
                    Plan My First Trip
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {trips.slice(0, 4).map((trip: any, index) => (
                  <FadeUp key={trip.id} delay={index * 0.05}>
                    <Link href={"/dashboard/trips/" + trip.id}>
                      <div className="flex items-center justify-between p-4 bg-surface rounded-xl hover:bg-accent/5 transition group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-sm">
                            <MapPin size={16} className="text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-primary capitalize">{trip.destination}</p>
                            <p className="text-xs text-muted-foreground">{trip.startDate} → {trip.endDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="info" className="capitalize">{trip.budget}</Badge>
                          <ChevronRight size={16} className="text-muted-foreground group-hover:text-accent transition" />
                        </div>
                      </div>
                    </Link>
                  </FadeUp>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="default" className="p-6">
              <h3 className="font-bold text-primary mb-1">Trip Statistics</h3>
              <p className="text-sm text-muted-foreground mb-6">Your travel activity overview</p>
              <div className="space-y-4">
                {[
                  { label: "Total Trips", value: trips.length, color: "bg-accent", max: Math.max(trips.length, 10) },
                  { label: "Countries Visited", value: uniqueCountries, color: "bg-success", max: Math.max(uniqueCountries, 10) },
                  { label: "Budget Trips", value: trips.filter(t => t.budget?.toLowerCase() === 'budget').length, color: "bg-warning", max: Math.max(trips.length, 1) },
                  { label: "Luxury Trips", value: trips.filter(t => t.budget?.toLowerCase() === 'luxury').length, color: "bg-accent", max: Math.max(trips.length, 1) },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-sm text-muted-foreground flex-1">{item.label}</span>
                    <div className="w-24 h-1.5 bg-surface rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{width: Math.round((item.value / item.max) * 100) + "%"}} />
                    </div>
                    <span className="text-sm font-bold text-primary w-6 text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card variant="default" className="p-6">
              <h3 className="font-bold text-primary mb-1">Price Forecast</h3>
              <p className="text-sm text-muted-foreground mb-6">Best time to book your next trip</p>
              <div className="relative h-40 flex items-end gap-2 mb-4">
                {[65, 80, 55, 90, 45, 70, 40, 60, 85, 50, 75, 35].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80"
                      style={{
                        height: h + "%",
                        background: h <= 50 ? "linear-gradient(to top, oklch(0.65 0.25 285), oklch(0.7 0.25 285))" : h <= 70 ? "linear-gradient(to top, oklch(0.9 0.01 250), oklch(0.85 0.01 250))" : "linear-gradient(to top, oklch(0.75 0.15 25), oklch(0.7 0.15 25))"
                      }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mb-4">
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m => (
                  <span key={m}>{m}</span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-accent" /><span className="text-muted-foreground">Best time</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-warning" /><span className="text-muted-foreground">Peak prices</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-surface" /><span className="text-muted-foreground">Average</span></div>
              </div>
            </Card>
          </div>

          <Card variant="elevated" className="p-6 bg-accent text-white">
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
          </Card>
        </div>
      )}

      {activeTab === "timeline" && (
        <Card variant="default" className="p-6">
          <h3 className="font-bold text-primary text-lg mb-6">Journey Timeline</h3>
          {trips.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No journey timeline yet. Plan your first trip!</p>
              <Link href="/dashboard/plan">
                <Button variant="accent" size="lg">
                  Plan a Trip
                </Button>
              </Link>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent to-accent/50" />
              <div className="space-y-6">
                {trips.map((trip: any, i: number) => (
                  <div key={trip.id} className="flex gap-6 pl-2">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg shadow-accent/30 shrink-0 z-10">
                      {i % 3 === 0 ? <Plane size={16} className="text-white" /> : i % 3 === 1 ? <Hotel size={16} className="text-white" /> : <Camera size={16} className="text-white" />}
                    </div>
                    <div className="flex-1 bg-surface rounded-2xl p-4 border border-border hover:border-accent transition">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-primary capitalize">{trip.destination}</h4>
                          <p className="text-sm text-muted-foreground">{trip.startDate} → {trip.endDate}</p>
                        </div>
                        <Badge variant="info" className="capitalize">{trip.budget}</Badge>
                      </div>
                      <Link href={"/dashboard/trips/" + trip.id}>
                        <button className="mt-3 text-xs text-accent font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                          View Itinerary <ChevronRight size={12} />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

    </div>
  );
}