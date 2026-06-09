'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser, SignInButton } from '@clerk/nextjs';

const QUICK_REPLIES: Record<string, string[]> = {
  destination: ['Europe 🇪🇺', 'Asia 🌏', 'Americas 🌎', 'Middle East 🕌'],
  travelers: ['Solo 🧳', 'Couple 💑', 'Family 👨‍👩‍👧', 'Group 👥'],
  style: ['Beach & Relaxation 🏖️', 'Culture & History 🏛️', 'Adventure 🏔️', 'Food & Nightlife 🍽️'],
  interests: ['Beach & Relaxation 🏖️', 'Culture & History 🏛️', 'Adventure 🏔️', 'Food & Nightlife 🍽️'],
  budget: ['Budget ($500-1000)', 'Mid-range ($1000-3000)', 'Luxury ($3000+)'],
  firsttime: ['Yes, first time!', 'No, been before'],
  hotel: ['3-Star 🏨', '4-Star ⭐⭐⭐⭐', '5-Star 🌟', 'Whatever fits budget'],
};

function getQuickReplies(message: string): string[] {
  const m = message.toLowerCase();
  if (m.includes('dreaming of') || m.includes('country') || m.includes('traveling to')) return QUICK_REPLIES.destination;
  if (m.includes('solo') || m.includes('flying') || m.includes('someone special')) return QUICK_REPLIES.travelers;
  if (m.includes('luxury-and-relax') || m.includes('adventure-and-explore') || m.includes('relax person')) return QUICK_REPLIES.style;
  if (m.includes('excites') || m.includes('spiritual') || m.includes('what excites')) return QUICK_REPLIES.interests;
  if (m.includes('budget per person') || m.includes('rough budget') || m.includes('estimated budget')) return QUICK_REPLIES.budget;
  if (m.includes('first time') || m.includes('been before') || m.includes('visited')) return QUICK_REPLIES.firsttime;
  if (m.includes('hotel style') || m.includes('3-star') || m.includes('4-star') || m.includes('5-star') || m.includes('preferred hotel')) return QUICK_REPLIES.hotel;
  return [];
}

const STORAGE_KEY = 'tripmind_pending_lead';

export default function ChatAgent() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Sarah, your personal travel manager at TripMind AI 👋\n\nI'm so excited to help plan your trip. Which country are you dreaming of visiting?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [leadData, setLeadData] = useState<any>({});
  const [readyToGenerate, setReadyToGenerate] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // On mount: if user just logged in and there's a pending lead, auto-redirect to plan page
  useEffect(() => {
    if (!isSignedIn) return;
    const pending = localStorage.getItem(STORAGE_KEY);
    if (!pending) return;
    try {
      const saved = JSON.parse(pending);
      localStorage.removeItem(STORAGE_KEY);
      setLeadData(saved.leadData);
      setMessages(saved.messages);
      setReadyToGenerate(true);
      setOpen(true);
      setTimeout(() => {
        doGenerate(saved.leadData);
      }, 800);
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [isSignedIn]);

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
      if (data.leadData) setLeadData((prev: any) => ({ ...prev, ...data.leadData }));
      if (data.readyToGenerate) setReadyToGenerate(true);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, something went wrong. Please try again!" }]);
    } finally {
      setLoading(false);
    }
  }

  // Redirects to plan page with params — plan page auto-fills and auto-submits
  async function doGenerate(lead: any) {
    setGenerating(true);
    setGenError('');
    try {
      const destRaw = lead.destination || '';
      const dateParts = (lead.dates || '').split(' to ');
      const startDate = dateParts[0]?.trim() || '';
      const endDate = dateParts[1]?.trim() || '';

      const params = new URLSearchParams({
        destination: destRaw,
        startDate,
        endDate,
        budget: lead.budget || 'Medium',
        interests: lead.interests || '',
      });

      setOpen(false);
      router.push('/dashboard/plan?' + params.toString());
    } catch {
      setGenError('Something went wrong. Please try again.');
      setGenerating(false);
    }
  }

  function handleGenerate() {
    if (isSignedIn) {
      doGenerate(leadData);
    } else {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ leadData, messages }));
      } catch (e) {}
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Almost there! 🎉\n\nJust sign in quickly and I'll instantly generate your full itinerary — no need to start over, your trip details are saved!"
      }]);
    }
  }

  const lastMessage = messages[messages.length - 1];
  const quickReplies = lastMessage?.role === 'assistant' && !loading ? getQuickReplies(lastMessage.content) : [];
  const showLoginPrompt = !isSignedIn && lastMessage?.content?.includes('Just sign in quickly');

  return (
    <>
      {/* Bubble */}
      <button onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full overflow-hidden shadow-xl shadow-violet-300 hover:scale-110 transition-transform border-2 border-white bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
        {open ? <X size={22} className="text-white" /> : <Sparkles size={22} className="text-white" />}
        {!open && <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] flex flex-col bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden" style={{maxHeight: '600px'}}>

          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-pink-600 p-4 flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-lg shrink-0">S</div>
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
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold mr-2 shrink-0 mt-1">S</div>
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
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold mr-2 shrink-0">S</div>
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
            {quickReplies.length > 0 && !showLoginPrompt && (
              <div className="flex flex-wrap gap-2 pl-9">
                {quickReplies.map((r, i) => (
                  <button key={i} onClick={() => sendMessage(r)}
                    className="bg-white border border-violet-200 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-violet-50 hover:border-violet-400 transition shadow-sm">
                    {r}
                  </button>
                ))}
              </div>
            )}

            {/* Login prompt */}
            {showLoginPrompt && (
              <div className="pl-9 flex flex-col gap-2">
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <button className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition shadow-lg shadow-violet-200">
                    <LogIn size={15} /> Sign In & Generate Itinerary ✨
                  </button>
                </SignInButton>
                <p className="text-center text-xs text-gray-400">Free to sign in · Your trip details are saved</p>
              </div>
            )}

            {/* Generate Button — signed in users */}
            {readyToGenerate && !loading && isSignedIn && !showLoginPrompt && (
              <div className="flex flex-col gap-2 pl-9">
                {genError && <p className="text-xs text-red-500 px-1">{genError}</p>}
                <button onClick={handleGenerate} disabled={generating}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition shadow-lg shadow-violet-200 disabled:opacity-60">
                  {generating ? (
                    <><span className="animate-spin inline-block">⏳</span> Opening plan page...</>
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
                <p className="text-center text-xs text-gray-400">🎁 First itinerary free · Pro plan from $3/mo</p>
              </div>
            )}

            {/* Generate button — not signed in, before login prompt */}
            {readyToGenerate && !loading && !isSignedIn && !showLoginPrompt && (
              <div className="flex flex-col gap-2 pl-9">
                <button onClick={handleGenerate}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition shadow-lg shadow-violet-200">
                  <Sparkles size={14} /> ✨ Generate My Full Itinerary
                </button>
                <p className="text-center text-xs text-gray-400">🎁 First itinerary free · Pro plan from $3/mo</p>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
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