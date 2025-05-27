
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { WelcomeDisclaimer } from '@/components/layout/WelcomeDisclaimer';
import { LoadingScreen } from '@/components/layout/LoadingScreen'; // Ensure LoadingScreen is imported

const LOGO_URL = "https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-4864-622f-9b61-363bd6aa19f2/raw?se=2025-05-27T19%3A33%3A56Z&sp=r&sv=2024-08-04&sr=b&scid=933b069e-9eb7-51a2-a3f5-07f5178e48c0&skoid=bbd22fc4-f881-4ea4-b2f3-c12033cf6a8b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-27T06%3A16%3A10Z&ske=2025-05-28T06%3A16%3A10Z&sks=b&skv=2024-08-04&sig=RUnGrX7/AzVWvsviW6Ek%2BSye1ZL0QOC4UMmaLZM23Bo%3D";
const DISCLAIMER_KEY = 'c3l1kd_disclaimer_accepted';

export default function HomePage() {
  const { user, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const [disclaimerState, setDisclaimerState] = useState<'loading' | 'pending' | 'accepted'>('loading');

  console.log(`HomePage initial render: authIsLoading=${authIsLoading}, disclaimerState=${disclaimerState}, user=${!!user}`);

  useEffect(() => {
    console.log(`HomePage Effect 1 (disclaimer check) triggered: authIsLoading=${authIsLoading}, user changed=${!!user}`);
    if (authIsLoading) {
      console.log("HomePage Effect 1: Auth is loading, setting disclaimerState to 'loading'.");
      setDisclaimerState('loading');
      return;
    }

    if (user) {
      console.log("HomePage Effect 1: User is authenticated, setting disclaimerState to 'accepted'.");
      setDisclaimerState('accepted');
    } else {
      // User is not authenticated. Check if they have previously accepted the disclaimer.
      const storedDisclaimerValue = localStorage.getItem(DISCLAIMER_KEY);
      const hasPreviouslyAcceptedDisclaimer = storedDisclaimerValue === 'true';
      console.log(`HomePage Effect 1: User not authenticated. localStorage[${DISCLAIMER_KEY}]='${storedDisclaimerValue}'. Has previously accepted: ${hasPreviouslyAcceptedDisclaimer}`);
      if (hasPreviouslyAcceptedDisclaimer) {
        setDisclaimerState('accepted');
      } else {
        setDisclaimerState('pending'); // Needs to see/accept disclaimer
      }
    }
  }, [user, authIsLoading]); // Rerun when auth state is known

  const handleAcceptDisclaimer = () => {
    console.log("HomePage: Disclaimer accepted by user.");
    localStorage.setItem(DISCLAIMER_KEY, 'true');
    setDisclaimerState('accepted');
  };

  useEffect(() => {
    console.log(`HomePage Effect 2 (routing) triggered: disclaimerState=${disclaimerState}, authIsLoading=${authIsLoading}, user=${!!user}`);
    // This effect handles routing AFTER disclaimer state is resolved AND auth state is known.
    // It needs disclaimerState to be 'accepted' before attempting to route.
    if (disclaimerState === 'accepted' && !authIsLoading) {
      if (user) {
        console.log("HomePage Effect 2: Disclaimer accepted, user authenticated. Routing to /dashboard.");
        router.replace('/dashboard');
      } else {
        console.log("HomePage Effect 2: Disclaimer accepted, user NOT authenticated. Routing to /login.");
        router.replace('/login');
      }
    } else {
      console.log("HomePage Effect 2: Conditions for routing not met.");
    }
  }, [user, authIsLoading, disclaimerState, router]);

  // Show initial loading screen while checking auth status or disclaimer status
  if (authIsLoading || disclaimerState === 'loading') {
    console.log("HomePage rendering: Showing 'Initializing...' loading screen.");
    return (
      <LoadingScreen message="Initializing C3L1KD GPT..." fullPage={true} />
    );
  }

  // If disclaimer is pending, show the disclaimer page
  if (disclaimerState === 'pending') {
    console.log("HomePage rendering: Showing WelcomeDisclaimer.");
    return <WelcomeDisclaimer onAccept={handleAcceptDisclaimer} logoUrl={LOGO_URL} />;
  }

  // Fallback loading screen while redirecting after disclaimer is accepted
  // This implies disclaimerState === 'accepted' and authIsLoading is false.
  // The second useEffect should handle the redirect.
  console.log("HomePage rendering: Showing 'Preparing Your Session...' loading screen (should be brief before redirect).");
  return (
    <LoadingScreen message="Preparing Your Session..." fullPage={true} />
  );
}
