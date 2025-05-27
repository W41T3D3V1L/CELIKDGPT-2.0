
"use client";

import type { Message } from '@/types/chat';
import { ChatMessage } from './ChatMessage';
import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Loader2 } from 'lucide-react'; // For empty state icon & loader
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ChatMessageListProps {
  messages: Message[];
  isSendingMessage?: boolean; // Optional, as it's only relevant for active chats
}

export function ChatMessageList({ messages, isSendingMessage }: ChatMessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const AI_AVATAR_URL = "https://cdn3d.iconscout.com/3d/premium/thumb/artificial-intelligence-virus-3d-icon-download-in-png-blend-fbx-gltf-file-formats--bug-ai-robotic-vol-1-pack-science-technology-icons-9197844.png?f=webp";


  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages, isSendingMessage]); // Also scroll when thinking indicator appears/disappears

  return (
    <ScrollArea className="flex-grow h-[calc(100%-100px)]" ref={scrollAreaRef}> {/* Adjusted height calc if input bar is taller */}
      <div className="p-4 md:p-6 space-y-4 max-w-3xl mx-auto" ref={viewportRef}> {/* Centered content */}
        {messages.length === 0 && !isSendingMessage && ( // Only show empty state if not loading first message
          <div className="text-center text-muted-foreground py-10 flex flex-col items-center">
            {/* Optional: Icon or larger message for empty state, Gemini is very minimal here */}
            {/* <Bot className="w-12 h-12 text-muted-foreground/50 mb-4" /> */}
            {/* <p className="text-lg">Start a new conversation.</p> */}
            {/* <p className="text-xs mt-1">Interactions are subject to Directive 7.0.</p> */}
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isSendingMessage && (
          <div
            className={cn(
              "flex w-full mb-6 justify-start"
            )}
          >
            <div
              className={cn(
                "flex flex-col",
                "max-w-[calc(100%-2rem)] sm:max-w-[80%] md:max-w-[75%]",
                "items-start"
              )}
            >
              <div className={cn(
                "flex items-center mb-1.5",
                "flex-row"
              )}>
                <Avatar className={cn(
                  "h-6 w-6 border-none flex-shrink-0",
                  "mr-2 bg-secondary"
                )}>
                  <AvatarImage src={AI_AVATAR_URL} alt="AI Avatar" data-ai-hint="bot ai virus"/>
                  <AvatarFallback className="bg-transparent text-muted-foreground">
                    <Bot className="h-3.5 w-3.5" />
                  </AvatarFallback>
                </Avatar>
                <span className={cn(
                  "text-sm font-medium",
                  "text-foreground"
                )}>
                  C3L1KD GPT
                </span>
              </div>

              <div
                className={cn(
                  "w-fit max-w-full p-3 rounded-lg text-sm leading-relaxed shadow-md",
                  "bg-card text-card-foreground rounded-tl-none flex items-center" 
                )}
              >
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-muted-foreground" />
                <span className="italic text-muted-foreground">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
