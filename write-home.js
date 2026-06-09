const fs = require('fs');

const content = `"use client";

import { useState, useEffect } from "react";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Star, ArrowRight, Mail, Phone, MapPin, Check, Brain, FileText, MessageCircle, Zap, Globe, Shield, Plane } from "lucide-react";

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSlideIndex((p) => (p + 1) % 5), 4000);
    return () => clearInterval(timer);
  }, []);

  const slides = [
    "https://images.unsplash.com/photo-1499856871958-5b9357976b82?q=80&w=2942",
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2670",
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2670",
    "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?q=80&w=2670",
    "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2670",
  ];

  return (
    <div className="min-h-screen bg-white" style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif"}}>

      {/* Google Font */}
      <style>{\`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');\`}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md shadow-violet-200">
                  <Sparkles size={16} className="text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                  TripMind AI
                </span>
              </Link>
              <div className="hidden md:flex gap-6">
                <a href="#services" className="text-gray-500 hover:text-violet-600 transition font-medium text-sm">Services</a>
                <a href="#how-it-works" className="text-gray-500 hover:text-violet-600 transition font-medium text-sm">How It Works</a>
                <Link href="/pricing" className="text-gray-500 hover:text-violet-600 transition font-medium text-sm">Pricing</Link>
                <a href="#blog" className="text-gray-500 hover:text-violet-600 transition font-medium text-sm">Blog</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <button className="hidden md:block text-gray-500 hover:text-gray-900 font-medium text-sm transition">Sign In</button>
                  </SignInButton>
                  <SignInButton mode="modal">
                    <button className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-5 py-2 rounded-full hover:opacity-90 transition shadow-lg shadow-violet-200 font-semibold text-sm">
                      Start Free
                    </button>
                  </SignInButton>
                </>
              ) : (
                <Link href="/dashboard">
                  <button className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-5 py-2 rounded-full hover:opacity-90 transition shadow-lg shadow-violet-200 font-semibold text-sm">
                    Dashboard
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-[680px] flex items-center justify-center text-center overflow-hidden">
        {slides.map((url, i) => (
          <div key={i} className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{ backgroundImage: \`url('\${url}')\`, opacity: slideIndex === i ? 1 : 0 }} />
        ))}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full mb-6 border border-white/25 shadow-lg">
            <Sparkles size={14} className="text-yellow-300" /> AI-Powered Travel Planning
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-5 leading-tight tracking-tight">
            Plan Your Dream Trip<br />
            in <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">30 Seconds</span>
          </h1>
          <p className="text-lg md:text-xl text-white/85 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            TripMind AI creates fully personalized itineraries, finds the best deals, and manages your entire journey — all powered by AI.
          </p>

          {/* Glassmorphism Search Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-5 max-w-3xl mx-auto border border-white/25">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
              <input type="text" placeholder="Where to?" value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="px-4 py-3 bg-white/15 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40 text-sm text-white placeholder-white/60 backdrop-blur-sm" />
              <input type="date" value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-3 bg-white/15 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40 text-sm text-white backdrop-blur-sm" />
              <input type="date" value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-3 bg-white/15 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40 text-sm text-white backdrop-blur-sm" />
              <select className="px-4 py-3 bg-white/15 border border-white/30 rounded-xl focus:outline-none text-white text-sm backdrop-blur-sm">
                <option className="text-gray-900 bg-white">1 Traveler</option>
                <option className="text-gray-900 bg-white">2 Travelers</option>
                <option className="text-gray-900 bg-white">3 Travelers</option>
                <option className="text-gray-900 bg-white">4+ Travelers</option>
              </select>
            </div>
            <button onClick={() => {
              if (isSignedIn) router.push(\`/dashboard/plan?destination=\${encodeURIComponent(destination)}&startDate=\${startDate}&endDate=\${endDate}\`);
              else router.push("/sign-in");
            }} className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2 text-base shadow-lg shadow-violet-500/30">
              <Sparkles size={18} /> Plan My Trip with AI
            </button>
            <p className="text-xs text-white/50 text-center mt-3">Free to start · No credit card required · 30-second setup</p>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlideIndex(i)}
              className={\`h-1.5 rounded-full transition-all \${slideIndex === i ? "w-8 bg-white" : "w-2 bg-white/40"}\`} />
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gradient-to-r from-violet-600 to-pink-600 py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white px-4">
          {[
            { number: "50,000+", label: "Trips Planned" },
            { number: "120+", label: "Countries Covered" },
            { number: "4.9/5", label: "User Rating" },
            { number: "30 sec", label: "Avg. Plan Time" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold">{s.number}</div>
              <div className="text-white/75 text-sm mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 px-4 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-violet-600 font-semibold text-sm uppercase tracking-widest">What We Offer</span>
            <h2 className="text-4xl font-bold text-[#0f172a] mt-3 mb-4">Everything You Need to Travel Smarter</h2>
            <p className="text-[#64748b] text-lg max-w-2xl mx-auto">TripMind AI combines artificial intelligence with real travel data to give you the most personalized experience possible.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: "AI Itinerary Builder", desc: "Tell us your destination, dates, and budget. Our AI generates a detailed day-by-day plan with activities, restaurants, hotels, and local tips — in under 30 seconds.", color: "violet" },
              { icon: MessageCircle, title: "AI Travel Manager (Sarah)", desc: "Chat with Sarah, your personal AI travel agent. She understands your preferences and creates a fully custom trip plan just for you.", color: "pink" },
              { icon: FileText, title: "PDF Itinerary Export", desc: "Download your complete travel itinerary as a beautifully formatted PDF. Share it with family or keep it for offline access.", color: "purple" },
              { icon: Globe, title: "Destination Discovery", desc: "Explore 120+ destinations worldwide with curated guides, popular activities, local food recommendations, and safety tips.", color: "blue" },
              { icon: Plane, title: "Flight & Hotel Comparisons", desc: "Get real-time comparisons for flights and hotels within your budget — no more jumping between 10 different sites.", color: "green" },
              { icon: Shield, title: "Secure & Private", desc: "Your travel plans and personal information are fully encrypted and private. We never sell your data to third parties.", color: "orange" },
            ].map((service) => (
              <div key={service.title} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg hover:border-violet-100 transition group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition"
                  style={{background: service.color === "violet" ? "#f5f3ff" : service.color === "pink" ? "#fdf2f8" : service.color === "purple" ? "#faf5ff" : service.color === "blue" ? "#eff6ff" : service.color === "green" ? "#f0fdf4" : "#fff7ed"}}>
                  <service.icon size={22} style={{color: service.color === "violet" ? "#7c3aed" : service.color === "pink" ? "#db2777" : service.color === "purple" ? "#9333ea" : service.color === "blue" ? "#2563eb" : service.color === "green" ? "#16a34a" : "#ea580c"}} />
                </div>
                <h3 className="text-lg font-bold text-[#0f172a] mb-3">{service.title}</h3>
                <p className="text-[#64748b] leading-relaxed text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-violet-600 font-semibold text-sm uppercase tracking-widest">Simple Process</span>
            <h2 className="text-4xl font-bold text-[#0f172a] mt-3 mb-4">Plan a Trip in 3 Easy Steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: "01", title: "Enter Your Details", desc: "Tell TripMind AI where you want to go, your travel dates, budget, and interests. Takes less than 60 seconds.", emoji: "🎯" },
              { step: "02", title: "AI Creates Your Plan", desc: "Our AI analyzes thousands of data points and generates a personalized day-by-day itinerary tailored to your preferences.", emoji: "🤖" },
              { step: "03", title: "Download & Go", desc: "Download your PDF itinerary, book with confidence, and enjoy your trip. Sarah is always on standby to help.", emoji: "✈️" },
            ].map((item, i) => (
              <div key={item.step} className="text-center relative">
                {i < 2 && <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] right-[-calc(50%-40px)] h-0.5 bg-gradient-to-r from-violet-200 to-pink-200 w-full" />}
                <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-pink-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-5 shadow-lg shadow-violet-200">
                  {item.step}
                </div>
                <div className="text-2xl mb-3">{item.emoji}</div>
                <h3 className="text-xl font-bold text-[#0f172a] mb-3">{item.title}</h3>
                <p className="text-[#64748b] leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 px-4 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0f172a] mb-2">Popular Destinations</h2>
            <p className="text-[#64748b]">Handpicked by our AI for unforgettable experiences</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              { name: "Paris, France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2673", price: "From $499", tag: "Romance" },
              { name: "Tokyo, Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2670", price: "From $799", tag: "Culture" },
              { name: "New York, USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2670", price: "From $399", tag: "City Life" },
              { name: "Bali, Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2670", price: "From $599", tag: "Beach" },
            ].map((place) => (
              <div key={place.name} className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer">
                <img src={place.image} alt={place.name} className="w-full h-64 object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-violet-700 text-xs font-bold px-3 py-1 rounded-full border border-white/50">{place.tag}</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white text-lg font-bold">{place.name}</h3>
                  <p className="text-white/75 text-sm">{place.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center mb-14">
          <span className="text-violet-600 font-semibold text-sm uppercase tracking-widest">Pricing</span>
          <h2 className="text-4xl font-bold text-[#0f172a] mt-3 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-[#64748b] text-lg">Start free. Upgrade when you're ready.</p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#0f172a] mb-1">Free Plan</h3>
            <p className="text-[#64748b] text-sm mb-5">Perfect to get started</p>
            <div className="text-5xl font-bold text-[#0f172a] mb-6">$0<span className="text-lg text-[#64748b] font-normal">/month</span></div>
            <ul className="space-y-3 mb-8">
              {["2 AI itineraries per month", "Basic trip planning", "PDF export", "Save & view trips"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-[#64748b] text-sm">
                  <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                    <Check size={11} className="text-green-600" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <SignInButton mode="modal">
              <button className="w-full py-3 rounded-xl font-semibold border-2 border-gray-200 text-[#64748b] hover:bg-gray-50 transition">Get Started Free</button>
            </SignInButton>
          </div>
          <div className="bg-gradient-to-br from-violet-600 to-pink-600 rounded-3xl p-8 shadow-xl shadow-violet-200 relative text-white">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-md">MOST POPULAR ⭐</div>
            <h3 className="text-xl font-bold mb-1">Pro Plan</h3>
            <p className="text-white/70 text-sm mb-5">For serious travelers</p>
            <div className="text-5xl font-bold mb-6">$3<span className="text-lg text-white/70 font-normal">/month</span></div>
            <ul className="space-y-3 mb-8">
              {["Unlimited AI itineraries", "AI Travel Manager Sarah", "PDF export with branding", "Hotel & flight comparisons", "WhatsApp trip sharing", "Priority support", "Cancel anytime"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-white text-sm">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
                    <Check size={11} className="text-yellow-300" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/pricing">
              <button className="w-full py-3.5 rounded-xl font-bold bg-white text-violet-700 hover:bg-violet-50 transition flex items-center justify-center gap-2 shadow-lg">
                <Zap size={16} /> Start Pro — $3/month
              </button>
            </Link>
            <p className="text-white/50 text-xs text-center mt-3">No contracts. Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#0f172a] mb-2">Travelers Love TripMind AI</h2>
            <p className="text-[#64748b]">Join thousands of happy travelers worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Sarah M.", location: "New York, USA", rating: 5, text: "TripMind AI planned my entire 10-day Japan trip in under a minute. The itinerary was incredibly detailed with local tips I never would have found on my own." },
              { name: "Ahmed K.", location: "Dubai, UAE", rating: 5, text: "The AI travel manager Sarah is amazing. I just described what I wanted and she created the perfect itinerary for my family trip to Europe. Saved me hours of research." },
              { name: "Priya L.", location: "Mumbai, India", rating: 5, text: "At $3/month this is the best travel investment I've made. I've planned 5 trips already and every single one has been perfect. The PDF export feature is brilliant." },
            ].map((review) => (
              <div key={review.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-violet-100 transition">
                <div className="flex gap-1 mb-4">
                  {Array(review.rating).fill(0).map((_, i) => <Star key={i} size={15} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-[#64748b] mb-5 leading-relaxed text-sm">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-violet-200">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-[#0f172a] text-sm">{review.name}</p>
                    <p className="text-[#64748b] text-xs">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0f172a] mb-2">Travel Tips & Stories</h2>
            <p className="text-[#64748b]">Insights from our AI and community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "10 Hidden Gems in Europe", desc: "Off-the-beaten-path destinations you'll absolutely love", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2670", date: "June 1, 2026" },
              { title: "How AI is Changing Travel Planning", desc: "The future of personalized travel experiences powered by AI", image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2671", date: "May 20, 2026" },
              { title: "Budget Travel Hacks for 2026", desc: "Save money without sacrificing incredible experiences", image: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=2574", date: "May 10, 2026" },
            ].map((post, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg hover:border-violet-100 transition group cursor-pointer">
                <div className="overflow-hidden h-48">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-5">
                  <p className="text-xs text-[#64748b] mb-2 font-medium">{post.date}</p>
                  <h3 className="text-base font-bold text-[#0f172a] mb-2">{post.title}</h3>
                  <p className="text-[#64748b] text-sm mb-4">{post.desc}</p>
                  <span className="text-violet-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Read More <ArrowRight size={14} /></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-violet-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center text-white relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-5">Ready to Plan Your Next Adventure?</h2>
          <p className="text-white/80 text-lg mb-10">Join 50,000+ travelers who plan smarter with TripMind AI.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignInButton mode="modal">
              <button className="bg-white text-violet-700 px-8 py-4 rounded-xl font-bold hover:shadow-xl transition text-lg shadow-lg">
                Start Free Today ✈️
              </button>
            </SignInButton>
            <Link href="/pricing">
              <button className="border-2 border-white/50 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition text-lg backdrop-blur-sm">
                View Pricing
              </button>
            </Link>
          </div>
          <p className="text-white/50 text-sm mt-6">No credit card required · Free plan available forever</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-[#64748b] py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-white text-xl font-bold">TripMind AI</span>
            </div>
            <p className="text-sm leading-relaxed mb-5">Your AI-powered travel companion. We create personalized itineraries, find the best deals, and help you travel smarter — all in seconds.</p>
            <div className="flex gap-4 text-sm">
              <a href="#" className="hover:text-white transition">Instagram</a>
              <a href="#" className="hover:text-white transition">Twitter</a>
              <a href="#" className="hover:text-white transition">Facebook</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="hover:text-white transition">Services</a></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><a href="#blog" className="hover:text-white transition">Blog</a></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail size={13} /> hello@tripmind.ai</li>
              <li className="flex items-center gap-2"><Phone size={13} /> +1 (800) 123-4567</li>
              <li className="flex items-center gap-2"><MapPin size={13} /> San Francisco, CA</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-sm">
          © 2026 TripMind AI. All rights reserved. Built with AI. ✨
        </div>
      </footer>

    </div>
  );
}
`;

fs.writeFileSync('app/page.tsx', content);
console.log('Done homepage');