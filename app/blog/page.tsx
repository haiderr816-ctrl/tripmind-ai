import Link from "next/link";
import { ArrowRight } from "lucide-react";

const posts = [
  { title: "10 Hidden Gems in Europe", desc: "Off-the-beaten-path destinations you'll absolutely love.", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2670", date: "May 15, 2026", category: "Destinations" },
  { title: "How AI is Changing Travel Planning", desc: "The future of personalized itineraries is already here.", image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2671", date: "May 10, 2026", category: "Technology" },
  { title: "Budget Travel Hacks for 2026", desc: "Save money without sacrificing incredible experiences.", image: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=2574", date: "May 5, 2026", category: "Tips" },
  { title: "The Best Food Cities in Asia", desc: "From street food to Michelin stars, Asia delivers.", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2670", date: "April 28, 2026", category: "Food" },
  { title: "Solo Travel Safety Guide", desc: "Everything you need to know to travel alone confidently.", image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2670", date: "April 20, 2026", category: "Tips" },
  { title: "Top Beach Destinations for 2026", desc: "Sun, sand, and crystal waters await you this year.", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2670", date: "April 15, 2026", category: "Destinations" },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-pink-600 py-16 px-4 text-center text-white">
        <h1 className="text-4xl font-bold mb-3">Travel Tips & Stories</h1>
        <p className="text-white/80 text-lg">Insights, guides, and inspiration for every traveler</p>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition group">
              <div className="relative overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition duration-500" />
                <span className="absolute top-3 left-3 bg-white/90 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
                  {post.category}
                </span>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.desc}</p>
                <span className="text-indigo-600 font-medium flex items-center gap-1 cursor-pointer hover:gap-2 transition-all">
                  Read More <ArrowRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}