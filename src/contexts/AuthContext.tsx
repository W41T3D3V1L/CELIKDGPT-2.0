
"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER_KEY = 'chronoChatUser';

// Helper to convert HSL to a simplified Hex for URL (not production-grade)
// For DeepSeek-like primary: 210 70% 55% -> approx #2D74CE
// For DeepSeek-like primary-foreground: 210 20% 98% -> approx #F7FAFC
const PRIMARY_AVATAR_BG_HEX = "2D74CE";
const PRIMARY_AVATAR_FG_HEX = "F7FAFC";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(MOCK_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(MOCK_USER_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser: User = {
      id: '1',
      username,
      avatar: `https://placehold.co/100x100/${PRIMARY_AVATAR_BG_HEX}/${PRIMARY_AVATAR_FG_HEX}.png?text=${username.charAt(0).toUpperCase()}`
    };
    setUser(mockUser);
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    setIsLoading(false);
    toast({ title: "Login Successful", description: `Welcome back, ${username}!` });
    router.push('/dashboard');
  }, [router, toast]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(MOCK_USER_KEY);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push('/login');
  }, [router, toast]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
