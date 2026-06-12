import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";
import { parseJsonBody } from "@/lib/validate";
import { agentBodySchema } from "@/lib/schemas/api";
import { applyRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { auth } from "@clerk/nextjs/server";
import { recordUsage } from "@/lib/db/usage";
import {
  addMessage,
  createConversation,
  getConversation,
} from "@/lib/db/conversation";
import { UsageAction } from "@prisma/client";

const SYSTEM_PROMPT = `You are Sarah, a friendly Personal Travel Manager at TripMind AI with 10+ years of experience.

PERSONALITY: Warm, enthusiastic, genuine. Natural reactions like "Oh lovely!", "Great choice!"

CONVERSATION FLOW (ONE question at a time, in this exact order):
1. Ask destination country
2. Ask which cities (up to 4). Example: "Which cities in Japan? Tokyo, Osaka, Kyoto? Pick multiple!"
3. Ask exact travel dates: "When are you thinking? Like July 10 to August 10?"
4. Ask travelers: "Flying solo or bringing someone special?"
5. Ask travel style: "luxury-and-relax or adventure-and-explore type?"
6. Ask interests: "What excites you most - food, history, beaches, nightlife?"
7. Ask budget per person
8. Ask if first time visiting
9. Ask hotel preference: "Preferred hotel style - 3-star, 4-star, or 5-star?"
10. Ask email: "I'd love to send your itinerary. What's your email?"
11. Ask phone (optional)
12. Show summary and READY_TO_GENERATE

STRICT RULES:
- ONE question per message, SHORT replies (2-3 lines max)
- Always get exact start date if only duration given
- Cities stored as: "City1, City2, Country" e.g. "Dubai, Abu Dhabi, Saudi Arabia"

WHEN ALL INFO COLLECTED, say EXACTLY this format:
"Here is what I have put together for you:

Destination: [cities, country]
Dates: [start date] to [end date]
Travelers: [type]
Budget: [budget]
Interests: [interests]
Itinerary will be sent to: [email]

This is going to be an incredible trip. Ready for me to generate your complete day-by-day plan with hotels, flights and activities?"

Then on a new line add: READY_TO_GENERATE

LEAD EXTRACTION - CRITICAL:
At the END of EVERY single response, append this on a new line:
LEAD_DATA:{"name":"","email":"","phone":"","destination":"","startDate":"","endDate":"","travelers":"","budget":"","interests":""}

Rules for LEAD_DATA:
- Fill ALL fields you know so far from the ENTIRE conversation, not just this message
- destination format: "City1, City2, Country"
- startDate: just the start date like "July 10"
- endDate: just the end date like "August 10"
- budget: use the raw value like "$1000-3000"
- Only leave empty string for fields truly not yet collected
- NEVER skip this line`;

export async function POST(req: NextRequest) {
  const rateLimitResponse = applyRateLimit(req, "agent", RATE_LIMITS.agent);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { messages, leadData, conversationId: incomingConversationId } =
      await parseJsonBody(req, agentBodySchema);

    const { userId } = await auth();

    let conversationId = incomingConversationId;
    if (conversationId) {
      const existing = await getConversation(conversationId);
      if (!existing) {
        conversationId = undefined;
      }
    }
    if (!conversationId) {
      const conversation = await createConversation(userId ?? undefined);
      conversationId = conversation.id;
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "user") {
      try {
        await addMessage(conversationId, lastMessage.role, lastMessage.content);
      } catch (e) {
        console.error("Save user message failed:", e);
      }
    }

    // Check if API key is set
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set in environment variables");
      return NextResponse.json(
        {
          reply: "Sorry, the AI service is not configured properly. Please contact support.",
          leadData: {},
          readyToGenerate: false,
        },
        { status: 500 }
      );
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    // Check if the request was successful
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Groq API error:", {
        status: res.status,
        statusText: res.statusText,
        error: errorText,
      });
      return NextResponse.json(
        {
          reply: "Sorry, I'm having trouble connecting right now. Please try again.",
          leadData: {},
          readyToGenerate: false,
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    let reply =
      data.choices?.[0]?.message?.content || "Sorry, could you repeat that?";

    let extractedLead: Record<string, string> = {};
    const leadMatch = reply.match(/LEAD_DATA:(\{[^}]+\})/);
    if (leadMatch) {
      try {
        extractedLead = JSON.parse(leadMatch[1]);
      } catch {
        extractedLead = {};
      }
      reply = reply.replace(/\nLEAD_DATA:\{[^}]+\}/, "").trim();
    }

    const readyToGenerate = reply.includes("READY_TO_GENERATE");
    reply = reply.replace("READY_TO_GENERATE", "").trim();

    const mergedLead: Record<string, string> = { ...leadData };
    for (const [k, v] of Object.entries(extractedLead)) {
      if (v && v !== "") mergedLead[k] = v;
    }

    if (userId) {
      try {
        await recordUsage(userId, UsageAction.AGENT_MESSAGE);
      } catch (e) {
        console.error("Record agent usage failed:", e);
      }
    }

    try {
      await addMessage(conversationId, "assistant", reply);
    } catch (e) {
      console.error("Save assistant message failed:", e);
    }

    if (mergedLead.email) {
      try {
        const resolvedDates =
          mergedLead.dates ||
          (mergedLead.startDate && mergedLead.endDate
            ? `${mergedLead.startDate} to ${mergedLead.endDate}`
            : mergedLead.startDate || "");
        const lead = await prisma.lead.upsert({
          where: { email: mergedLead.email },
          update: {
            name: mergedLead.name || undefined,
            phone: mergedLead.phone || undefined,
            destination: mergedLead.destination || undefined,
            dates: resolvedDates || undefined,
            travelers: mergedLead.travelers || undefined,
            budget: mergedLead.budget || undefined,
            interests: mergedLead.interests || undefined,
            updatedAt: new Date(),
          },
          create: {
            email: mergedLead.email,
            name: mergedLead.name || "",
            phone: mergedLead.phone || "",
            destination: mergedLead.destination || "",
            dates: resolvedDates || "",
            travelers: mergedLead.travelers || "",
            budget: mergedLead.budget || "",
            interests: mergedLead.interests || "",
          },
        });
        try {
          await prisma.conversation.update({
            where: { id: conversationId },
            data: {
              leadId: lead.id,
              ...(userId ? { userId } : {}),
            },
          });
        } catch (e) {
          console.error("Link lead to conversation failed:", e);
        }
      } catch (e) {
        console.error("Save lead failed:", e);
      }
    }

    return NextResponse.json({
      reply,
      leadData: mergedLead,
      readyToGenerate,
      conversationId,
    });
  } catch (error) {
    console.error("Agent error:", error);
    if (error instanceof ZodError) {
      return handleApiError(error);
    }
    return NextResponse.json(
      {
        reply: "Sorry about that! Could you repeat what you said?",
        leadData: {},
        readyToGenerate: false,
      },
      { status: 500 }
    );
  }
}
