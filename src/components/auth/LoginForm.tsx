
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LogIn, Loader2, Zap } from 'lucide-react'; // Using Zap or similar for "Explore GPT"
import Image from 'next/image'; // Added for new logo
import {LOGO} from '@/api/logo.png'; // Assuming you have a logo in your assets

// const NEW_LOGO_URL = "https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-4864-622f-9b61-363bd6aa19f2/raw?se=2025-05-27T19%3A33%3A56Z&sp=r&sv=2024-08-04&sr=b&scid=933b069e-9eb7-51a2-a3f5-07f5178e48c0&skoid=bbd22fc4-f881-4ea4-b2f3-c12033cf6a8b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-27T06%3A16%3A10Z&ske=2025-05-28T06%3A16%3A10Z&sks=b&skv=2024-08-04&sig=RUnGrX7/AzVWvsviW6Ek%2BSye1ZL0QOC4UMmaLZM23Bo%3D";

export function LoginForm() {
  const [username, setUsername] = useState('');
  const { login, isLoading } = useAuth();
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      // Consider using ShadCN toast for errors
      alert("Please enter a username.");
      return;
    }
    await login(username);
  };

  return (
    <Card className="w-full max-w-sm shadow-xl bg-card border-border/50"> {/* Use card bg from theme */}
      <CardHeader className="text-center items-center">
        <Image src={LOGO} alt="C3L1KD GPT Logo" width={40} height={40} className="rounded-sm mb-3" data-ai-hint="app logo"/>
        <CardTitle className="text-2xl font-semibold text-foreground">C3L1KD GPT</CardTitle>
        <CardDescription className="text-muted-foreground text-sm pt-1">
          Sign in to explore AI simulation.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-sm font-medium text-foreground">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-input border-border focus:bg-input focus:border-primary text-sm" // Use theme input style
            />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" /> Access Simulation
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-xs text-muted-foreground/80 pt-4 pb-5">
        <p>Powered by C3L1KD GPT</p>
      </CardFooter>
    </Card>
  );
}
