'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, LogIn, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser, SignInButton } from '@clerk/nextjs';

const QUICK_REPLIES: Record<string, string[]> = {
  destination: ['Europe 🇪🇺', 'Asia 🌏', 'Americas 🌎', 'Middle East 🕌'],
  travelers: ['Solo 🧳', 'Couple 💑', 'Family 👨‍👩‍👧', 'Group 👥'],
  style: ['Beach & Relax 🏖️', 'Culture & History 🏛️', 'Adventure 🏔️', 'Food & Nightlife 🍽️'],
  interests: ['Beach & Relax 🏖️', 'Culture & History 🏛️', 'Adventure 🏔️', 'Food & Nightlife 🍽️'],
  budget: ['Budget ($500-1k)', 'Mid-range ($1-3k)', 'Luxury ($3k+)'],
  firsttime: ['Yes, first time!', 'No, been before'],
  hotel: ['3-Star 🏨', '4-Star ⭐⭐⭐⭐', '5-Star 🌟', 'Budget friendly'],
};

function getQuickReplies(message: string): string[] {
  const m = message.toLowerCase();
  if (m.includes('dreaming of') || m.includes('country') || m.includes('traveling to')) return QUICK_REPLIES.destination;
  if (m.includes('solo') || m.includes('flying') || m.includes('someone special')) return QUICK_REPLIES.travelers;
  if (m.includes('luxury-and-relax') || m.includes('adventure-and-explore')) return QUICK_REPLIES.style;
  if (m.includes('excites') || m.includes('what excites')) return QUICK_REPLIES.interests;
  if (m.includes('budget per person') || m.includes('rough budget')) return QUICK_REPLIES.budget;
  if (m.includes('first time') || m.includes('been before')) return QUICK_REPLIES.firsttime;
  if (m.includes('hotel style') || m.includes('preferred hotel')) return QUICK_REPLIES.hotel;
  return [];
}

const STORAGE_KEY = 'tripmind_pending_lead';

