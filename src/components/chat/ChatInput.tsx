
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizonal, Loader2, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger as PopoverTriggerPrimitive,
} from '@/components/ui/popover';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';
import Image from 'next/image';

const BOT_IMAGE_URL = "https://media1.giphy.com/avatars/acetech/RK67baKq9A79.gif";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isSending: boolean;
  placeholder?: string;
}

export function ChatInput({ onSendMessage, isSending, placeholder = "Message C3L1KD GPT..." }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [feedbackPopoverOpen, setFeedbackPopoverOpen] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || isSending) return;
    await onSendMessage(message);
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);


  return (
    <form
      onSubmit={handleSubmit}
      className="w-full relative"
    >
      <div className={cn(
        "flex items-end p-2 gap-2 rounded-xl bg-card shadow-md border border-border focus-within:border-primary/70 transition-all",
        "min-h-[52px]"
      )}>
        <Popover open={feedbackPopoverOpen} onOpenChange={setFeedbackPopoverOpen}>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTriggerPrimitive asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground p-0 self-end mb-0.5 flex-shrink-0" // Align with bottom of textarea
                    aria-label="Provide feedback"
                  >
                    <Image
                      src={BOT_IMAGE_URL}
                      alt="Feedback Bot"
                      width={24}
                      height={24}
                      className="rounded-full"
                      data-ai-hint="feedback bot animated"
                    />
                  </Button>
                </PopoverTriggerPrimitive>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-popover text-popover-foreground border-border shadow-md">
                <p>Help</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <PopoverContent
            side="top"
            align="start" // Changed to start to align with left-positioned button
            className="w-80 md:w-96 p-4 bg-card border-border shadow-xl rounded-lg mb-2"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-card-foreground">Provide Feedback</h3>
              <Button variant="ghost" size="sm" onClick={() => setFeedbackPopoverOpen(false)} className="text-muted-foreground hover:text-foreground -mr-2">Close</Button>
            </div>
            <FeedbackForm onClose={() => setFeedbackPopoverOpen(false)} />
          </PopoverContent>
        </Popover>

        <Textarea
          ref={textareaRef}
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className={cn(
            "flex-grow resize-none bg-transparent border-none focus:ring-0 text-sm p-2 focus-visible:ring-0 focus-visible:ring-offset-0",
            "min-h-[24px] max-h-[150px] self-center leading-relaxed"
          )}
          disabled={isSending}
        />
        <div className="flex items-center gap-1 flex-shrink-0 self-end pb-1">
          {/* Paperclip icon remains on the right */}
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    disabled
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Add attachment (Coming soon)</span>
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-popover text-popover-foreground border-border shadow-md">
                <p>Coming soon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            type="submit"
            size="icon"
            disabled={isSending || !message.trim()}
            className="h-8 w-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md"
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
