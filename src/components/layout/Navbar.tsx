
"use client";

import Link from 'next/link';
import { Home, Settings, UserCircle, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { APP_NAME, DEFAULT_USER_ROLE } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from '@/components/blog/SearchBar';

// Custom SVG Logo Component
const LogoIcon = () => (
  <svg
    width="28" // Increased size slightly for better visibility
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-7 w-7 text-primary" // Applied consistent sizing and primary color
  >
    {/* Rounded Square (Checkbox Body) */}
    <rect x="3" y="3" width="15" height="15" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
    {/* Checkmark */}
    <path d="M7 10.5L10 13.5L15.5 8" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Neural Network / AI Element (Simplified) */}
    <circle cx="17.5" cy="5.5" r="1.5" fill="currentColor" />
    <circle cx="20.5" cy="8.5" r="1.5" fill="currentColor" />
    <circle cx="17.5" cy="11.5" r="1.5" fill="currentColor" />
    <path d="M16.1132 6.55175L18.8868 7.44825" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M18.8868 9.55175L16.1132 10.4482" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M17.5 7V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);


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
          <LogoIcon />
          <span className="font-bold sm:inline-block">
            {APP_NAME}
          </span>
        </Link>
        <nav className="flex items-center space-x-2 md:space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <Home className="mr-0 md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">Home</span>
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

        <div className="flex-1 flex justify-center px-2 md:px-4">
          <SearchBar />
        </div>

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
