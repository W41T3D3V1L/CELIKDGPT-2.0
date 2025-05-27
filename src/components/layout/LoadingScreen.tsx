
"use client";

import Image from 'next/image';
import { Loader2 } from 'lucide-react';

const LOGO_URL = "https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-4864-622f-9b61-363bd6aa19f2/raw?se=2025-05-27T19%3A33%3A56Z&sp=r&sv=2024-08-04&sr=b&scid=933b069e-9eb7-51a2-a3f5-07f5178e48c0&skoid=bbd22fc4-f881-4ea4-b2f3-c12033cf6a8b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-27T06%3A16%3A10Z&ske=2025-05-28T06%3A16%3A10Z&sks=b&skv=2024-08-04&sig=RUnGrX7/AzVWvsviW6Ek%2BSye1ZL0QOC4UMmaLZM23Bo%3D";

interface LoadingScreenProps {
  message?: string;
  fullPage?: boolean;
}

export function LoadingScreen({ message = "Loading...", fullPage = true }: LoadingScreenProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-6 bg-background ${fullPage ? 'min-h-screen' : 'flex-1 h-full'}`}>
      <div className="flex flex-col items-center space-y-6">
        <Image
          src={LOGO_URL}
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
