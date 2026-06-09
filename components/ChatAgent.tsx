'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SARAH_PIC = "https://randomuser.me/api/portraits/women/44.jpg";

const QUICK_REPLIES: Record<string, string[]> = {
  destination: ['Europe 🇪🇺', 'Asia 🌏', 'Americas 🌎', 'Middle East 🕌'],
  travelers: ['Solo 🧳', 'Couple 💑', 'Family 👨‍👩‍👧', 'Group 👥'],
  style: ['Beach & Relaxation 🏖️', 'Culture & History 🏛️', 'Adventure 🏔️', 'Food & Nightlife 🍽️'],
  interests: ['Beach & Relaxation 🏖️', 'Culture & History 🏛️', 'Adventure 🏔️', 'Food & Nightlife 🍽️'],
  budget: ['Budget ($500-1000)', 'Mid-range ($1000-3000)', 'Luxury ($3000+)'],
  firsttime: ['Yes, first time!', 'No, been before'],
  hotel: ['Boutique & Local 🏡', 'Luxury Chain 🏨', 'Whatever fits budget'],
};

function getQuickReplies(message: string): string[] {
  const m = message.toLowerCase();
  if (m.includes('where') || m.includes('destination') || m.includes('traveling to') || m.includes('thinking of')) return QUICK_REPLIES.destination;
  if (m.includes('solo') || m.includes('flying') || m.includes('bringing') || m.includes('travelers')) return QUICK_REPLIES.travelers;
  if (m.includes('luxury-and-relax') || m.includes('adventure-and-explore') || m.includes('travel style')) return QUICK_REPLIES.style;
  if (m.includes('excites') || m.includes('food') || m.includes('history') || m.includes('interests')) return QUICK_REPLIES.interests;
  if (m.includes('budget') || m.includes('rough') || m.includes('per person')) return QUICK_REPLIES.budget;
  if (m.includes('first time') || m.includes('been before')) return QUICK_REPLIES.firsttime;
  if (m.includes('boutique') || m.includes('luxury chains') || m.includes('hotel preference')) return QUICK_REPLIES.hotel;
  return [];
}

export default function ChatAgent() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Sarah, your personal travel manager at TripMind AI 👋\n\nI'm so excited to help plan your trip. Where are you thinking of traveling to?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [leadData, setLeadData] = useState<any>({});
  const [readyToGenerate, setReadyToGenerate] = useState(false);
  const [generating, setGenerating] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  async function sendMessage(text?: string) {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, leadData })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      setLeadData(data.leadData || {});
      if (data.readyToGenerate) setReadyToGenerate(true);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, something went wrong. Please try again!" }]);
    } finally {
      setLoading(false);
    }
  }

  async function generateItinerary() {
    setGenerating(true);
    try {
      const cities = leadData.destination?.split(',').map((c: string) => c.trim()).filter(Boolean) || [];
      const country = cities[cities.length - 1] || leadData.destination;
      const mainCities = cities.length > 1 ? cities.slice(0, -1) : [];

      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: leadData.destination,
          country,
          cities: mainCities,
          startDate: leadData.dates?.split(' to ')[0]?.trim() || leadData.dates,
          endDate: leadData.dates?.split(' to ')[1]?.trim() || leadData.dates,
          budget: leadData.budget || 'Medium',
          interests: leadData.interests || '',
        })
      });
      const data = await res.json();
      if (data.tripId) {
        setOpen(false);
        router.push('/dashboard/trips/' + data.tripId);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Hmm, something went wrong. Please try the Plan page directly!" }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry! Please try again or use the Plan page." }]);
    } finally {
      setGenerating(false);
    }
  }

  const lastMessage = messages[messages.length - 1];
  const quickReplies = lastMessage?.role === 'assistant' ? getQuickReplies(lastMessage.content) : [];

  return (
    <>
      {/* Bubble */}
      <button onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full overflow-hidden shadow-xl shadow-violet-300 hover:scale-110 transition-transform border-2 border-white">
        {open ? (
          <div className="w-full h-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
            <X size={22} className="text-white" />
          </div>
        ) : (
          <img src={SARAH_PIC} alt="Sarah" className="w-full h-full object-cover" />
        )}
        {!open && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[600px] flex flex-col bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-pink-600 p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-white/40 shrink-0">
              <img src={SARAH_PIC} alt="Sarah" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Sarah — Travel Manager</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                <p className="text-white/80 text-xs">Online · TripMind AI</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white/70 hover:text-white transition">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]" style={{maxHeight: '380px'}}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full overflow-hidden mr-2 shrink-0 mt-1 border border-violet-200">
                    <img src={SARAH_PIC} alt="Sarah" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-br-sm'
                    : 'bg-white text-[#0f172a] shadow-sm border border-gray-100 rounded-bl-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full overflow-hidden mr-2 shrink-0 border border-violet-200">
                  <img src={SARAH_PIC} alt="Sarah" className="w-full h-full object-cover" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    {[0,1,2].map(i => (
                      <span key={i} className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: i * 0.15 + 's'}} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Replies */}
            {!loading && quickReplies.length > 0 && (
              <div className="flex flex-wrap gap-2 pl-9">
                {quickReplies.map((r, i) => (
                  <button key={i} onClick={() => sendMessage(r)}
                    className="bg-white border border-violet-200 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-violet-50 hover:border-violet-400 transition shadow-sm">
                    {r}
                  </button>
                ))}
              </div>
            )}

            {/* Generate Button */}
            {readyToGenerate && !loading && (
              <div className="flex flex-col gap-2 pl-9">
                <button onClick={generateItinerary} disabled={generating}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition shadow-lg shadow-violet-200 disabled:opacity-60">
                  {generating ? (
                    <><span className="animate-spin">⏳</span> Generating...</>
                  ) : (
                    <><Sparkles size={14} /> ✨ Generate My Full Itinerary</>
                  )}
                </button>
                <button onClick={() => {
                  const text = `Hey! I need help planning a trip to ${leadData.destination} from ${leadData.dates}. Budget: ${leadData.budget}. Interests: ${leadData.interests}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }}
                  className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-green-600 transition shadow-lg">
                  💬 Share on WhatsApp
                </button>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 bg-[#f8fafc] border border-gray-200 rounded-xl text-sm text-[#0f172a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                className="w-10 h-10 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl flex items-center justify-center hover:opacity-90 transition disabled:opacity-40 shadow-md shadow-violet-200">
                <Send size={16} className="text-white" />
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">Powered by TripMind AI · Sarah is always online</p>
          </div>
        </div>
      )}
    </>
  );
}