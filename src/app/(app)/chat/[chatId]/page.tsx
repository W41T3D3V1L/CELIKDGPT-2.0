
"use client";

import { useParams, useRouter } from 'next/navigation';
import { useChat } from '@/contexts/ChatContext';
import { ChatMessageList } from '@/components/chat/ChatMessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { AlertTriangle, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/layout/LoadingScreen';

export default function ChatSessionPage() {
  const params = useParams();
  const router = useRouter();
  const chatIdFromUrl = typeof params.chatId === 'string' ? params.chatId : undefined;
  
  const { 
    getChatSession, 
    sendMessage, 
    isSendingMessage, 
    activeChatId, // Context's notion of active chat
    isSessionsLoading,
    createNewChat 
  } = useChat();

  const chatSession = chatIdFromUrl ? getChatSession(chatIdFromUrl) : undefined;

  // Primary loading conditions:
  // 1. Sessions are globally loading.
  // 2. We don't have a chat ID from the URL yet.
  // 3. We have a chat ID from URL, it matches the context's activeChatId,
  //    BUT the session data itself isn't available in `chatSessions` yet.
  //    This covers the transition period when clicking a chat in the sidebar.
  const isLoadingChat = isSessionsLoading || 
                        !chatIdFromUrl || 
                        (chatIdFromUrl && chatIdFromUrl === activeChatId && !chatSession);

  if (isLoadingChat) {
    return <LoadingScreen message="Loading chat..." fullPage={false} />;
  }

  // If, after all loading/transition checks, chatSession is still null, then it's truly not found.
  if (!chatSession) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-background">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold text-destructive mb-2">Chat Not Found</h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          The requested chat session (ID: {chatIdFromUrl || 'N/A'}) does not exist or could not be loaded.
        </p>
        <Button onClick={() => {
          const newId = createNewChat(); 
          router.push(`/chat/${newId}`);
        }} variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <MessageSquarePlus className="mr-2 h-4 w-4" /> Start New Chat
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatMessageList messages={chatSession.messages} isSendingMessage={isSendingMessage} />
      
      <div className="mt-auto p-3 md:p-4 border-t border-border bg-background sticky bottom-0 z-10">
        <div className="w-full max-w-3xl mx-auto">
            <ChatInput 
              onSendMessage={(message) => sendMessage(chatSession.id, message)}
              isSending={isSendingMessage}
              placeholder={`Message ${chatSession.title}...`}
            />
        </div>
      </div>
    </div>
  );
}
