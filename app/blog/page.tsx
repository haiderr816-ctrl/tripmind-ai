import Link from "next/link";
import { ArrowRight, Calendar, Clock, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion/FadeUp";
import { HoverCard } from "@/components/motion/HoverCard";

const posts = [
  {
    slug: 'best-time-to-visit-dubai',
    title: 'Best Time to Visit Dubai — Complete Seasonal Guide',
    description: 'Discover the perfect time to visit Dubai for your dream vacation. Learn about weather patterns, peak seasons, and insider tips.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200',
    date: '2024-01-15',
    readTime: '8 min read',
    tags: ['Dubai', 'Travel Tips'],
  },
  {
    slug: 'paris-travel-guide',
    title: 'Paris Travel Guide — Essential Tips for First-Time Visitors',
    description: 'Everything you need to know for your first trip to Paris. From the best attractions to local customs, this guide covers it all.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200',
    date: '2024-01-10',
    readTime: '10 min read',
    tags: ['Paris', 'Travel Guide'],
  },
  {
    slug: 'tokyo-on-a-budget',
    title: 'Tokyo on a Budget — How to Explore Japan\'s Capital for Less',
    description: 'Discover how to experience Tokyo without breaking the bank. From free attractions to budget dining, this guide shows you how to save money.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200',
    date: '2024-01-05',
    readTime: '12 min read',
    tags: ['Tokyo', 'Budget Travel'],
  },
  {
    slug: 'bali-itinerary-7-days',
    title: '7-Day Bali Itinerary — The Perfect Week in Paradise',
    description: 'Plan your perfect 7-day Bali adventure with this comprehensive itinerary. From beaches to temples, experience the best of the Island of Gods.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200',
    date: '2023-12-28',
    readTime: '15 min read',
    tags: ['Bali', 'Itinerary'],
  },
  {
    slug: 'london-hidden-gems',
    title: 'London Hidden Gems — Beyond the Tourist Trail',
    description: 'Discover London\'s secret spots and lesser-known attractions. Escape the crowds and explore the authentic side of England\'s capital.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200',
    date: '2023-12-20',
    readTime: '9 min read',
    tags: ['London', 'Hidden Gems'],
  },
  {
    slug: 'new-york-first-time',
    title: 'New York for First-Timers — Essential NYC Travel Guide',
    description: 'Planning your first trip to New York City? This guide covers everything you need to know, from transportation to must-see attractions.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1200',
    date: '2023-12-15',
    readTime: '11 min read',
    tags: ['New York', 'Travel Guide'],
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-accent to-accent/70 py-20 px-4 text-center text-white">
        <FadeUp>
          <Badge variant="pro" className="mb-4">Blog</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Travel Tips & Stories</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Insights, guides, and inspiration for every traveler</p>
        </FadeUp>
      </section>

      {/* Posts Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <FadeUp key={post.slug} delay={index * 0.05}>
              <Link href={`/blog/${post.slug}`}>
                <HoverCard variant="default" className="overflow-hidden group cursor-pointer h-full">
                  <div className="relative overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{post.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="info" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-accent font-medium group-hover:gap-2 transition-all">
                      Read Article <ArrowRight size={14} />
                    </div>
                  </CardContent>
                </HoverCard>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <FadeUp>
          <Card variant="elevated" className="p-8 bg-accent text-white text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Plan Your Trip with AI</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Read our travel guides and let our AI create a personalized itinerary based on your preferences.
            </p>
            <Link href="/sign-in">
              <Button variant="secondary" size="lg" className="bg-white text-accent hover:bg-surface">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Planning with AI
              </Button>
            </Link>
          </Card>
        </FadeUp>
      </section>
    </div>
  );
}