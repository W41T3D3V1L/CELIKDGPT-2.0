
"use client";

import { Button } from '@/components/ui/button';
import { ChatInput } from '@/components/chat/ChatInput'; 
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { LoadingScreen } from '@/components/layout/LoadingScreen';

export default function ChatPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { createNewChat, isSendingMessage, chatSessions, isSessionsLoading } = useChat();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartChat = async (messageText: string) => {
    if (!messageText.trim()) return;
    setIsProcessing(true);
    try {
      const newId = createNewChat(messageText); 
      router.push(`/chat/${newId}`);
    } catch (error) {
      console.error("Error starting new chat:", error);
      setIsProcessing(false); // Reset on error
    } 
    // setIsProcessing(false) will be handled by navigation or if error
  };
  
  useEffect(() => {
    // This effect can be used for other logic if needed,
    // e.g. redirecting to an existing chat if user lands on /chat directly.
    // For now, AppShell's logic handles most redirection.
  }, [chatSessions, isSessionsLoading, router]);


  if (authLoading || isSessionsLoading) {
    return <LoadingScreen message="Preparing C3L1KD GPT..." fullPage={false} />;
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-background text-center relative h-full">
      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-3xl">
        {user && !isProcessing && !isSendingMessage && (
          <h1 className="text-4xl md:text-5xl font-semibold mb-8 text-primary">
              Hello, {user.username.split(' ')[0]}
          </h1>
        )}
        
        {(isProcessing || isSendingMessage) && (
          <div className="flex flex-col items-center justify-center mb-8">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">AI is thinking...</p>
          </div>
        )}
        
      </div>

      <div className="w-full max-w-3xl sticky bottom-0 pb-4 md:pb-6 px-2">
        <ChatInput
          onSendMessage={handleStartChat} 
          isSending={isProcessing || isSendingMessage}
          placeholder="Ask C3L1KD GPT to start a new session..."
        />
      </div>
    </main>
  );
}
