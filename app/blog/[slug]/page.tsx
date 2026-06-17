import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, Sparkles, MapPin, Check, Plane, DollarSign, Sun, CloudRain, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FadeUp } from '@/components/motion/FadeUp';
import BlogNewsletterSignup from './BlogNewsletterSignup';

const blogPosts: Record<string, any> = {
  'best-time-to-visit-dubai': {
    title: 'Best Time to Visit Dubai — Complete Seasonal Guide',
    description: 'Discover the perfect time to visit Dubai for your dream vacation. Learn about weather patterns, peak seasons, and insider tips for the best experience.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200',
    date: '2026-01-15',
    readTime: '8 min read',
    author: 'TripMind AI',
    content: `
      <h2 class="text-2xl font-bold text-primary mb-4">Understanding Dubai's Climate</h2>
      <p class="text-muted-foreground mb-6">Dubai sits in the Arabian Desert and experiences one of the world's most extreme desert climates. Summers are brutally hot while winters are warm and pleasant. Knowing when to visit can make or break your Dubai experience — the difference between a magical trip and an uncomfortable one is often just a matter of timing.</p>

      <h2 class="text-2xl font-bold text-primary mb-4">Best Time to Visit Dubai: November to March</h2>
      <p class="text-muted-foreground mb-4">Without question, November through March is the best time to visit Dubai. Temperatures during this period range from 20°C to 30°C (68°F to 86°F) — warm enough for beach days but cool enough for outdoor sightseeing, desert safaris, and long walks along the Dubai Marina or Downtown.</p>
      <p class="text-muted-foreground mb-4">This is also when Dubai hosts its biggest events. The Dubai Shopping Festival runs from December to January, offering massive discounts across hundreds of malls and stores. The Dubai Food Festival in February is a must for food lovers. Hotel prices are at their highest during this peak season, so book at least 2-3 months in advance for the best rates.</p>
      <ul class="list-disc list-inside text-muted-foreground space-y-2 mb-6">
        <li><strong>November:</strong> Ideal weather begins, crowds manageable, prices still reasonable</li>
        <li><strong>December:</strong> Peak season starts, Christmas and New Year celebrations, very busy</li>
        <li><strong>January:</strong> Dubai Shopping Festival, best weather of the year</li>
        <li><strong>February:</strong> Dubai Food Festival, Valentine's Day packages, still excellent weather</li>
        <li><strong>March:</strong> Tail end of peak season, slightly warming up, good deals emerging</li>
      </ul>

      <h2 class="text-2xl font-bold text-primary mb-4">Shoulder Season: April and October</h2>
      <p class="text-muted-foreground mb-4">April and October are transition months — not peak season, not summer. Temperatures in April range from 25°C to 35°C and October sees similar conditions as the city cools down from summer. These months offer a sweet spot: fewer crowds, lower hotel prices, and still manageable weather especially in the mornings and evenings.</p>
      <p class="text-muted-foreground mb-6">If budget is your priority, visiting in April or October can save you 30-40% on hotels and flights compared to peak season while still giving you a great experience. Morning desert safaris and early sightseeing tours are perfectly comfortable during these months.</p>

      <h2 class="text-2xl font-bold text-primary mb-4">Summer Season: May to September</h2>
      <p class="text-muted-foreground mb-4">Dubai summers are extreme. Temperatures regularly hit 45°C (113°F) with high humidity making it feel even hotter. Outdoor activities are nearly impossible between 10am and 6pm. However, summer has its own advantages that many travelers overlook.</p>
      <p class="text-muted-foreground mb-4">Hotels slash prices by up to 50% during summer. The Dubai Summer Surprises festival offers incredible deals on shopping and dining. Every attraction, mall, and restaurant is fully air-conditioned. If you plan your itinerary around indoor activities — the Dubai Mall, Ski Dubai, aquariums, museums, and indoor theme parks — summer can actually be a great budget trip.</p>

      <h2 class="text-2xl font-bold text-primary mb-4">Dubai Month by Month Temperature Guide</h2>
      <ul class="list-disc list-inside text-muted-foreground space-y-2 mb-6">
        <li><strong>January:</strong> 18°C - 24°C — Perfect</li>
        <li><strong>February:</strong> 19°C - 26°C — Perfect</li>
        <li><strong>March:</strong> 22°C - 30°C — Excellent</li>
        <li><strong>April:</strong> 26°C - 35°C — Good (mornings only)</li>
        <li><strong>May:</strong> 30°C - 40°C — Hot, indoor focus</li>
        <li><strong>June:</strong> 33°C - 43°C — Very hot</li>
        <li><strong>July:</strong> 35°C - 45°C — Extreme</li>
        <li><strong>August:</strong> 35°C - 45°C — Extreme</li>
        <li><strong>September:</strong> 32°C - 42°C — Very hot</li>
        <li><strong>October:</strong> 28°C - 37°C — Warming up, manageable</li>
        <li><strong>November:</strong> 23°C - 32°C — Great</li>
        <li><strong>December:</strong> 19°C - 27°C — Perfect</li>
      </ul>

      <h2 class="text-2xl font-bold text-primary mb-4">Top Things to Do in Dubai by Season</h2>
      <h3 class="text-xl font-bold text-primary mb-3">Winter (Nov-Mar) Activities</h3>
      <ul class="list-disc list-inside text-muted-foreground space-y-2 mb-6">
        <li>Desert safari with overnight camping under the stars</li>
        <li>Burj Khalifa observation deck at sunset</li>
        <li>Dubai Creek and Gold Souk exploration</li>
        <li>Camel riding and dune bashing</li>
        <li>Beach days at Jumeirah Beach or Kite Beach</li>
        <li>Dubai Frame and Museum of the Future</li>
      </ul>

      <h3 class="text-xl font-bold text-primary mb-3">Summer (May-Sep) Activities</h3>
      <ul class="list-disc list-inside text-muted-foreground space-y-2 mb-6">
        <li>Dubai Mall and Dubai Aquarium</li>
        <li>Ski Dubai — actual skiing indoors</li>
        <li>IMG Worlds of Adventure indoor theme park</li>
        <li>Luxury spa days at discounted summer rates</li>
        <li>Fine dining and rooftop restaurants in the evening</li>
      </ul>

      <h2 class="text-2xl font-bold text-primary mb-4">Dubai Visa Information</h2>
      <p class="text-muted-foreground mb-4">Visa requirements depend on your nationality. Citizens of over 50 countries including the USA, UK, EU nations, and Australia get a free visa on arrival valid for 30-90 days. Pakistani, Indian, and many other nationalities need to apply in advance through an airline or registered travel agent. The UAE tourist visa typically costs $50-100 and takes 3-5 business days to process.</p>

      <h2 class="text-2xl font-bold text-primary mb-4">Budget Guide for Dubai</h2>
      <ul class="list-disc list-inside text-muted-foreground space-y-2 mb-6">
        <li><strong>Budget traveler:</strong> $80-120/day (hostels, street food, public transport)</li>
        <li><strong>Mid-range:</strong> $200-400/day (3-4 star hotels, restaurants, paid attractions)</li>
        <li><strong>Luxury:</strong> $500+/day (5 star hotels, fine dining, private tours)</li>
      </ul>
      <p class="text-muted-foreground mb-6">Dubai is expensive but manageable with planning. The metro is cheap and covers most tourist areas. Street food and mall food courts offer affordable meals. Many attractions like Dubai Fountain, Dubai Frame exterior, and beach access are completely free.</p>

      <h2 class="text-2xl font-bold text-primary mb-4">Final Verdict: When Should You Visit Dubai?</h2>
      <p class="text-muted-foreground mb-4">If budget is no concern — visit December or January for the absolute best experience. If you want value — October or November gives you great weather at lower prices. If you are on a tight budget — July or August with a fully indoor itinerary can be surprisingly good value.</p>
      <p class="text-muted-foreground mb-6">Whatever time you choose, Dubai delivers a world-class experience. From the world's tallest building to the world's largest mall to genuine desert adventures just 45 minutes from the city — Dubai earns its reputation as one of the most impressive destinations on earth.</p>
    `,
    tags: ['Dubai', 'Travel Tips', 'Weather'],
  },
  'paris-travel-guide': {
    title: 'Paris Travel Guide — Essential Tips for First-Time Visitors',
    description: 'Everything you need to know for your first trip to Paris. From the best attractions to local customs, this guide covers it all.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200',
    date: '2026-01-10',
    readTime: '10 min read',
    author: 'TripMind AI',
    content: `
      <h2 class="text-2xl font-bold text-primary mb-4">Getting Around Paris</h2>
      <p class="text-muted-foreground mb-6">Paris has an excellent public transportation system. The Métro is the most efficient way to navigate the city, with 16 lines covering all major attractions.</p>
      
      <h3 class="text-xl font-bold text-primary mb-3">Must-Visit Attractions</h3>
      <ul class="list-disc list-inside text-muted-foreground space-y-2 mb-6">
        <li>Eiffel Tower - Book tickets in advance to skip lines</li>
        <li>Louvre Museum - Dedicate at least half a day</li>
        <li>Notre-Dame Cathedral - Currently under restoration</li>
        <li>Montmartre - Best views of the city</li>
      </ul>
      
      <h2 class="text-2xl font-bold text-primary mb-4">Dining Like a Local</h2>
      <p class="text-muted-foreground mb-4">French cuisine is world-renowned. Try local bistros, visit neighborhood markets, and don't forget to enjoy café culture.</p>
    `,
    tags: ['Paris', 'Travel Guide', 'Europe'],
  },
  'tokyo-on-a-budget': {
    title: "Tokyo on a Budget — How to Explore Japan's Capital for Less",
    description: 'Discover how to experience Tokyo without breaking the bank. From free attractions to budget dining, this guide shows you how to save money.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200',
    date: '2026-01-05',
    readTime: '12 min read',
    author: 'TripMind AI',
    content: `
      <h2 class="text-2xl font-bold text-primary mb-4">Free Attractions in Tokyo</h2>
      <p class="text-muted-foreground mb-6">Tokyo offers many free experiences that are just as impressive as paid attractions. From temples to parks, you can explore the city without spending much.</p>
      
      <h3 class="text-xl font-bold text-primary mb-3">Budget-Friendly Dining</h3>
      <p class="text-muted-foreground mb-4">Japanese cuisine can be affordable if you know where to look. Convenience stores, ramen shops, and street food offer delicious meals at low prices.</p>
      
      <h2 class="text-2xl font-bold text-primary mb-4">Transportation Tips</h2>
      <p class="text-muted-foreground mb-4">Get a JR Pass for unlimited travel on JR lines. Consider day passes for specific areas. Walking is also a great way to explore neighborhoods.</p>
    `,
    tags: ['Tokyo', 'Budget Travel', 'Japan'],
  },
  'bali-itinerary-7-days': {
    title: '7-Day Bali Itinerary — The Perfect Week in Paradise',
    description: 'Plan your perfect 7-day Bali adventure with this comprehensive itinerary. From beaches to temples, experience the best of the Island of Gods.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200',
    date: '2026-01-20',
    readTime: '15 min read',
    author: 'TripMind AI',
    content: `
      <h2 class="text-2xl font-bold text-primary mb-4">Day 1-2: Ubud - Cultural Heart</h2>
      <p class="text-muted-foreground mb-6">Start your journey in Ubud, the cultural capital of Bali. Visit rice terraces, temples, and experience traditional arts.</p>
      
      <h3 class="text-xl font-bold text-primary mb-3">Day 3-4: Seminyak and Canggu - Beach Life</h3>
      <p class="text-muted-foreground mb-4">Move to the coast for beach clubs, surfing, and stunning sunsets. Enjoy the vibrant nightlife and excellent dining scene.</p>
      
      <h2 class="text-2xl font-bold text-primary mb-4">Day 5-7: Nusa Penida - Adventure</h2>
      <p class="text-muted-foreground mb-4">Take a boat to Nusa Penida for dramatic cliffs, pristine beaches, and incredible snorkeling spots. Perfect for adventure seekers.</p>
    `,
    tags: ['Bali', 'Itinerary', 'Indonesia'],
  },
  'london-hidden-gems': {
    title: "London Hidden Gems — Beyond the Tourist Trail",
    description: "Discover London's secret spots and lesser-known attractions. Escape the crowds and explore the authentic side of England's capital.",
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200',
    date: '2026-01-25',
    readTime: '9 min read',
    author: 'TripMind AI',
    content: `
      <h2 class="text-2xl font-bold text-primary mb-4">Secret Gardens and Parks</h2>
      <p class="text-muted-foreground mb-6">Beyond Hyde Park, London has many hidden green spaces. Discover secret gardens tucked away in the city.</p>
      
      <h3 class="text-xl font-bold text-primary mb-3">Off-the-Beaten-Path Museums</h3>
      <p class="text-muted-foreground mb-4">Skip the British Museum crowds and explore smaller, specialized museums that offer unique experiences.</p>
      
      <h2 class="text-2xl font-bold text-primary mb-4">Neighborhood Exploration</h2>
      <p class="text-muted-foreground mb-4">Each London neighborhood has its own character. Explore Shoreditch, Greenwich, and Camden for authentic local experiences.</p>
    `,
    tags: ['London', 'Hidden Gems', 'UK'],
  },
  'new-york-first-time': {
    title: 'New York for First-Timers — Essential NYC Travel Guide',
    description: 'Planning your first trip to New York City? This guide covers everything you need to know, from transportation to must-see attractions.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1200',
    date: '2026-02-01',
    readTime: '11 min read',
    author: 'TripMind AI',
    content: `
      <h2 class="text-2xl font-bold text-primary mb-4">Getting Around NYC</h2>
      <p class="text-muted-foreground mb-6">The subway is the most efficient way to navigate New York. Consider a MetroCard for unlimited rides. Walking is also a great way to explore.</p>
      
      <h3 class="text-xl font-bold text-primary mb-3">Must-See Attractions</h3>
      <ul class="list-disc list-inside text-muted-foreground space-y-2 mb-6">
        <li>Statue of Liberty and Ellis Island</li>
        <li>Central Park - Rent a bike or take a walk</li>
        <li>Times Square - Experience the energy</li>
        <li>Brooklyn Bridge - Walk across for views</li>
      </ul>
      
      <h2 class="text-2xl font-bold text-primary mb-4">Dining Recommendations</h2>
      <p class="text-muted-foreground mb-4">From street food to fine dining, NYC has it all. Try pizza, bagels, and diverse ethnic cuisines throughout the city.</p>
    `,
    tags: ['New York', 'Travel Guide', 'USA'],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];
  if (!post) {
    return {
      title: 'Blog Post Not Found - TripMind AI',
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.image],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Blog Post Not Found</h1>
          <Link href="/blog">
            <Button variant="accent">Return to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-[50vh] overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          width={1200}
          height={630}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/30" />
        <div className="absolute inset-0 flex items-end p-8 lg:p-16">
          <div className="max-w-4xl">
            <FadeUp>
              <Badge variant="info" className="mb-4">Travel Guide</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
              <div className="flex items-center gap-4 text-white/80">
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  {post.readTime}
                </span>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-16 px-4 lg:px-8 max-w-4xl mx-auto">
        <FadeUp delay={0.2}>
          <div className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="flex flex-wrap gap-2 mb-12">
            {post.tags.map((tag: string) => (
              <Badge key={tag} variant="info">{tag}</Badge>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.35}>
          <BlogNewsletterSignup />
        </FadeUp>

        <FadeUp delay={0.4}>
          <Card variant="elevated" className="p-8 bg-accent text-white text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Plan Your Trip with AI</h2>
            <p className="text-white/80 mb-6">
              Let our AI create a personalized itinerary based on this travel guide and your preferences.
            </p>
            <Link href="/sign-in">
              <Button variant="secondary" size="lg" className="bg-white text-accent hover:bg-surface">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Planning with AI
              </Button>
            </Link>
          </Card>
        </FadeUp>
      </article>
    </div>
  );
}