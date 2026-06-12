import Link from "next/link";
import { Check, X } from "lucide-react";

const destinations = [
  {
    name: "Paris",
    image: "https://images.unsplash.com/photo-1499856871958-5b9357976b82?q=80&w=2942",
    price: "$499",
    weather: "Mild",
    food: "Excellent",
    nightlife: "Great",
    safety: "Good",
    wifi: true,
    visa: false,
    family: true,
    solo: true,
  },
  {
    name: "Tokyo",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2670",
    price: "$799",
    weather: "Varied",
    food: "Excellent",
    nightlife: "Great",
    safety: "Excellent",
    wifi: true,
    visa: false,
    family: true,
    solo: true,
  },
  {
    name: "Bali",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2670",
    price: "$599",
    weather: "Tropical",
    food: "Good",
    nightlife: "Good",
    safety: "Good",
    wifi: true,
    visa: true,
    family: true,
    solo: true,
  },
];

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-pink-600 py-16 px-4 text-center text-white">
        <h1 className="text-4xl font-bold mb-3">Compare Destinations</h1>
        <p className="text-white/80 text-lg">Side by side comparison to find your perfect match</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Destination Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {destinations.map((d, i) => (
            <div key={i} className="rounded-2xl overflow-hidden shadow-md border border-gray-100 text-center">
              <img src={d.image} alt={d.name} className="w-full h-40 object-cover" loading="lazy" />
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900">{d.name}</h3>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{d.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="rounded-2xl border border-gray-100 shadow-md overflow-hidden">
          {[
            { label: "Weather", key: "weather" },
            { label: "Food Scene", key: "food" },
            { label: "Nightlife", key: "nightlife" },
            { label: "Safety", key: "safety" },
          ].map((row, i) => (
            <div key={i} className={`grid grid-cols-4 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
              <div className="p-4 font-semibold text-gray-700 border-r border-gray-100">{row.label}</div>
              {destinations.map((d, j) => (
                <div key={j} className="p-4 text-center text-gray-600">{(d as any)[row.key]}</div>
              ))}
            </div>
          ))}
          {[
            { label: "Free WiFi", key: "wifi" },
            { label: "Visa Required", key: "visa" },
            { label: "Family Friendly", key: "family" },
            { label: "Solo Friendly", key: "solo" },
          ].map((row, i) => (
            <div key={i} className={`grid grid-cols-4 ${(i + 4) % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
              <div className="p-4 font-semibold text-gray-700 border-r border-gray-100">{row.label}</div>
              {destinations.map((d, j) => (
                <div key={j} className="p-4 flex justify-center">
                  {(d as any)[row.key]
                    ? <Check size={20} className="text-green-500" />
                    : <X size={20} className="text-red-400" />}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/dashboard/plan" className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition shadow-md">
            Plan My Trip Now
          </Link>
        </div>
      </div>
    </div>
  );
}