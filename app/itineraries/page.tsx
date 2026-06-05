import Link from "next/link";
import { ArrowRight } from "lucide-react";

const itineraries = [
  { title: "7 Days in Paris", desc: "Art, cuisine, and romance in the city of light.", image: "https://images.unsplash.com/photo-1499856871958-5b9357976b82?q=80&w=2942", days: 7, price: "$499" },
  { title: "5 Days in Tokyo", desc: "Temples, technology, and incredible food.", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2670", days: 5, price: "$799" },
  { title: "10 Days in Bali", desc: "Beaches, rice terraces, and spiritual retreats.", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2670", days: 10, price: "$599" },
  { title: "4 Days in Santorini", desc: "Stunning sunsets and white-washed villages.", image: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?q=80&w=2670", days: 4, price: "$699" },
  { title: "6 Days in New York", desc: "The city that never sleeps, fully explored.", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2670", days: 6, price: "$399" },
  { title: "8 Days in Maldives", desc: "Crystal waters, overwater bungalows, pure bliss.", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2670", days: 8, price: "$1299" },
];

export default function ItinerariesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-pink-600 py-16 px-4 text-center text-white">
        <h1 className="text-4xl font-bold mb-3">AI-Curated Itineraries</h1>
        <p className="text-white/80 text-lg">Handcrafted travel plans for every type of explorer</p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {itineraries.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition group">
              <div className="relative overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-52 object-cover group-hover:scale-105 transition duration-500" />
                <span className="absolute top-3 left-3 bg-white/90 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
                  {item.days} Days
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-indigo-600">{item.price}</span>
                  <Link href="/dashboard/plan" className="flex items-center gap-1 text-sm text-indigo-600 font-medium hover:gap-2 transition-all">
                    Plan this <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}