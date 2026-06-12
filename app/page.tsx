"use client";

import ChatAgent from '@/components/ChatAgent';
import { useState, useEffect } from "react";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, Mail, MapPin, Brain, MessageCircle, FileText, Globe, Shield, Plane, Zap, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FadeUp } from "@/components/motion/FadeUp";
import { PageTransition } from "@/components/motion/PageTransition";
import { HoverCard } from "@/components/motion/HoverCard";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TripMind AI",
  url: "https://tripmind-ai-kappa.vercel.app",
  description: "AI-powered travel planning. Get personalized itineraries in under 30 seconds.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://tripmind-ai-kappa.vercel.app/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TripMind AI",
  url: "https://tripmind-ai-kappa.vercel.app",
  logo: "https://tripmind-ai-kappa.vercel.app/logo.png",
  description: "AI-powered travel planning platform that creates personalized itineraries in seconds.",
  sameAs: [
    "https://twitter.com/tripmindai",
    "https://github.com/haiderr816-ctrl/tripmind-ai"
  ]
};

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setLeadSubmitted(true);
      setEmail('');
    } catch (error) {
      console.error('Error submitting lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent rounded-xl flex items-center justify-center shadow-md shadow-accent/20">
                  <Sparkles size={16} className="text-white" />
                </div>
                <span className="text-xl font-bold text-primary">
                  TripMind AI
                </span>
              </Link>
              <div className="hidden md:flex gap-6">
                <a href="#features" className="text-muted-foreground hover:text-primary transition font-medium text-sm">Features</a>
                <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition font-medium text-sm">How It Works</a>
                <Link href="/pricing" className="text-muted-foreground hover:text-primary transition font-medium text-sm">Pricing</Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </SignInButton>
                  <SignInButton mode="modal">
                    <Button variant="primary" size="sm">Start Free</Button>
                  </SignInButton>
                </>
              ) : (
                <Link href="/dashboard">
                  <Button variant="primary" size="sm">Dashboard</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO Section */}
      <PageTransition>
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-surface to-primary">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20 pb-32">
            <Badge variant="pro" className="mb-6">
              <Sparkles size={12} className="mr-2" />
              AI-Powered Travel Planning
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold text-primary-foreground mb-6 leading-tight">
              Plan Your Perfect Trip<br />
              with <span className="text-accent">AI</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              TripMind AI creates fully personalized itineraries, finds the best deals, and manages your entire journey — all powered by AI.
            </p>

            <Card variant="glass" className="max-w-3xl mx-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Where to?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                />
              </div>
              <Button
                variant="accent"
                size="lg"
                className="w-full"
                onClick={() => {
                  if (isSignedIn) router.push(`/dashboard/plan?destination=${encodeURIComponent(destination)}&startDate=${startDate}&endDate=${endDate}`);
                  else router.push("/sign-in");
                }}
              >
                <Sparkles size={18} className="mr-2" />
                Plan My Trip with AI
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">Free to start · No credit card required</p>
            </Card>
          </div>
        </section>
      </PageTransition>

      {/* FEATURES GRID */}
      <section id="features" className="py-24 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="info" className="mb-4">Features</Badge>
            <h2 className="text-4xl font-bold text-primary mb-4">Everything You Need to Travel Smarter</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              TripMind AI combines artificial intelligence with real travel data to give you the most personalized experience possible.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: "AI Itinerary", desc: "Tell us your destination, dates, and budget. Our AI generates a detailed day-by-day plan in under 30 seconds." },
              { icon: MessageCircle, title: "Smart Budget", desc: "AI Travel Manager Sarah understands your preferences and creates a fully custom trip plan within your budget." },
              { icon: Globe, title: "Local Insights", desc: "Explore 120+ destinations worldwide with curated guides, popular activities, and local food recommendations." },
              { icon: FileText, title: "PDF Export", desc: "Download your complete travel itinerary as a beautifully formatted PDF to share or keep offline." },
              { icon: Plane, title: "Instant Booking", desc: "Get real-time comparisons for flights and hotels within your budget — no more jumping between sites." },
              { icon: Shield, title: "Secure & Private", desc: "Your travel plans and personal information are fully encrypted and private. We never sell your data." },
            ].map((feature, index) => (
              <FadeUp key={feature.title} delay={index * 0.1}>
                <Card variant="glass" className="p-6 hover:shadow-lg transition cursor-pointer">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon size={24} className="text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </Card>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS SECTION */}
      <section className="py-24 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="info" className="mb-4">Destinations</Badge>
            <h2 className="text-4xl font-bold text-primary-foreground mb-4">Popular Destinations</h2>
            <p className="text-muted-foreground">Handpicked by our AI for unforgettable experiences</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Dubai, UAE", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2670", price: "From $599", tag: "Luxury" },
              { name: "Paris, France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2673", price: "From $499", tag: "Romance" },
              { name: "Tokyo, Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2670", price: "From $799", tag: "Culture" },
              { name: "Bali, Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2670", price: "From $599", tag: "Beach" },
              { name: "London, UK", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2670", price: "From $699", tag: "History" },
              { name: "New York, USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2670", price: "From $399", tag: "City Life" },
            ].map((place) => (
              <HoverCard key={place.name} variant="default" className="overflow-hidden group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={place.image}
                    alt={place.name}
                    width={2670}
                    height={1600}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <Badge variant="pro" className="absolute top-3 left-3">{place.tag}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-primary mb-1">{place.name}</h3>
                  <p className="text-muted-foreground text-sm">{place.price}</p>
                </CardContent>
              </HoverCard>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="info" className="mb-4">Process</Badge>
            <h2 className="text-4xl font-bold text-primary mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Plan a trip in 3 easy steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: "01", title: "Enter Your Details", desc: "Tell TripMind AI where you want to go, your travel dates, budget, and interests. Takes less than 60 seconds.", icon: MapPin },
              { step: "02", title: "AI Creates Your Plan", desc: "Our AI analyzes thousands of data points and generates a personalized day-by-day itinerary tailored to your preferences.", icon: Brain },
              { step: "03", title: "Download & Go", desc: "Download your PDF itinerary, book with confidence, and enjoy your trip. Sarah is always on standby to help.", icon: Plane },
            ].map((item, i) => (
              <div key={item.step} className="text-center relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] right-[-calc(50%-40px)] h-0.5 bg-gradient-to-r from-accent/20 to-accent/20 w-full" />
                )}
                <div className="w-16 h-16 bg-accent text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-5 shadow-lg shadow-accent/30">
                  {item.step}
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon size={24} className="text-accent" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD CAPTURE SECTION */}
      <section className="py-24 px-4 bg-surface">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="pro" className="mb-4">Free Consultation</Badge>
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">Get a Free Travel Consultation</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Enter your email and our AI will send you personalized travel recommendations.
          </p>
          {leadSubmitted ? (
            <Card variant="glass" className="p-8">
              <Check size={48} className="text-success mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Thank You!</h3>
              <p className="text-muted-foreground">We'll send you personalized travel recommendations soon.</p>
            </Card>
          ) : (
            <form onSubmit={handleSubmitLead} className="max-w-md mx-auto">
              <Input
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button variant="accent" size="lg" className="w-full mt-4" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send size={18} className="mr-2" />
                    Get Free Consultation
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-4xl mx-auto text-center mb-14">
          <Badge variant="info" className="mb-4">Pricing</Badge>
          <h2 className="text-4xl font-bold text-primary mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-lg">Start free. Upgrade when you're ready.</p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card variant="default" className="p-8">
            <CardHeader>
              <CardTitle>Free Plan</CardTitle>
              <CardDescription>Perfect to get started</CardDescription>
            </CardHeader>
            <div className="text-5xl font-bold text-primary mb-6">$0<span className="text-lg text-muted-foreground font-normal">/month</span></div>
            <ul className="space-y-3 mb-8">
              {["2 AI itineraries per month", "Basic trip planning", "PDF export", "Save & view trips"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-muted-foreground text-sm">
                  <Check size={16} className="text-success" />
                  {f}
                </li>
              ))}
            </ul>
            <SignInButton mode="modal">
              <Button variant="secondary" className="w-full">Get Started Free</Button>
            </SignInButton>
          </Card>
          <Card variant="elevated" className="p-8 relative border-2 border-accent">
            <Badge variant="pro" className="absolute -top-3 left-1/2 -translate-x-1/2">MOST POPULAR</Badge>
            <CardHeader>
              <CardTitle>Pro Plan</CardTitle>
              <CardDescription>For serious travelers</CardDescription>
            </CardHeader>
            <div className="text-5xl font-bold text-primary mb-6">$3<span className="text-lg text-muted-foreground font-normal">/month</span></div>
            <ul className="space-y-3 mb-8">
              {["Unlimited AI itineraries", "AI Travel Manager Sarah", "PDF export with branding", "Hotel & flight comparisons", "Priority support", "Cancel anytime"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-muted-foreground text-sm">
                  <Check size={16} className="text-success" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/pricing">
              <Button variant="accent" className="w-full">
                <Zap size={16} className="mr-2" />
                Start Pro — $3/month
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-primary text-muted-foreground py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-xl flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-primary-foreground text-xl font-bold">TripMind AI</span>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Your AI-powered travel companion. We create personalized itineraries, find the best deals, and help you travel smarter — all in seconds.
            </p>
          </div>
          <div>
            <h4 className="text-primary-foreground font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary-foreground transition">About Us</Link></li>
              <li><Link href="/pricing" className="hover:text-primary-foreground transition">Pricing</Link></li>
              <li><Link href="/blog" className="hover:text-primary-foreground transition">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-primary-foreground font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-primary-foreground transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary-foreground transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6 text-center text-sm">
          © 2026 TripMind AI. All rights reserved. Built with AI. ✨
        </div>
      </footer>
      <ChatAgent />
    </div>
  );
}
