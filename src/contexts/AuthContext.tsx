
"use client";

import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import type { UserRole } from '@/lib/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { DEFAULT_USER_ROLE } from '@/lib/constants';
import { useRouter } from 'next/navigation'; 

interface AuthContextType {
  userRole: UserRole;
  login: (usernameInput: string, passwordInput: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRoleState] = useLocalStorage<UserRole>('userRole', DEFAULT_USER_ROLE);
  const router = useRouter();

  const setUserRole = useCallback((role: UserRole) => {
    setUserRoleState(role);
  }, [setUserRoleState]);

  const login = useCallback(async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUserRole(data.role);
        router.push('/admin'); // Redirect to admin dashboard on successful login
        return true;
      } else {
        // API returned an error or login failed
        console.error('Login failed:', data.message || 'Unknown error');
        return false;
      }
    } catch (error) {
      console.error('Error during login API call:', error);
      return false;
    }
  }, [setUserRole, router]);

  const logout = useCallback(() => {
    setUserRole(DEFAULT_USER_ROLE);
    // Potentially call an API endpoint for server-side session invalidation in the future
    router.push('/login'); // Redirect to login page after logout
  }, [setUserRole, router]);

  const isAuthenticated = useCallback((roles: UserRole[]): boolean => {
    return roles.includes(userRole);
  }, [userRole]);

  return (
    <AuthContext.Provider value={{ userRole, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
