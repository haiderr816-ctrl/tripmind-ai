'use client';

import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const dashboardPaths = ['/dashboard', '/dashboard/billing', '/dashboard/leads', '/dashboard/settings', '/dashboard/trips', '/dashboard/users'];

export default function StickyCtA() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show on mobile only
    const checkMobile = () => {
      setIsVisible(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hide on dashboard pages
  if (dashboardPaths.some(path => pathname?.startsWith(path))) {
    return null;
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border p-4 md:hidden">
      <a href="/#lead-capture">
        <Button variant="accent" size="lg" className="w-full">
          <Sparkles className="w-5 h-5 mr-2" />
          Plan Your Trip Free
        </Button>
      </a>
    </div>
  );
}
