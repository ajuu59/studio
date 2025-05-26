
"use client";

import React, { createContext, useContext, ReactNode, useCallback, useState } from 'react'; // Added useState and corrected import
import type { UserRole } from '@/lib/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { DEFAULT_USER_ROLE } from '@/lib/constants';
import { useRouter } from 'next/navigation'; 

interface AuthContextType {
  userRole: UserRole;
  authorName: string | null; // Added authorName
  login: (usernameInput: string, passwordInput: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRoleState] = useLocalStorage<UserRole>('userRole', DEFAULT_USER_ROLE);
  const [authorName, setAuthorNameState] = useLocalStorage<string | null>('authorName', null); // Added state for authorName
  const router = useRouter();

  const setUserRole = useCallback((role: UserRole) => {
    setUserRoleState(role);
  }, [setUserRoleState]);

  const setAuthorName = useCallback((name: string | null) => { // Added setter for authorName
    setAuthorNameState(name);
  }, [setAuthorNameState]);

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

      if (response.ok && data.success && data.role && data.authorName) {
        setUserRole(data.role);
        setAuthorName(data.authorName); // Set authorName from API response
        router.push('/admin'); 
        return true;
      } else {
        console.error('Login failed:', data.message || 'Unknown error');
        return false;
      }
    } catch (error) {
      console.error('Error during login API call:', error);
      return false;
    }
  }, [setUserRole, setAuthorName, router]);

  const logout = useCallback(() => {
    setUserRole(DEFAULT_USER_ROLE);
    setAuthorName(null); // Clear authorName on logout
    router.push('/login'); 
  }, [setUserRole, setAuthorName, router]);

  const isAuthenticated = useCallback((roles: UserRole[]): boolean => {
    return roles.includes(userRole);
  }, [userRole]);

  return (
    <AuthContext.Provider value={{ userRole, authorName, login, logout, isAuthenticated }}>
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

