import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ArrowRight, Calendar, MapPin, Plane, Check, Sun, CloudRain, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FadeUp } from '@/components/motion/FadeUp';

const destinations: Record<string, any> = {
  'dubai': {
    name: 'Dubai, UAE',
    title: 'Dubai Travel Guide — Luxury & Adventure',
    description: 'Discover Dubai\'s stunning skyline, desert adventures, and world-class shopping. Complete travel guide with best time to visit, top attractions, and insider tips.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2670',
    highlights: [
      'Burj Khalifa - World\'s tallest building',
      'Palm Jumeirah - Man-made island paradise',
      'Dubai Mall - World\'s largest shopping center',
      'Desert Safari - Dune bashing & camel rides',
      'Dubai Marina - Stunning waterfront dining',
    ],
    bestTime: 'November to March',
    weather: 'Hot summers, pleasant winters',
    budget: 'From $599',
    readTime: '8 min',
  },
  'paris': {
    name: 'Paris, France',
    title: 'Paris Travel Guide — City of Lights & Romance',
    description: 'Experience the magic of Paris with our comprehensive travel guide. From the Eiffel Tower to hidden cafes, discover everything the City of Lights has to offer.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2673',
    highlights: [
      'Eiffel Tower - Iconic iron lady',
      'Louvre Museum - World\'s largest art museum',
      'Montmartre - Artistic hilltop district',
      'Seine River Cruise - Romantic boat tours',
      'Champs-Élysées - Famous shopping avenue',
    ],
    bestTime: 'April to June, September to October',
    weather: 'Mild summers, cool winters',
    budget: 'From $499',
    readTime: '7 min',
  },
  'tokyo': {
    name: 'Tokyo, Japan',
    title: 'Tokyo Travel Guide — Tradition Meets Innovation',
    description: 'Explore Tokyo\'s unique blend of ancient temples and cutting-edge technology. Your complete guide to Japan\'s vibrant capital city.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2670',
    highlights: [
      'Senso-ji Temple - Tokyo\'s oldest temple',
      'Shibuya Crossing - World\'s busiest crossing',
      'Akihabara - Electronics & anime district',
      'Tsukiji Market - Fresh seafood paradise',
      'Meiji Shrine - Serene forest sanctuary',
    ],
    bestTime: 'March to May, October to November',
    weather: 'Four distinct seasons',
    budget: 'From $799',
    readTime: '9 min',
  },
  'bali': {
    name: 'Bali, Indonesia',
    title: 'Bali Travel Guide — Island of Gods',
    description: 'Escape to Bali\'s pristine beaches, lush rice terraces, and spiritual temples. Complete travel guide for your tropical paradise adventure.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2670',
    highlights: [
      'Ubud - Cultural heart of Bali',
      'Tanah Lot - Sea temple sunset views',
      'Rice Terraces - Tegallalang landscapes',
      'Beach Clubs - Seminyak nightlife',
      'Water Temples - Sacred purification sites',
    ],
    bestTime: 'April to October',
    weather: 'Tropical, warm year-round',
    budget: 'From $599',
    readTime: '6 min',
  },
  'london': {
    name: 'London, UK',
    title: 'London Travel Guide — History & Modern Culture',
    description: 'Discover London\'s rich history, royal palaces, and vibrant culture. Your ultimate guide to exploring England\'s magnificent capital.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2670',
    highlights: [
      'Big Ben & Parliament - Iconic landmarks',
      'Tower of London - Historic fortress',
      'British Museum - World heritage treasures',
      'Buckingham Palace - Royal residence',
      'West End - World-class theater district',
    ],
    bestTime: 'May to September',
    weather: 'Mild summers, rainy winters',
    budget: 'From $699',
    readTime: '8 min',
  },
  'new-york': {
    name: 'New York, USA',
    title: 'New York Travel Guide — The City That Never Sleeps',
    description: 'Experience the energy of New York City. From Times Square to Central Park, your complete guide to the Big Apple\'s iconic attractions.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2670',
    highlights: [
      'Statue of Liberty - Symbol of freedom',
      'Central Park - Urban oasis',
      'Times Square - Bright lights, big city',
      'Empire State Building - Art deco icon',
      'Brooklyn Bridge - Historic landmark',
    ],
    bestTime: 'April to June, September to November',
    weather: 'Four distinct seasons',
    budget: 'From $399',
    readTime: '7 min',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const destination = destinations[slug];
  if (!destination) {
    return {
      title: 'Destination Not Found - TripMind AI',
    };
  }

  return {
    title: destination.title,
    description: destination.description,
    openGraph: {
      title: destination.title,
      description: destination.description,
      images: [destination.image],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: destination.title,
      description: destination.description,
      images: [destination.image],
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(destinations).map((slug) => ({ slug }));
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = destinations[slug];

  if (!destination) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Destination Not Found</h1>
          <Link href="/">
            <Button variant="accent">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/30" />
        <div className="absolute inset-0 flex items-end p-8 lg:p-16">
          <div className="max-w-4xl">
            <FadeUp>
              <Badge variant="pro" className="mb-4">Destination Guide</Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{destination.name}</h1>
              <p className="text-lg text-white/80 max-w-2xl">{destination.description}</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <FadeUp delay={0}>
            <Card variant="glass" className="p-6">
              <Calendar className="text-accent w-8 h-8 mb-4" />
              <h3 className="font-bold text-primary mb-2">Best Time to Visit</h3>
              <p className="text-muted-foreground">{destination.bestTime}</p>
            </Card>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Card variant="glass" className="p-6">
              <Thermometer className="text-accent w-8 h-8 mb-4" />
              <h3 className="font-bold text-primary mb-2">Weather</h3>
              <p className="text-muted-foreground">{destination.weather}</p>
            </Card>
          </FadeUp>
          <FadeUp delay={0.2}>
            <Card variant="glass" className="p-6">
              <Plane className="text-accent w-8 h-8 mb-4" />
              <h3 className="font-bold text-primary mb-2">Starting From</h3>
              <p className="text-muted-foreground">{destination.budget}</p>
            </Card>
          </FadeUp>
        </div>

        <FadeUp delay={0.3}>
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-primary mb-8">Top Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {destination.highlights.map((highlight: string, index: number) => (
                <Card key={index} variant="default" className="p-4 flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-accent" />
                  </div>
                  <p className="text-primary">{highlight}</p>
                </Card>
              ))}
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.4}>
          <Card variant="elevated" className="p-8 bg-accent text-white text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Plan Your {destination.name} Trip with AI</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Let our AI create a personalized itinerary for {destination.name} based on your preferences, budget, and travel dates.
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
