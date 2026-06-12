import { z } from "zod";

export const agentBodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().max(10_000),
      })
    )
    .min(1)
    .max(100),
  leadData: z
    .object({
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      destination: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      dates: z.string().optional(),
      travelers: z.string().optional(),
      budget: z.string().optional(),
      interests: z.union([z.string(), z.array(z.string())]).optional(),
    })
    .optional()
    .default({}),
  conversationId: z.string().optional(),
});

export const checkoutBodySchema = z.object({
  email: z.string().email(),
});

export const tripIdQuerySchema = z.object({
  id: z.string().min(1),
});

export const photoQuerySchema = z.object({
  query: z.string().min(1).max(200),
});

export const generateItineraryBodySchema = z.object({
  destination: z.string().min(1).max(200),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  budget: z.string().optional(),
  interests: z.string().optional(),
});

export const itineraryBodySchema = z.object({
  destination: z.string().min(1).max(200),
  country: z.string().optional(),
  cities: z.array(z.string()).optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  budget: z.string().optional(),
  interests: z.string().optional(),
});

export const saveLeadBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  destination: z.string().optional(),
  dates: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  travelers: z.string().optional(),
  budget: z.string().optional(),
  interests: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  source: z.string().optional(),
});

export const saveTripBodySchema = z.object({
  destination: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  budget: z.union([z.string(), z.number()]),
  interests: z.unknown(),
  itinerary: z.unknown(),
});
