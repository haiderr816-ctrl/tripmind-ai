'use client';

import { useState } from 'react';
import { Sparkles, Send, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function BlogNewsletterSignup() {
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
          source: 'blog_newsletter'
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
    <Card variant="glass" className="p-6 bg-accent/5 border-accent/20">
      {submitted ? (
        <div className="text-center py-4">
          <Check className="w-12 h-12 text-success mx-auto mb-3" />
          <h3 className="text-xl font-bold text-primary mb-2">Subscribed!</h3>
          <p className="text-muted-foreground text-sm">You'll receive travel tips in your inbox.</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-4">
            <Sparkles className="w-8 h-8 text-accent mx-auto mb-2" />
            <h3 className="text-lg font-bold text-primary mb-1">Get Travel Tips in Your Inbox</h3>
            <p className="text-muted-foreground text-sm">
              Subscribe to our newsletter for weekly travel inspiration and AI-powered tips.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button variant="accent" size="default" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Send className="w-4 h-4" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-3">
            No spam. Unsubscribe anytime.
          </p>
        </>
      )}
    </Card>
  );
}
