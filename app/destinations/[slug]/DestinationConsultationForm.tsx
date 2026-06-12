'use client';

import { useState } from 'react';
import { Sparkles, Send, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface DestinationConsultationFormProps {
  destination: string;
}

export default function DestinationConsultationForm({ destination }: DestinationConsultationFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          destination,
          source: 'destination_page'
        }),
      });
      setSubmitted(true);
      setEmail('');
    } catch (error) {
      console.error('Error submitting lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card variant="elevated" className="p-8 bg-surface">
      {submitted ? (
        <div className="text-center py-8">
          <Check className="w-16 h-16 text-success mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-primary mb-2">Thank You!</h3>
          <p className="text-muted-foreground">We'll send you personalized {destination} travel recommendations soon.</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <Sparkles className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-primary mb-2">Get Free {destination} Travel Consultation</h3>
            <p className="text-muted-foreground">
              Enter your email and our AI will send you personalized {destination} travel recommendations.
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
                  Get Free Consultation
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
  );
}
