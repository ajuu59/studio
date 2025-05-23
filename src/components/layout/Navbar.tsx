
"use client";

import Link from 'next/link';
import { BookMarked, Home, Settings, UserCircle, MessageSquare } from 'lucide-react';
import { RoleSelector } from '@/components/auth/RoleSelector';
import { useAuth } from '@/contexts/AuthContext';
import { APP_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BookMarked className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">
            {APP_NAME}
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-2 md:space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <Home className="mr-0 md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">Home</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/chat">
              <MessageSquare className="mr-0 md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">Chat</span>
            </Link>
          </Button>
          {isAuthenticated(['Admin', 'Editor', 'Contributor']) && ( // Also allow Contributor to see Admin link if they have some admin capabilities
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <Settings className="mr-0 md:mr-2 h-4 w-4" />
                <span className="hidden md:inline">Admin</span>
              </Link>
            </Button>
          )}
        </nav>
        <div className="flex items-center space-x-2 md:space-x-4">
          <RoleSelector />
          {/* Placeholder for actual user profile/login */}
          <Button variant="outline" size="icon">
             <UserCircle className="h-5 w-5" />
             <span className="sr-only">User Profile</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