export default function ChatAgent() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{role:string;content:string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [leadData, setLeadData] = useState<any>({});
  const [readyToGenerate, setReadyToGenerate] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || initialized) return;
    setInitialized(true);
    setLoading(true);
    fetch('/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [], leadData: {} })
    })
      .then(r => r.json())
      .then(data => {
        setMessages([{ role: 'assistant', content: data.reply }]);
        setLoading(false);
      })
      .catch(() => {
        setMessages([{ role: 'assistant', content: "Hi! I'm Sarah 👋 Which country are you dreaming of visiting?" }]);
        setLoading(false);
      });
  }, [open]);

  useEffect(() => {
    if (!isSignedIn) return;
    try {
      const pending = localStorage.getItem(STORAGE_KEY);
      if (!pending) return;
      const saved = JSON.parse(pending);
      localStorage.removeItem(STORAGE_KEY);
      const lead = saved.leadData || {};
      const startDate = lead.startDate || (lead.dates || '').split(' to ')[0]?.trim() || '';
      const endDate = lead.endDate || (lead.dates || '').split(' to ')[1]?.trim() || '';
      if (!lead.destination) return;
      const params = new URLSearchParams({
        destination: lead.destination || '',
        startDate, endDate,
        budget: lead.budget || 'Medium',
        interests: lead.interests || '',
      });
      router.push('/dashboard/plan?' + params.toString());
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [isSignedIn]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, loading]);

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
      if (data.leadData) setLeadData((prev: any) => ({ ...prev, ...data.leadData }));
      if (data.readyToGenerate) setReadyToGenerate(true);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, something went wrong!" }]);
    } finally {
      setLoading(false);
    }
  }

  function buildPlanUrl(lead: any) {
    const startDate = lead.startDate || (lead.dates || '').split(' to ')[0]?.trim() || '';
    const endDate = lead.endDate || (lead.dates || '').split(' to ')[1]?.trim() || '';
    return '/dashboard/plan?' + new URLSearchParams({
      destination: lead.destination || '',
      startDate, endDate,
      budget: lead.budget || 'Medium',
      interests: lead.interests || '',
    }).toString();
  }

  function handleGenerate() {
    if (isSignedIn) {
      setGenerating(true);
      router.push(buildPlanUrl(leadData));
    } else {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ leadData, messages })); } catch {}
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Almost there! 🎉 Sign in quickly and I'll generate your itinerary instantly — your trip details are saved!"
      }]);
    }
  }

  const lastMessage = messages[messages.length - 1];
  const quickReplies = lastMessage?.role === 'assistant' && !loading ? getQuickReplies(lastMessage.content) : [];
  const showLoginPrompt = !isSignedIn && lastMessage?.content?.includes('Sign in quickly');
  const signInRedirect = leadData.destination ? buildPlanUrl(leadData) : '/dashboard';

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center"
        style={{boxShadow: '0 8px 32px rgba(124,58,237,0.4)'}}
      >
        <div className="relative">
          {open
            ? <X size={20} className="text-white" />
            : <MessageCircle size={20} className="text-white fill-white" />
          }
          {!open && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          )}
        </div>
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex flex-col bg-white rounded-2xl overflow-hidden"
          style={{
            width: '340px',
            height: '500px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-pink-500 px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-xs leading-tight">Sarah</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <p className="text-white/75 text-[10px]">Travel Manager · Online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white transition ml-auto">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-end gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0 mb-0.5">S</div>
                )}
                <div className={`max-w-[72%] px-3 py-2 rounded-2xl text-[12px] leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">S</div>
                <div className="bg-white px-3 py-2.5 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                  <div className="flex gap-1 items-center">
                    {[0,1,2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: i*0.15+'s'}} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {quickReplies.length > 0 && !showLoginPrompt && (
              <div className="flex flex-wrap gap-1.5 pl-8 pt-1">
                {quickReplies.map((r, i) => (
                  <button key={i} onClick={() => sendMessage(r)}
                    className="bg-white border border-violet-200 text-violet-600 text-[11px] font-medium px-2.5 py-1 rounded-full hover:bg-violet-50 hover:border-violet-400 transition shadow-sm">
                    {r}
                  </button>
                ))}
              </div>
            )}

            {showLoginPrompt && (
              <div className="pl-8 pt-1 flex flex-col gap-2">
                <SignInButton mode="modal" forceRedirectUrl={signInRedirect}>
                  <button className="flex items-center justify-center gap-1.5 w-full bg-gradient-to-r from-violet-600 to-pink-500 text-white px-3 py-2 rounded-xl font-semibold text-xs hover:opacity-90 transition shadow-md">
                    <LogIn size={12} /> Sign In & Generate ✨
                  </button>
                </SignInButton>
                <p className="text-center text-[10px] text-gray-400">Your trip details are saved</p>
              </div>
            )}

            {readyToGenerate && !loading && isSignedIn && (
              <div className="flex flex-col gap-1.5 pl-8 pt-1">
                <button onClick={handleGenerate} disabled={generating}
                  className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-pink-500 text-white px-3 py-2 rounded-xl font-semibold text-xs hover:opacity-90 transition shadow-md disabled:opacity-60">
                  {generating ? '⏳ Opening...' : <><Sparkles size={11} /> Generate My Itinerary ✨</>}
                </button>
                <button onClick={() => {
                  const text = `Planning a trip to ${leadData.destination} with TripMind AI! Budget: ${leadData.budget}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }} className="flex items-center justify-center gap-1.5 bg-green-500 text-white px-3 py-2 rounded-xl font-semibold text-xs hover:bg-green-600 transition">
                  💬 Share on WhatsApp
                </button>
                <p className="text-center text-[10px] text-gray-400">🎁 First itinerary free · Pro $3/mo</p>
              </div>
            )}

            {readyToGenerate && !loading && !isSignedIn && !showLoginPrompt && (
              <div className="flex flex-col gap-1.5 pl-8 pt-1">
                <button onClick={handleGenerate}
                  className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-pink-500 text-white px-3 py-2 rounded-xl font-semibold text-xs hover:opacity-90 transition shadow-md">
                  <Sparkles size={11} /> Generate My Itinerary ✨
                </button>
                <p className="text-center text-[10px] text-gray-400">🎁 First itinerary free · Pro $3/mo</p>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-2.5 bg-white border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[12px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              />
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                className="w-8 h-8 bg-gradient-to-r from-violet-600 to-pink-500 rounded-xl flex items-center justify-center hover:opacity-90 transition disabled:opacity-40 shrink-0">
                <Send size={13} className="text-white" />
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-1.5">Powered by TripMind AI · Sarah is always online</p>
          </div>
        </div>
      )}
    </>
  );
}