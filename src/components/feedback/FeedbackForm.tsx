
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';

const feedbackSchema = z.object({
  feedback: z.string().min(10, { message: "Feedback must be at least 10 characters long." }).max(1000, { message: "Feedback must be less than 1000 characters." }),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

interface FeedbackFormProps {
  onClose?: () => void;
}

const TARGET_EMAIL = "c3l1kd@xmpp.is";

export function FeedbackForm({ onClose }: FeedbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
  });

  const onSubmit: SubmitHandler<FeedbackFormValues> = async (data) => {
    setIsSubmitting(true);

    const subject = encodeURIComponent("Feedback for C3L1KD GPT");
    const body = encodeURIComponent(`User Feedback:\n\n${data.feedback}`);
    
    // Construct Gmail compose URL
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(TARGET_EMAIL)}&su=${subject}&body=${body}`;

    // Try to open Gmail compose URL in a new tab
    if (typeof window !== "undefined") {
        window.open(gmailComposeUrl, '_blank');
    }
    
    // Simulate submission delay for UX 
    // In a real app, this might not be needed if window.open is quick.
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Feedback Ready (via Gmail)",
      description: "A new tab for Gmail should have opened. Please review and send the email.",
    });
    
    reset();
    setIsSubmitting(false);
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
      <div>
        <Label htmlFor="feedback" className="text-sm font-medium text-foreground">
          Your Feedback
        </Label>
        <Textarea
          id="feedback"
          {...register('feedback')}
          placeholder="Tell us what you think or report an issue..."
          className="mt-1 bg-input border-border focus:border-primary min-h-[100px]"
          rows={4}
          disabled={isSubmitting}
        />
        {errors.feedback && (
          <p className="mt-1 text-xs text-destructive">{errors.feedback.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Send className="mr-2 h-4 w-4" />
        )}
        Submit Feedback
      </Button>
    </form>
  );
}
