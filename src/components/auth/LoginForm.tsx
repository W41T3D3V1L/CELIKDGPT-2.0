
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LogIn, Loader2, Zap } from 'lucide-react'; // Using Zap or similar for "Explore GPT"
import Image from 'next/image'; // Added for new logo

const NEW_LOGO_URL = "https://github.com/user-attachments/assets/abdf8382-b8d4-4319-8af1-1880156a1dac";

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
        <Image src={NEW_LOGO_URL} alt="C3L1KD GPT Logo" width={40} height={40} className="rounded-sm mb-3" data-ai-hint="app logo"/>
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
