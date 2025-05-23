
"use client";

import Link from 'next/link';
import { BookMarked, Home, Settings, UserCircle, MessageSquare } from 'lucide-react';
import { RoleSelector } from '@/components/auth/RoleSelector';
import { useAuth } from '@/contexts/AuthContext';
import { APP_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';

export function Navbar() {
  const { isAuthenticated } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []); // Empty dependency array ensures this runs once on mount

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
          {/* Defer rendering of Admin link until client is mounted */}
          {isMounted && isAuthenticated(['Admin', 'Editor', 'Contributor']) && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <Settings className="mr-0 md:mr-2 h-4 w-4" />
                <span className="hidden md:inline">Admin</span>
              </Link>
            </Button>
          )}
        </nav>
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Defer RoleSelector rendering or provide a placeholder */}
          {isMounted ? (
            <RoleSelector />
          ) : (
            <div className="flex items-center gap-2">
              <Label htmlFor="role-select-placeholder" className="text-sm shrink-0">Role:</Label>
              <Skeleton id="role-select-placeholder" className="w-[180px] h-9" />
            </div>
          )}
          <Button variant="outline" size="icon">
             <UserCircle className="h-5 w-5" />
             <span className="sr-only">User Profile</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
