
"use client";

import Link from 'next/link';
import { BookMarked, Home, Settings, UserCircle, MessageSquare, LogIn, LogOut } from 'lucide-react';
// RoleSelector import removed
import { useAuth } from '@/contexts/AuthContext';
import { APP_NAME, DEFAULT_USER_ROLE } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export function Navbar() {
  const { userRole, isAuthenticated, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isLoggedIn = userRole !== DEFAULT_USER_ROLE;

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
          {!isMounted && (
            <div className="flex items-center gap-2">
              <Skeleton className="w-20 h-9" /> 
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
          )}
          {isMounted && (
            <>
              {isLoggedIn ? (
                <>
                  <Badge variant="secondary">{userRole}</Badge>
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="mr-0 md:mr-2 h-4 w-4" />
                    <span className="hidden md:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">
                    <LogIn className="mr-0 md:mr-2 h-4 w-4" />
                    <span className="hidden md:inline">Login</span>
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="icon" className={isLoggedIn ? '' : 'ml-2'}>
                 <UserCircle className="h-5 w-5" />
                 <span className="sr-only">User Profile</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
