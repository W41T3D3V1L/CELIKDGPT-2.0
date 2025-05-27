
"use client";

import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Loader2, Smartphone, UserCircle, MoreHorizontal, Edit3, FileEdit, ArrowLeft, MessageSquarePlus } from 'lucide-react'; // Added MessageSquarePlus
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { RenameChatDialog } from './RenameChatDialog';
import { DEFAULT_INITIAL_USER_MESSAGE } from '@/contexts/ChatContext';

const NEW_LOGO_URL = "https://github.com/user-attachments/assets/abdf8382-b8d4-4319-8af1-1880156a1dac";

interface ChatSidebarProps {
  isCollapsed?: boolean;
}

export function ChatSidebar({ isCollapsed = false }: ChatSidebarProps) {
  const {
    chatSessions,
    createNewChat,
    deleteChat,
    renameChatSession,
    activeChatId,
    isSessionsLoading
  } = useChat();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [renamingChatInfo, setRenamingChatInfo] = useState<{ id: string; currentTitle: string } | null>(null);

  const handleNewHackingChatClick = () => {
    const newChatId = createNewChat(DEFAULT_INITIAL_USER_MESSAGE);
    router.push(`/chat/${newChatId}`);
  };

  const handleStandardNewChatClick = () => {
    // Navigates to the page where user can type their first message
    // If already on /chat, this won't cause a hard reload but ensures correct state.
    if (pathname !== '/chat') {
      router.push('/chat');
    } else {
      // If already on /chat, one might want to clear the input or ensure activeChatId is null
      // For now, just ensures navigation for consistency.
    }
  };

  const handleSelectChat = (id: string) => {
    if (pathname !== `/chat/${id}`) {
      router.push(`/chat/${id}`);
    }
  };

  const openRenameDialog = (sessionId: string, currentTitle: string) => {
    setRenamingChatInfo({ id: sessionId, currentTitle });
    setIsRenameDialogOpen(true);
  };

  const handleRenameChat = (newTitle: string) => {
    if (renamingChatInfo) {
      renameChatSession(renamingChatInfo.id, newTitle);
    }
  };

  const SidebarButton = ({ onClick, href, icon: Icon, label, variant = "ghost", disabled = false, tooltipText }: { onClick?: () => void; href?: string; icon: React.ElementType; label: string; variant?: "ghost" | "default"; disabled?: boolean, tooltipText?: string }) => {
    const content = (
      <>
        <Icon className={cn(isCollapsed ? "h-5 w-5" : "h-4 w-4", "flex-shrink-0", !isCollapsed && "mr-2")} />
        {!isCollapsed && <span className="truncate">{label}</span>}
      </>
    );

    const buttonClasses = cn(
      "text-sidebar-foreground rounded-md text-sm flex items-center", // Ensure flex and items-center
      isCollapsed 
        ? "justify-center p-0 h-9 w-9" // Collapsed: square, no padding for icon button
        : "justify-start px-3 h-9 w-full", // Expanded: full width, with padding for label
      variant === "ghost" && "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      variant === "default" && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
      disabled && "opacity-50 cursor-not-allowed"
    );

    const buttonElement = href && !disabled? (
      <Link href={href} passHref legacyBehavior>
        <a className={buttonClasses} onClick={onClick}>
          {content}
        </a>
      </Link>
    ) : (
      <Button onClick={onClick} variant={variant} className={buttonClasses} disabled={disabled}>
        {content}
      </Button>
    );

    if (isCollapsed && label && !disabled) {
      return (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
            <TooltipContent side="right" sideOffset={5} className="bg-popover text-popover-foreground border-border shadow-md">
              <p>{tooltipText || label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return buttonElement;
  };


  return (
    <div className="h-full w-full flex flex-col text-sidebar-foreground p-2 space-y-2">
      <div className={cn("flex items-center gap-2 px-1.5 pt-1 pb-3 border-b border-sidebar-border", isCollapsed && "justify-center")}>
        <Image src={NEW_LOGO_URL} alt="C3L1KD GPT Logo" width={isCollapsed ? 28 : 24} height={isCollapsed ? 28 : 24} className="rounded-sm flex-shrink-0" data-ai-hint="app logo"/>
        {!isCollapsed && <h2 className="text-base font-semibold text-foreground truncate">C3L1KD GPT</h2>}
      </div>

      {/* Hacking button - commented out
      <SidebarButton
        onClick={handleNewHackingChatClick}
        icon={Edit3} // Using Edit3 for "Hacking"
        label="Hacking"
        variant="default"
      />
      */}
      
      {!isCollapsed && (
        <div className="px-1 py-1">
          <p className="text-xs font-medium text-muted-foreground">Today</p>
        </div>
      )}
      
      <SidebarButton
        onClick={handleStandardNewChatClick}
        icon={MessageSquarePlus}
        label="New Chat"
        variant={isCollapsed ? "default" : "ghost"}
      />


      <ScrollArea className="flex-grow -mx-2 mt-1">
        <div className="px-2">
          {isSessionsLoading ? (
             <div className="flex items-center justify-center h-24">
               <Loader2 className="h-5 w-5 animate-spin text-primary" />
             </div>
          ) : chatSessions.length === 0 ? (
            !isCollapsed && <p className="p-3 text-xs text-muted-foreground text-center">No recent chats.</p>
          ) : (
            <nav className="space-y-0.5">
              {chatSessions.map((session) => (
                <div key={session.id} className="group relative rounded-md">
                  <Button
                    variant={'ghost'}
                    className={cn(
                      "w-full justify-start text-left truncate h-8 rounded-md text-xs",
                      isCollapsed ? "px-0 justify-center" : "px-2.5", 
                      "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                       activeChatId === session.id && "bg-sidebar-accent text-sidebar-accent-foreground",
                       !isCollapsed && "pr-10" // Add padding for more_horiz only if not collapsed
                    )}
                    onClick={() => handleSelectChat(session.id)}
                    title={session.title}
                  >
                    {!isCollapsed ? (
                      <span className="truncate flex-grow">{session.title}</span>
                    ) : (
                      // For collapsed, maybe a generic icon or first letter.
                      // For now, showing first letter if title is short, else "..."
                       <span className="truncate flex-grow text-center text-xs">{session.title.substring(0,1).toUpperCase()}</span>
                    )}
                  </Button>
                  {!isCollapsed && (
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100 text-muted-foreground hover:text-foreground rounded-md"
                            aria-label="Chat options"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40 bg-popover border-border" side="bottom" align="end">
                          <DropdownMenuItem onClick={() => openRenameDialog(session.id, session.title)} className="cursor-pointer focus:bg-accent focus:text-accent-foreground">
                            <FileEdit className="mr-2 h-4 w-4" />
                            <span>Rename</span>
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-background border-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-foreground">Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                  This action cannot be undone. This will permanently delete this chat session: <br/> <strong className="break-all font-medium text-foreground">"{session.title}"</strong>.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-input hover:bg-accent hover:text-accent-foreground">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteChat(session.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          )}
        </div>
      </ScrollArea>

      <div className={cn(
          "mt-auto pt-2 border-t border-sidebar-border space-y-1", 
          isCollapsed && "space-y-1.5 flex flex-col items-center" 
        )}>
        <SidebarButton
          href="/dashboard"
          icon={ArrowLeft}
          label="Go to Dashboard"
          tooltipText="Dashboard"
        />
         <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className={cn("block w-auto")}>
                <SidebarButton
                  icon={Smartphone}
                  label="Get App"
                  disabled={true}
                />
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5} className="bg-popover text-popover-foreground border-border shadow-md">
              <p>Coming soon</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {user && (
          <SidebarButton
            icon={UserCircle}
            label={user.username.split(' ')[0]}
            tooltipText={user.username}
          />
        )}
      </div>
      {renamingChatInfo && (
        <RenameChatDialog
          isOpen={isRenameDialogOpen}
          onOpenChange={setIsRenameDialogOpen}
          currentTitle={renamingChatInfo.currentTitle}
          onRename={handleRenameChat}
        />
      )}
    </div>
  );
}
