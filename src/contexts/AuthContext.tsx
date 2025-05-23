
"use client";

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import type { UserRole } from '@/lib/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { DEFAULT_USER_ROLE, ADMIN_USERNAME, ADMIN_PASSWORD } from '@/lib/constants';
import { useRouter } from 'next/navigation'; // For redirecting after login/logout

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
    if (usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
      setUserRole('Admin');
      router.push('/admin'); // Redirect to admin dashboard on successful admin login
      return true;
    }
    // Placeholder for other role logins if needed in the future
    // For now, only admin login is implemented with fixed credentials
    return false;
  }, [setUserRole, router]);

  const logout = useCallback(() => {
    setUserRole(DEFAULT_USER_ROLE);
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
