
"use client";

import type { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, Copy, Edit2, ThumbsUp, ThumbsDown, ClipboardCopy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';


interface ChatMessageProps {
  message: Message;
}

// Helper component for syntax highlighting with copy button
interface HighlightedCodeBlockProps {
  language: string;
  code: string;
}

function HighlightedCodeBlock({ language, code }: HighlightedCodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const trimmedCode = code.trim();

  if (!trimmedCode) {
    return (
      <div className="my-2 bg-muted/30 rounded-md overflow-hidden shadow-inner border border-border/50">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language || 'plaintext'}
          PreTag="div"
          className="!bg-transparent !p-3 !text-sm custom-scrollbar" 
        >
          {trimmedCode || ''}
        </SyntaxHighlighter>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(trimmedCode).then(() => {
      setIsCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error("Failed to copy text: ", err);
      toast({ title: "Failed to copy", variant: "destructive" });
    });
  };

  return (
    <div className="my-2 bg-muted/30 rounded-md overflow-hidden shadow-inner border border-border/50">
      <div className="flex justify-between items-center px-3 py-1.5 bg-muted/40 border-b border-border">
        <span className="text-xs text-muted-foreground font-medium capitalize">{language || 'code'}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <ClipboardCopy className="h-4 w-4" />}
        </Button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        className="!bg-transparent !p-3 !text-sm custom-scrollbar"
      >
        {String(trimmedCode).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
}


export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const { toast } = useToast();

  const AI_AVATAR_URL = "https://cdn3d.iconscout.com/3d/premium/thumb/artificial-intelligence-virus-3d-icon-download-in-png-blend-fbx-gltf-file-formats--bug-ai-robotic-vol-1-pack-science-technology-icons-9197844.png?f=webp";


  const MarkdownCodeBlock = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '').trim();

    if (!inline) { 
      if (match) { 
        return <HighlightedCodeBlock language={match[1]} code={codeString} />;
      } else {
        // Check if it's intended as a "chip" (no language, triple-backticked, single line, specific content pattern)
        const isPotentialChip = !codeString.includes('\n') && codeString.length > 0 && codeString.length < 50;

        if (isPotentialChip) {
          return (
            <code
              className="inline-block bg-input text-card-foreground px-2 py-0.5 rounded-md text-xs font-mono my-0.5 shadow-sm border border-border"
              {...props}
            >
              {codeString}
            </code>
          );
        }
        // Fallback for other non-highlighted BLOCK code (generic pre/code)
        return (
            <pre className="my-2 p-3 bg-muted/30 rounded-md overflow-x-auto text-sm font-mono text-foreground shadow-inner custom-scrollbar" {...props}>
                <code>{children}</code>
            </pre>
        );
      }
    } else { 
      return <code className="font-bold text-accent" {...props}>{children}</code>;
    }
  };

  const handleCopyMessageText = () => {
    let textToCopy = message.text;
    if (message.structuredContent?.code) {
      textToCopy = `Code:\n${message.structuredContent.code.trim()}\n\nExplanation:\n${message.text || ''}`;
    } else if (message.text) {
      textToCopy = message.text;
    } else {
      textToCopy = "[No content to copy]";
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({ title: "Message content copied!" });
    }).catch(err => {
      console.error("Failed to copy message: ", err);
      toast({ title: "Failed to copy message", variant: "destructive" });
    });
  };

  const markdownProseClasses = "prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-pre:my-0 prose-strong:font-medium prose-headings:font-semibold prose-code:font-normal prose-code:text-sm";


  return (
    <div
      className={cn(
        "flex w-full mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex flex-col",
          "max-w-[calc(100%-2rem)] sm:max-w-[80%] md:max-w-[75%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div className={cn(
          "flex items-center mb-1.5",
          isUser ? "flex-row-reverse" : "flex-row"
        )}>
          <Avatar className={cn(
            "h-6 w-6 border-none flex-shrink-0",
            isUser ? "ml-2 bg-primary/20 text-primary" : "mr-2 bg-secondary"
          )}>
            {isUser ? (
              <AvatarFallback className="bg-transparent text-xs font-semibold">
                {message.userName ? message.userName.charAt(0).toUpperCase() : <User className="h-3.5 w-3.5" />}
              </AvatarFallback>
            ) : (
              <>
                <AvatarImage src={AI_AVATAR_URL} alt="AI Avatar" data-ai-hint="bot ai virus"/>
                <AvatarFallback className="bg-transparent text-muted-foreground">
                  <Bot className="h-3.5 w-3.5" />
                </AvatarFallback>
              </>
            )}
          </Avatar>
          <span className={cn(
            "text-sm font-medium",
            "text-foreground"
          )}>
            {isUser ? "You" : "C3L1KD GPT"}
          </span>
        </div>

        <div
          className={cn(
            "w-fit max-w-full p-3 rounded-lg text-sm leading-relaxed shadow-md",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-none"
              : "bg-card text-card-foreground rounded-tl-none"
          )}
        >
          {message.structuredContent?.code ? (
            <>
              <HighlightedCodeBlock
                language={message.structuredContent.language || 'plaintext'}
                code={message.structuredContent.code}
              />
              {message.text && ( 
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className={cn(markdownProseClasses, "mt-2")}
                  components={{
                    code: MarkdownCodeBlock,
                    p: ({node, ...props}) => <div {...props} /> 
                  }}
                  unwrapDisallowed={true}
                >
                  {message.text}
                </ReactMarkdown>
              )}
            </>
          ) : message.text === "" && !isUser ? (
            <span className="italic text-muted-foreground">[AI response is empty]</span>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: MarkdownCodeBlock,
                p: ({node, ...props}) => <div {...props} />
              }}
              className={markdownProseClasses}
              unwrapDisallowed={true}
            >
              {message.text}
            </ReactMarkdown>
          )}
        </div>

        {!isUser && (message.text || (message.structuredContent?.code && message.structuredContent.code.trim() !== '')) && (
          <div className="mt-2 flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-accent-foreground hover:bg-accent/50" onClick={handleCopyMessageText} aria-label="Copy message text">
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-accent-foreground hover:bg-accent/50" aria-label="Thumbs up">
              <ThumbsUp className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-accent-foreground hover:bg-accent/50" aria-label="Thumbs down">
              <ThumbsDown className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-accent-foreground hover:bg-accent/50" aria-label="Edit response (not implemented)">
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
