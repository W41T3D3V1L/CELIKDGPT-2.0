
"use client";

// This component might be deprecated or reused if a global feedback button is needed
// on non-chat pages. For now, its functionality has been moved into ChatInput.tsx

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FeedbackForm } from './FeedbackForm';

const BOT_IMAGE_URL = "https://media1.giphy.com/avatars/acetech/RK67baKq9A79.gif";

export function FeedbackButton() {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          // className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg p-0 flex items-center justify-center bg-primary hover:bg-primary/90 z-50"
          // Example of how it might be used if it were a standalone fixed button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg p-0 flex items-center justify-center bg-primary hover:bg-primary/90 z-50"
          aria-label="Open feedback form"
        >
          <Image 
            src={BOT_IMAGE_URL} 
            alt="Feedback Bot" 
            width={40} 
            height={40} 
            className="rounded-full"
            data-ai-hint="feedback bot animated"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        side="top" 
        align="end" 
        className="w-80 md:w-96 p-4 bg-card border-border shadow-xl rounded-lg mb-2"
        onOpenAutoFocus={(e) => e.preventDefault()} 
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-card-foreground">Provide Feedback</h3>
           <Button variant="ghost" size="sm" onClick={() => setPopoverOpen(false)} className="text-muted-foreground hover:text-foreground -mr-2">Close</Button>
        </div>
        <FeedbackForm onClose={() => setPopoverOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
