'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Plane } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  showActions?: boolean;
}

interface LeadData {
  name?: string;
  email?: string;
  phone?: string;
  destination?: string;
  dates?: string;
  travelers?: string;
  budget?: string;
  interests?: string;
}

const QUICK_REPLIES_MAP: Record<string, string[]> = {
  destination: ['Europe 🇪🇺', 'Asia 🌏', 'Americas 🌎', 'Middle East 🕌'],
  budget: ['Budget ($500-1000)', 'Mid-range ($1000-3000)', 'Luxury ($3000+)'],
  travelers: ['Solo 🧳', 'Couple 💑', 'Family 👨‍👩‍👧', 'Group 👥'],
  interests: ['Beach & Relaxation 🏖️', 'Culture & History 🏛️', 'Adventure 🏔️', 'Food & Nightlife 🍽️'],
};

function getQuickReplies(message: string): string[] {
  const msg = message.toLowerCase();
  if (msg.includes('where') || msg.includes('destination') || msg.includes('country') || msg.includes('which city')) return QUICK_REPLIES_MAP.destination;
  if (msg.includes('budget') || msg.includes('rough budget') || msg.includes('per person')) return QUICK_REPLIES_MAP.budget;
  if (msg.includes('flying solo') || msg.includes('bringing someone') || msg.includes('how many')) return QUICK_REPLIES_MAP.travelers;
  if (msg.includes('interest') || msg.includes('excite') || msg.includes('luxury-and-relax') || msg.includes('adventure')) return QUICK_REPLIES_MAP.interests;
  return [];
}

export default function TravelAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setLoading(true);
      fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [], leadData: {} }),
      })
        .then(r => r.json())
        .then(data => {
          setMessages([{
            role: 'assistant',
            content: data.reply,
            suggestions: getQuickReplies(data.reply)
          }]);
          setLoading(false);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(text?: string) {
    const messageText = text || input;
    if (!messageText.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: messageText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          leadData
        }),
      });
      const data = await res.json();
      const newLead = { ...leadData, ...data.leadData };
      setLeadData(newLead);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply,
        suggestions: data.readyToGenerate ? [] : getQuickReplies(data.reply),
        showActions: data.readyToGenerate
      }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, I'm experiencing technical difficulties. Please try again.",
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleGenerateItinerary() {
    const params = new URLSearchParams();
    if (leadData.destination) params.set('destination', leadData.destination);
    if (leadData.dates) params.set('startDate', leadData.dates);
    if (leadData.budget) {
      const b = leadData.budget.toLowerCase();
      params.set('budget', b.includes('luxury') ? 'luxury' : b.includes('mid') ? 'medium' : 'budget');
    }
    router.push(`/dashboard/plan?${params.toString()}`);
  }

  function handleWhatsApp() {
    const text = `I just planned my trip to ${leadData.destination || 'an amazing destination'} with TripMind AI! Try it free: https://tripmind-ai-kappa.vercel.app`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  return (
    <>
      {/* Floating bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-50 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-full p-3.5 shadow-2xl hover:scale-110 transition-transform duration-200"
        >
          <MessageCircle size={24} />
          <span className="absolute -top-1 -right-1 bg-green-400 rounded-full w-3.5 h-3.5 animate-pulse border-2 border-white" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className={`fixed bottom-5 right-5 z-50 w-[320px] sm:w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col transition-all duration-300 ${isMinimized ? 'h-14' : 'h-[480px] sm:h-[520px]'}`}>

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-pink-600 rounded-t-2xl px-3 py-2.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Plane size={15} className="text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">TripMind AI</p>
                <p className="text-white/70 text-xs">Personal Travel Manager</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setIsMinimized(!isMinimized)} className="text-white/70 hover:text-white transition p-1">
                <Minimize2 size={14} />
              </button>
              <button onClick={() => { setIsOpen(false); setIsMinimized(false); }} className="text-white/70 hover:text-white transition p-1">
                <X size={14} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
                {messages.map((msg, i) => (
                  <div key={i} className="space-y-2">
                    <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-1.5`}>
                      {msg.role === 'assistant' && (
                        <div className="w-6 h-6 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-full flex items-center justify-center shrink-0 mb-1">
                          <Plane size={11} className="text-white" />
                        </div>
                      )}
                      <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-br-sm'
                          : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                      }`}>
                        {msg.content}
                      </div>
                    </div>

                    {/* Quick replies */}
                    {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 ml-8">
                        {msg.suggestions.map((s, j) => (
                          <button
                            key={j}
                            onClick={() => sendMessage(s)}
                            className="text-xs bg-white border border-indigo-200 text-indigo-600 px-2.5 py-1 rounded-full hover:bg-indigo-50 transition font-medium shadow-sm"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Action buttons */}
                    {msg.role === 'assistant' && msg.showActions && (
                      <div className="ml-8 space-y-1.5">
                        <button
                          onClick={handleGenerateItinerary}
                          className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-xs py-2.5 rounded-xl font-semibold hover:opacity-90 transition"
                        >
                          ✨ Generate My Full Itinerary
                        </button>
                        <button
                          onClick={handleWhatsApp}
                          className="w-full bg-green-500 text-white text-xs py-2 rounded-xl font-semibold hover:bg-green-600 transition"
                        >
                          💬 Share on WhatsApp
                        </button>
                        <p className="text-xs text-gray-400 text-center pt-1">
                          🎁 First itinerary free · Pro plan from $3/mo
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="flex items-end gap-1.5">
                    <div className="w-6 h-6 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-full flex items-center justify-center shrink-0">
                      <Plane size={11} className="text-white" />
                    </div>
                    <div className="bg-white px-3 py-2.5 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                      <div className="flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-2.5 border-t border-gray-100 bg-white rounded-b-2xl shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    disabled={loading}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-xl px-3 py-2 hover:opacity-90 disabled:opacity-40 transition"
                  >
                    <Send size={14} />
                  </button>
                </div>
                <p className="text-xs text-gray-400 text-center mt-1.5">Powered by TripMind AI ✨</p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}