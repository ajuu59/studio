
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { useToast } from "@/hooks/use-toast";

export function Footer() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulate subscription
      localStorage.setItem('newsletter_subscription', email);
      toast({
        title: "Subscribed!",
        description: `Thank you for subscribing, ${email}!`,
      });
      setEmail('');
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
    }
  };

  return (
    <footer className="border-t py-8 mt-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">{APP_NAME}</h3>
            <p className="text-sm text-muted-foreground">
              Automate, manage, and share your content effortlessly.
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">Newsletter</h3>
            <form onSubmit={handleSubscription} className="flex flex-col sm:flex-row gap-2 justify-center items-center max-w-sm mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:flex-1"
                aria-label="Email for newsletter"
              />
              <Button type="submit" variant="default" className="w-full sm:w-auto">Subscribe</Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              Stay updated with our latest posts and news.
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">Follow Us</h3>
            {/* Placeholder for social media links */}
            <div className="flex space-x-4 justify-center">
              <a href="#" className="text-muted-foreground hover:text-foreground">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Facebook</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
