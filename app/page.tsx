"use client";

import { useState, useEffect } from "react";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plane, Sparkles, Star, ArrowRight, Mail, Phone, MapPin } from "lucide-react";

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                TripMind AI
              </Link>
              <div className="hidden md:flex gap-6">
                <Link href="/itineraries" className="text-gray-600 hover:text-gray-900 transition">Itineraries</Link>
                <Link href="/compare" className="text-gray-600 hover:text-gray-900 transition">Compare</Link>
                <Link href="/explore" className="text-gray-600 hover:text-gray-900 transition">Explore</Link>
                <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition">Blog</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <button className="text-gray-600 hover:text-gray-900 transition">Sign In</button>
                  </SignInButton>
                  <SignInButton mode="modal">
                    <button className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-5 py-2 rounded-full hover:opacity-90 transition shadow-md">
                      Plan My Trip
                    </button>
                  </SignInButton>
                </>
              ) : (
                <Link href="/dashboard">
                  <button className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-5 py-2 rounded-full hover:opacity-90 transition shadow-md">
                    Dashboard
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-[600px] flex items-center justify-center text-center overflow-hidden">
        {[
          "https://images.unsplash.com/photo-1499856871958-5b9357976b82?q=80&w=2942",
          "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2670",
          "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2670",
          "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?q=80&w=2670",
          "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2670",
        ].map((url, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url('${url}')`,
              opacity: slideIndex === i ? 1 : 0,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Your AI Travel Planner</h1>
          <<p className="text-base md:text-xl text-white/90 mb-8">Plan your perfect trip in seconds. Powered by AI, personalized for you.</p>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option>1 Adult</option>
                <option>2 Adults</option>
                <option>3 Adults</option>
                <option>4 Adults</option>
              </select>
            </div>
            <button
              onClick={() => {
                if (isSignedIn) {
                  router.push(`/dashboard/plan?destination=${encodeURIComponent(destination)}&startDate=${startDate}&endDate=${endDate}`);
                } else {
                  router.push("/sign-in");
                }
              }}
              className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              Ask TripMind AI <Sparkles size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Popular Destinations</h2>
          <p className="text-gray-600 text-center mb-10">Handpicked by our AI for unforgettable experiences</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2673", price: "$499" },
              { name: "Tokyo", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2670", price: "$799" },
              { name: "New York", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2670", price: "$399" },
              { name: "Bali", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2670", price: "$599" },
            ].map((place) => (
              <div key={place.name} className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
                <img src={place.image} alt={place.name} className="w-full h-64 object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white text-xl font-bold">{place.name}</h3>
                  <p className="text-white/80">Starting from {place.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Flight Connections */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Top Flight Connections</h2>
            <Link href="/explore" className="text-indigo-600 flex items-center gap-1">View all <ArrowRight size={16} /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { from: "New York", to: "London", price: "$499", badge: "TripMind Pick" },
              { from: "San Francisco", to: "Tokyo", price: "$799", badge: "Best Value" },
              { from: "Miami", to: "Paris", price: "$599", badge: "Popular" },
            ].map((flight, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{flight.badge}</span>
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                </div>
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Plane size={18} className="text-indigo-500" />
                  {flight.from} → {flight.to}
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-2">{flight.price}</p>
                <button className="mt-4 w-full border border-gray-200 rounded-xl py-2 text-gray-700 hover:bg-gray-50 transition">Select</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Travel Tips & Stories</h2>
          <p className="text-gray-600 text-center mb-10">Insights from our community and AI</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "10 Hidden Gems in Europe", desc: "Off-the-beaten-path destinations you'll love", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2670", date: "May 15, 2026" },
              { title: "How AI is Changing Travel Planning", desc: "The future of personalized itineraries", image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2671", date: "May 10, 2026" },
              { title: "Budget Travel Hacks for 2026", desc: "Save money without sacrificing experiences", image: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=2574", date: "May 5, 2026" },
            ].map((post, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition">
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.desc}</p>
                  <Link href="/blog" className="text-indigo-600 font-medium flex items-center gap-1">Read More <ArrowRight size={14} /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-pink-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Get Travel Deals in Your Inbox</h2>
          <p className="text-white/80 mb-6">Exclusive AI-curated deals and inspiration, straight to you.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:outline-none" />
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition">Subscribe</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <h3 className="text-white text-xl font-bold mb-4">TripMind AI</h3>
            <p className="text-sm">Your AI-powered travel companion, creating personalized itineraries and uncovering the best deals.</p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-white transition text-sm">Instagram</a>
              <a href="#" className="hover:text-white transition text-sm">Twitter</a>
              <a href="#" className="hover:text-white transition text-sm">Facebook</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-white transition">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail size={14} /> hello@tripmind.ai</li>
              <li className="flex items-center gap-2"><Phone size={14} /> +1 (800) 123-4567</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> 123 Travel St, NY 10001</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          &copy; 2026 TripMind AI. All rights reserved.
        </div>
      </footer>

    </div>
  );
}