
"use client";

import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import logo from '@/assets/logo.png'; // Assuming you have a logo in your assets
// const LOGO_URL = "https://github.com/user-attachments/assets/abdf8382-b8d4-4319-8af1-1880156a1dac";

interface LoadingScreenProps {
  message?: string;
  fullPage?: boolean;
}

export function LoadingScreen({ message = "Loading...", fullPage = true }: LoadingScreenProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-6 bg-background ${fullPage ? 'min-h-screen' : 'flex-1 h-full'}`}>
      <div className="flex flex-col items-center space-y-6">
        <Image
          src={logo}
          alt="C3L1KD GPT Logo"
          width={64}
          height={64}
          className="rounded-md animate-pulse"
          data-ai-hint="app logo"
          priority
        />
        <div className="flex items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          {message && <p className="ml-4 text-lg text-foreground">{message}</p>}
        </div>
      </div>
    </div>
  );
}
