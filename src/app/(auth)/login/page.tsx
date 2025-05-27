
"use client";

import { LoginForm } from '@/components/auth/LoginForm';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Optional: Subtle background pattern or very dark solid color for DeepSeek style */}
      {/* <div
        className="absolute inset-0 z-0 opacity-5 dark:opacity-5" // Very subtle
        style={{
          backgroundImage: "url('https://placehold.co/1920x1080/171A1C/2A2E35.png?text=.')", // Dark pattern
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        data-ai-hint="dark pattern subtle"
      /> */}
      {/* <div className="absolute inset-0 z-[1] bg-gradient-to-br from-background via-transparent to-background opacity-30" /> */}
      
      <div className="z-10 w-full max-w-sm"> {/* Max-w-sm for a more compact login form */}
        <LoginForm />
      </div>
      <footer className="z-10 absolute bottom-6 text-center text-xs text-muted-foreground/70">
        C3L1KD GPT &copy; {currentYear !== null ? currentYear : new Date().getFullYear()}. All realities simulated.
      </footer>
    </div>
  );
}
