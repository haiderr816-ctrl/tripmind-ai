'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function ExitIntent() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check if already shown in this session
    const hasShown = sessionStorage.getItem('exitIntentShown');
    if (hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from top of viewport
      if (e.clientY <= 0) {
        setIsVisible(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'exit_intent' }),
      });
      setSubmitted(true);
      setEmail('');
    } catch (error) {
      console.error('Error submitting lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card variant="elevated" className="max-w-md w-full p-6 bg-surface relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <Sparkles className="w-16 h-16 text-success mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-primary mb-2">Thank You!</h3>
            <p className="text-muted-foreground">We'll send you personalized travel recommendations soon.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">Wait! Get a Free Itinerary</h3>
              <p className="text-muted-foreground">
                Enter your email and our AI will send you personalized travel recommendations.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <Input
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mb-4"
              />
              <Button variant="accent" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Get Free Itinerary
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
