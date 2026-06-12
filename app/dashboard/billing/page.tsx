'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Check, Zap, CreditCard, Sparkles, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeUp } from '@/components/motion/FadeUp';

export default function BillingPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.primaryEmailAddress?.emailAddress || '' }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch { alert('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/30">
              <CreditCard size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-primary">Billing & Plans</h1>
          </div>
          <p className="text-muted-foreground">Simple pricing. No hidden fees. Cancel anytime.</p>
        </div>

        {/* Current Plan Banner */}
        <Card variant="default" className="p-5 mb-8 flex items-center justify-between bg-accent/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center shadow-sm border border-border">
              <Sparkles size={18} className="text-accent" />
            </div>
            <div>
              <p className="font-bold text-primary">You're on the Free Plan</p>
              <p className="text-sm text-muted-foreground">Upgrade to Pro for unlimited trips and features</p>
            </div>
          </div>
          <Badge variant="pro">Free</Badge>
        </Card>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Free */}
          <FadeUp delay={0}>
            <Card variant="default" className="p-8 border-2 border-border">
              <CardHeader className="p-0 mb-5">
                <CardTitle>Free Plan</CardTitle>
                <CardDescription>Perfect to get started</CardDescription>
              </CardHeader>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-5xl font-bold text-primary">$0</span>
                <span className="text-muted-foreground mb-1.5">/forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "2 AI itineraries per month",
                  "Basic trip planning",
                  "PDF export",
                  "Save & view trips"
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 text-muted-foreground text-sm">
                    <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center shrink-0 border border-success/20">
                      <Check size={12} className="text-success" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full" disabled>
                Current Plan
              </Button>
            </Card>
          </FadeUp>

          {/* Pro */}
          <FadeUp delay={0.05}>
            <Card variant="elevated" className="p-8 bg-accent text-white relative border-2 border-accent">
              <Badge variant="pro" className="absolute -top-3 left-1/2 -translate-x-1/2">MOST POPULAR</Badge>
              <CardHeader className="p-0 mb-5">
                <CardTitle className="text-white">Pro Plan</CardTitle>
                <CardDescription className="text-white/70">For serious travelers</CardDescription>
              </CardHeader>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-5xl font-bold">$3</span>
                <span className="text-white/70 mb-1.5">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited AI itineraries",
                  "AI Travel Manager Sarah",
                  "PDF export with branding",
                  "Hotel & flight comparisons",
                  "WhatsApp trip sharing",
                  "Priority support",
                  "Cancel anytime"
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 text-white text-sm">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0 border border-white/30">
                      <Check size={12} className="text-white" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Button onClick={handleUpgrade} disabled={loading}
                className="w-full bg-white text-accent hover:bg-surface transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg">
                <Zap size={16} />
                {loading ? 'Redirecting to Stripe...' : 'Upgrade to Pro — $3/month'}
              </Button>
              <p className="text-white/50 text-xs text-center mt-3">No contracts. Cancel anytime.</p>
            </Card>
          </FadeUp>
        </div>

        {/* Payment Method */}
        <Card variant="default" className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20">
              <CreditCard size={18} className="text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-primary">Payment Method</h3>
              <p className="text-sm text-muted-foreground">Securely processed by Stripe</p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-4">No payment method added yet. Upgrade to Pro to add one.</p>
          <Button variant="accent" onClick={handleUpgrade}>
            <CreditCard size={15} className="mr-2" /> Add Payment Method
          </Button>
        </Card>

        {/* Security Note */}
        <Card variant="default" className="p-4 bg-success/5 border-success/20 flex items-center gap-3">
          <Shield size={18} className="text-success shrink-0" />
          <p className="text-sm text-success">All payments are secured with 256-bit SSL encryption via Stripe. We never store your card details.</p>
        </Card>

      </div>
    </div>
  );
}
