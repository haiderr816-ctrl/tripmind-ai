'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ArrowRight, Plus, Sparkles, Clock, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeUp } from '@/components/motion/FadeUp';

function TripCard({ trip, onDelete }: { trip: any, onDelete: (id: string) => void }) {
  const [photo, setPhoto] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/photo?query=${encodeURIComponent(trip.destination + ' city landmark')}`)
      .then(r => r.json())
      .then(d => { if (d.url) setPhoto(d.url); });
  }, [trip.destination]);

  return (
    <Card variant="default" className="overflow-hidden group hover:shadow-md transition">
      <div className="relative h-44 bg-gradient-to-br from-accent to-accent/70 overflow-hidden cursor-pointer"
        onClick={() => router.push('/dashboard/trips/' + trip.id)}>
        {photo ? (
          <img src={photo} alt={trip.destination} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/50 to-accent/30 animate-pulse" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <h3 className="text-white font-bold text-lg capitalize">{trip.destination}</h3>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="pro" className="capitalize">{trip.budget}</Badge>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar size={13} className="text-accent" /> {trip.startDate}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock size={13} className="text-accent" /> {trip.endDate}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-accent" />
            <span className="text-xs text-accent font-semibold">AI Generated</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onDelete(trip.id)}
              className="text-muted-foreground hover:text-destructive transition p-1">
              <Trash2 size={15} />
            </button>
            <button onClick={() => router.push('/dashboard/trips/' + trip.id)}
              className="flex items-center gap-1 text-xs font-semibold text-accent hover:gap-2 transition-all">
              View <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/get-trips').then(r => r.json()).then(data => {
      if (data.trips) setTrips(data.trips);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this trip?')) return;
    await fetch('/api/delete-trip?id=' + id, { method: 'DELETE' });
    setTrips(prev => prev.filter(t => t.id !== id));
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-1">My Trips</h1>
          <p className="text-muted-foreground">{trips.length} saved {trips.length === 1 ? 'itinerary' : 'itineraries'}</p>
        </div>
        <Link href="/dashboard/plan">
          <Button variant="accent" size="lg">
            <Plus size={16} className="mr-2" /> Plan New Trip
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i => <div key={i} className="h-56 bg-surface rounded-2xl animate-pulse border border-border" />)}
        </div>
      ) : trips.length === 0 ? (
        <Card variant="default" className="p-16 text-center">
          <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">🗺️</span>
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">No trips yet</h3>
          <p className="text-muted-foreground mb-6">Start planning your first AI-powered adventure!</p>
          <Link href="/dashboard/plan">
            <Button variant="accent" size="lg">
              Plan My First Trip
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((trip: any, index) => (
            <FadeUp key={trip.id} delay={index * 0.05}>
              <TripCard trip={trip} onDelete={handleDelete} />
            </FadeUp>
          ))}
        </div>
      )}
    </div>
  );
}
