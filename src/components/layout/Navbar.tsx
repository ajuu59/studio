"use client";

import Link from 'next/link';
import { BookMarked, Home, Settings, UserCircle } from 'lucide-react';
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
        <nav className="flex flex-1 items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          {isAuthenticated(['Admin', 'Editor']) && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <Settings className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </Button>
          )}
        </nav>
        <div className="flex items-center space-x-4">
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
