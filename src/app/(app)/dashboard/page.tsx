
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface DashboardFeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string; // href is now optional
  className?: string;
  disabled?: boolean;
  tooltipText?: string;
}

function DashboardFeatureCard({ title, description, icon, href, className, disabled = false, tooltipText = "Coming soon" }: DashboardFeatureCardProps) {
  const cardInnerContent = (
    <div className={cn( // Changed Card to div here to avoid issues with TooltipTrigger asChild and Card ref
      "flex flex-col items-center justify-center text-center p-6 bg-card shadow-lg rounded-xl h-full border", // Added border for consistency
      !disabled && "hover:bg-muted/50 transition-colors duration-200 ease-in-out transform hover:scale-[1.03]",
      disabled && "opacity-60 cursor-not-allowed",
      className
    )}>
      <CardHeader className="p-0 mb-4">
        <div className="p-3 rounded-lg bg-primary/10 inline-block">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col items-center">
        <CardTitle className="text-xl font-semibold text-foreground mb-1.5">{title}</CardTitle>
        <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
      </CardContent>
    </div>
  );

  if (disabled) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* The div acts as a non-interactive wrapper that TooltipTrigger can use */}
            <div className="h-full"> 
              {cardInnerContent}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-popover text-popover-foreground border-border shadow-md">
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link href={href!} passHref className="h-full"> {/* Ensure Link takes full height */}
      {cardInnerContent}
    </Link>
  );
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <header className="mb-10 md:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardFeatureCard
          title="C3L1KD GPT"
          description="Engage with advanced AI simulation under Directive 7.0."
          icon={<Bot className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />}
          href="/chat"
          className="sm:col-span-1" 
        />
        <DashboardFeatureCard
          title="Image Generation"
          description="Create stunning visuals with AI."
          icon={<ImageIcon className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />}
          href="/dashboard" // Href can be a placeholder since it's disabled
          className="sm:col-span-1"
          disabled={true}
          tooltipText="Coming soon"
        />
        {/* You can add more cards here if needed, adjusting the grid accordingly */}
      </div>
    </div>
  );
}
