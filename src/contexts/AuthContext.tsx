"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import type { UserRole } from '@/lib/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { DEFAULT_USER_ROLE } from '@/lib/constants';

interface AuthContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useLocalStorage<UserRole>('userRole', DEFAULT_USER_ROLE);

  const isAuthenticated = (roles: UserRole[]): boolean => {
    return roles.includes(userRole);
  };

  return (
    <AuthContext.Provider value={{ userRole, setUserRole, isAuthenticated }}>
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
