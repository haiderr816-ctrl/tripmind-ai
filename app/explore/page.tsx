"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

const places = [
  { name: "Paris", country: "France", category: "Culture", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2673", desc: "The city of light, love, and incredible cuisine." },
  { name: "Tokyo", country: "Japan", category: "Adventure", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2670", desc: "A perfect blend of ancient tradition and modern tech." },
  { name: "Bali", country: "Indonesia", category: "Beach", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2670", desc: "Tropical paradise with stunning temples and beaches." },
  { name: "Santorini", country: "Greece", category: "Romance", image: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?q=80&w=2670", desc: "Iconic white buildings and breathtaking sunsets." },
  { name: "New York", country: "USA", category: "Culture", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2670", desc: "The city that never sleeps — energy like nowhere else." },
  { name: "Maldives", country: "Maldives", category: "Beach", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2670", desc: "Crystal clear waters and overwater bungalows." },
  { name: "Rome", country: "Italy", category: "Culture", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2670", desc: "Ancient history, incredible food, and timeless beauty." },
  { name: "Dubai", country: "UAE", category: "Adventure", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2670", desc: "Futuristic skyline meets desert adventure." },
  { name: "Machu Picchu", country: "Peru", category: "Adventure", image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2670", desc: "Ancient Incan citadel set high in the Andes mountains." },
];

const categories = ["All", "Beach", "Culture", "Adventure", "Romance"];

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("All");

  const filtered = places.filter((p) => {
    const matchCategory = active === "All" || p.category === active;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.country.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-pink-600 py-16 px-4 text-center text-white">
        <h1 className="text-4xl font-bold mb-3">Explore the World</h1>
        <p className="text-white/80 text-lg mb-8">Discover your next adventure</p>
        <div className="max-w-md mx-auto relative">
          <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="flex gap-3 flex-wrap mb-10 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                active === cat
                  ? "bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((place, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition group">
              <div className="relative overflow-hidden">
                <img src={place.image} alt={place.name} className="w-full h-52 object-cover group-hover:scale-105 transition duration-500" />
                <span className="absolute top-3 left-3 bg-white/90 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
                  {place.category}
                </span>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{place.name}</h3>
                  <span className="text-sm text-gray-500">{place.country}</span>
                </div>
                <p className="text-gray-600 mb-4">{place.desc}</p>
                <Link href="/dashboard/plan" className="flex items-center gap-1 text-sm text-indigo-600 font-medium hover:gap-2 transition-all">
                  Plan a trip here <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">No destinations found for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}