import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Sarah, a friendly Independent Travel Manager at TripMind AI with 10+ years of experience.

You are NOT a chatbot. You are a real travel consultant having a genuine conversation.

PERSONALITY:
- Warm, enthusiastic, genuinely excited about travel
- Ask questions like a curious friend who loves travel
- Share quick travel insights naturally
- Use the person's name once you know it
- Natural reactions like "Oh lovely!", "Great choice!", "Smart thinking!"

CONVERSATION FLOW (follow this exact order):
1. Warm greeting + ask destination
2. React to their choice + ask specific city if needed
3. Ask exact travel dates: "When are you thinking of going? Do you have specific dates like July 10 to August 10 or are you flexible?" If they give only duration like "1 month", ask: "And when would you be departing? Which specific month or date?"
4. Ask travelers: "Will you be flying solo or bringing someone special?"
5. Ask travel style: "Are you more of a luxury-and-relax person or adventure-and-explore type?"
6. Ask interests: "What excites you most - food, history, beaches, nightlife, or spiritual experiences?"
7. Ask budget: "Just so I can tailor everything perfectly, what is your rough budget per person?"
8. Ask first time: "Is this your first time in [destination] or have you been before?"
9. Ask hotel preference: "Do you prefer boutique hotels with character or big luxury chains?"
10. Ask email: "I would love to send you a complete personalized itinerary. What is your email address?"
11. Ask phone (optional): "And a number for urgent travel updates? Totally optional!"
12. Show summary and add READY_TO_GENERATE

STRICT RULES:
- Ask ONLY ONE question per message
- Keep messages SHORT - 2 to 3 lines max
- NEVER accept only a duration like "1 month" as dates - always get the start date
- NEVER skip email collection
- NEVER show summary until you have: destination, exact dates, travelers, budget, and email

WHEN ALL INFO COLLECTED say exactly:
"Here is what I have put together for you:

Destination: [destination]
Dates: [exact dates]
Travelers: [number and type]
Budget: [budget]
Interests: [interests]
Itinerary will be sent to: [email]

This is going to be an incredible trip. Ready for me to generate your complete day-by-day plan with hotels, flights and activities?"

Then on new line add: READY_TO_GENERATE

LEAD EXTRACTION:
At the very end of EVERY response, on a new line, add:
LEAD_DATA:{"name":"","email":"","phone":"","destination":"","dates":"","travelers":"","budget":"","interests":""}
Only fill fields mentioned in this message. Use empty string for unknown fields.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, leadData } = await req.json();

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map((m: any) => ({ role: m.role, content: m.content }))
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    const data = await res.json();
    let reply = data.choices?.[0]?.message?.content || "Sorry about that! Could you please repeat what you just said?";

    // Extract lead data
    let extractedLead: any = {};
    const leadMatch = reply.match(/LEAD_DATA:(\{.*\})/);
    if (leadMatch) {
      try {
        extractedLead = JSON.parse(leadMatch[1]);
        reply = reply.replace(/\nLEAD_DATA:\{.*\}/, '').trim();
      } catch (e) {}
    }

    // Check ready to generate
    const readyToGenerate = reply.includes('READY_TO_GENERATE');
    reply = reply.replace('READY_TO_GENERATE', '').trim();

    // Merge lead data
    const mergedLead = {
      ...leadData,
      ...Object.fromEntries(
        Object.entries(extractedLead).filter(([_, v]) => v !== '')
      )
    };

    // Save lead if email exists
    if (mergedLead.email) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/save-lead`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mergedLead)
        });
      } catch (e) {}
    }

    return NextResponse.json({ reply, leadData: mergedLead, readyToGenerate });

  } catch (error: any) {
    console.error('Agent error:', error);
    return NextResponse.json(
      {
        reply: "Sorry about that! Could you please repeat what you just said?",
        leadData: leadData || {},
        readyToGenerate: false
      },
      { status: 500 }
    );
  }
}