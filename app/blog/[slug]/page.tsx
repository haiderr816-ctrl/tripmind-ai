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
      
      content: `
      <h2 class="text-2xl font-bold text-primary mb-4">Why Paris Should Be Your Next Destination</h2>
      <p class="text-muted-foreground mb-6">Paris is one of those cities that lives up to every expectation. The architecture, the food, the art, the romance — it all comes together in a way no other city on earth can match. Whether it is your first visit or your tenth, Paris always has something new to offer. This complete guide covers everything a first-time visitor needs to know to have the perfect Paris experience without wasting money or time.</p>

      <h2 class="text-2xl font-bold text-primary mb-4">Best Time to Visit Paris</h2>
      <p class="text-muted-foreground mb-4">Paris is beautiful year round but the best months to visit are April through June and September through October. Spring brings blooming flowers, mild temperatures around 15-20°C, and the city feels alive after winter. Autumn offers golden leaves along the Seine, fewer crowds than summer, and excellent weather for walking.</p>
      <p class="text-muted-foreground mb-4">July and August are peak tourist season — the Eiffel Tower queues can be 2-3 hours long and hotel prices double. Many Parisians actually leave the city in August for their own holidays, so some local restaurants and shops close. If you must visit in summer, book everything at least 3 months in advance.</p>
      <ul class="list-disc list-inside text-muted-foreground space-y-2 mb-6">
        <li><strong>April-June:</strong> Perfect weather, blooming gardens, ideal for sightseeing</li>
        <li><strong>July-August:</strong> Peak crowds, highest prices, very hot (30°C+)</li>
        <li><strong>September-October:</strong> Best overall — mild weather, fewer tourists, great food festivals</li>
        <li><strong>November-March:</strong> Cold but romantic, lowest prices, Christmas markets in December</li>
      </ul>

      <h2 class="text-2xl font-bold text-primary mb-4">Getting Around Paris</h2>
      <p class="text-muted-foreground mb-4">Paris has one of the best public transport systems in the world. The Métro has 16 lines covering every corner of the city and runs from 5:30am to 1:15am (2:15am on weekends). A single ticket costs €1.90 and a book of 10 tickets (carnet) costs €16.90 — always buy the carnet to save money.</p>
      <p class="text-muted-foreground mb-4">The Paris Visite pass gives unlimited travel on Métro, RER, and buses for 1-5 days. For a 5 day trip the 5-day pass at around €38 is excellent value if you plan to use transport frequently. Alternatively walking is genuinely one of the best ways to explore Paris — most major attractions in central Paris are within 30-45 minutes walk of each other.</p>
      <p class="text-muted-foreground mb-6">Avoid taxis from the airport — they are expensive. Take the RER B train from Charles de Gaulle airport directly to central Paris for €11.80. From Orly airport take the Orlyval shuttle to RER B for €13.25. Both take about 35-45 minutes.</p>

      <h2 class="text-2xl font-bold text-primary mb-4">Top Attractions in Paris</h2>
      <h3 class="text-xl font-bold text-primary mb-3">Eiffel Tower</h3>
      <p class="text-muted-foreground mb-4">The Eiffel Tower is non-negotiable on any Paris trip. Book tickets online at least 2-3 weeks in advance — walk-up queues can be 3 hours long in peak season. The second floor offers the best value — the views are spectacular and tickets are cheaper than the summit. Visit at sunset for the most magical experience, and stay until dark to see the tower sparkle for 5 minutes every hour.</p>

      <h3 class="text-xl font-bold text-primary mb-3">The Louvre</h3>
      <p class="text-muted-foreground mb-4">The world's largest art museum with over 35,000 works on display. Dedicate at least half a day — a full day if you are an art lover. Book tickets online to skip the pyramid queue. The Mona Lisa is smaller than most people expect and always surrounded by crowds — visit it first thing in the morning when doors open at 9am. The museum is free on the first Friday evening of each month for visitors under 26.</p>

      <h3 class="text-xl font-bold text-primary mb-3">Notre-Dame Cathedral</h3>
      <p class="text-muted-foreground mb-4">Notre-Dame reopened in December 2024 after the devastating 2019 fire. The restoration is considered one of the greatest architectural achievements of the 21st century. The cathedral is free to enter and more beautiful than ever — the restored interior is breathtaking. Book a free entry ticket online in advance as capacity is limited.</p>

      <h3 class="text-xl font-bold text-primary mb-3">Montmartre and Sacré-Coeur</h3>
      <p class="text-muted-foreground mb-4">The hilltop neighbourhood of Montmartre is the most charming area of Paris. The white Sacré-Coeur basilica at the top offers the best panoramic views of the city — and entry is completely free. The surrounding streets are filled with artists, cafés, and the authentic Paris that tourists rarely find. Visit early morning before the crowds arrive.</p>

      <h3 class="text-xl font-bold text-primary mb-3">Musée d'Orsay</h3>
      <p class="text-muted-foreground mb-4">Housed in a stunning former railway station, the Musée d'Orsay contains the world's finest collection of Impressionist art including works by Monet, Renoir, Van Gogh, and Degas. Many visitors prefer it to the Louvre as it is more manageable in size. Book tickets online and visit on Thursday evenings when it stays open until 9:45pm with smaller crowds.</p>

      <h2 class="text-2xl font-bold text-primary mb-4">Paris by Neighbourhood</h2>
      <ul class="list-disc list-inside text-muted-foreground space-y-2 mb-6">
        <li><strong>Le Marais (3rd/4th):</strong> Trendy, historic, great Jewish quarter food, LGBTQ+ friendly</li>
        <li><strong>Saint-Germain-des-Prés (6th):</strong> Literary cafés, art galleries, upscale shopping</li>
        <li><strong>Montmartre (18th):</strong> Bohemian, artistic, best views, most charming streets</li>
        <li><strong>Latin Quarter (5th):</strong> Student area, budget food, Panthéon, lively atmosphere</li>
        <li><strong>Champs-Élysées (8th):</strong> Tourist central, expensive but iconic, Arc de Triomphe</li>
        <li><strong>Canal Saint-Martin (10th):</strong> Hipster Paris, local cafés, beautiful canal walks</li>
      </ul>

      <h2 class="text-2xl font-bold text-primary mb-4">Paris Food Guide — What to Eat and Where</h2>
      <p class="text-muted-foreground mb-4">Eating well in Paris does not require spending a fortune. Here is exactly what to eat and where to find it without overpaying.</p>
      <ul class="list-disc list-inside text-muted-foreground space-y-2 mb-6">
        <li><strong>Croissant:</strong> Get it from any neighbourhood boulangerie — never a tourist area café. Cost: €1.20-1.80</li>
        <li><strong>Crêpes:</strong> Street crêpe stands near Montmartre and Luxembourg Gardens. Cost: €3-6</li>
        <li><strong>Steak Frites:</strong> The classic French bistro dish. Order at any neighbourhood bistro. Cost: €15-22</li>
        <li><strong>Baguette sandwich:</strong> Grab from a boulangerie for the cheapest and best lunch. Cost: €4-6</li>
        <li><strong>Macarons:</strong> Ladurée and Pierre Hermé are the best. Cost: €2.50 each</li>
        <li><strong>Wine:</strong> Buy from a supermarket (Monoprix) for €4-8 a bottle — same quality as restaurants</li>
      </ul>
      <p class="text-muted-foreground mb-6">For budget meals, the Latin Quarter has dozens of restaurants offering a 3-course prix fixe lunch menu for €12-15. This is the best value dining in Paris — always eat your big meal at lunch, not dinner, as lunch menus are significantly cheaper.</p>

      <h2 class="text-2xl font-bold text-primary mb-4">5 Day Paris Itinerary</h2>
      <ul class="list-disc list-inside text-muted-foreground space-y-2 mb-6">
        <li><strong>Day 1:</strong> Eiffel Tower (morning), Champ de Mars picnic (lunch), Seine river cruise (afternoon), Eiffel Tower light show (night)</li>
        <li><strong>Day 2:</strong> Louvre Museum (morning, 3 hours), Tuileries Garden (lunch), Musée d'Orsay (afternoon), Saint-Germain dinner</li>
        <li><strong>Day 3:</strong> Notre-Dame, Île de la Cité, Le Marais exploration, Picasso Museum, Jewish Quarter falafel for lunch</li>
        <li><strong>Day 4:</strong> Montmartre and Sacré-Coeur (morning), artist quarter exploration, Moulin Rouge area (evening optional show)</li>
        <li><strong>Day 5:</strong> Versailles day trip (book in advance), return for farewell Seine walk and dinner</li>
      </ul>

      <h2 class="text-2xl font-bold text-primary mb-4">Paris Budget Guide 2026</h2>
      <ul class="list-disc list-inside text-muted-foreground space-y-2 mb-6">
        <li><strong>Budget traveler:</strong> €80-120/day (hostels, boulangerie meals, free museums)</li>
        <li><strong>Mid-range:</strong> €200-350/day (3 star hotels, bistro dinners, paid attractions)</li>
        <li><strong>Luxury:</strong> €500+/day (5 star hotels, Michelin restaurants, private tours)</li>
      </ul>
      <p class="text-muted-foreground mb-6">Many of Paris's best experiences are completely free — the Eiffel Tower exterior, all churches including Notre-Dame, most parks and gardens, walking along the Seine, Montmartre streets, and the first Sunday of each month when most national museums are free including the Louvre and Musée d'Orsay.</p>

      <h2 class="text-2xl font-bold text-primary mb-4">Visa Information for Paris</h2>
      <p class="text-muted-foreground mb-4">France is part of the Schengen Area. Citizens of the USA, UK, Canada, Australia, and most EU countries do not need a visa for stays up to 90 days. From 2025, travellers from visa-exempt countries need to register for ETIAS (European Travel Information and Authorisation System) before travel — this costs €7 and is valid for 3 years.</p>
      <p class="text-muted-foreground mb-6">Pakistani, Indian, and most Asian nationals require a Schengen visa. Apply at the French consulate in your country at least 6-8 weeks before travel. Required documents include bank statements, hotel bookings, return flight ticket, travel insurance, and employment proof. The visa costs €80 and takes 15 working days to process.</p>

      <h2 class="text-2xl font-bold text-primary mb-4">Common Paris Mistakes to Avoid</h2>
      <ul class="list-disc list-inside text-muted-foreground space-y-2 mb-6">
        <li>Eating near major tourist attractions — prices are double and quality is half</li>
        <li>Not booking Eiffel Tower tickets in advance — you will wait 2-3 hours</li>
        <li>Taking taxis from the airport — always use RER train</li>
        <li>Visiting the Louvre without a plan — you need a strategy or you will get lost</li>
        <li>Skipping Versailles — it is only 40 minutes from Paris and absolutely worth it</li>
        <li>Not learning basic French phrases — even just "Bonjour" and "Merci" changes how locals treat you</li>
      </ul>

      <h2 class="text-2xl font-bold text-primary mb-4">Final Thoughts on Paris</h2>
      <p class="text-muted-foreground mb-6">Paris rewards slow travel. Do not try to rush through every attraction in 2 days. Pick a neighbourhood, sit in a café, watch the city move. The best Paris moments are not inside museums — they are on the streets, in the markets, along the Seine at golden hour. Let TripMind AI build your complete personalised Paris itinerary in seconds — tell our AI your budget, travel dates, and interests and get a day by day plan instantly.</p>
    `,
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