import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-200">
          <Sparkles size={28} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-[#0f172a] mb-4">About TripMind AI</h1>
        <p className="text-[#64748b] text-lg leading-relaxed mb-8">TripMind AI is an AI-powered travel planning platform that creates fully personalized itineraries in seconds. We combine artificial intelligence with real travel data to help you plan smarter, travel better, and spend less time researching.</p>
        <Link href="/"><button className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg shadow-violet-200">Back to Home</button></Link>
      </div>
    </div>
  );
}