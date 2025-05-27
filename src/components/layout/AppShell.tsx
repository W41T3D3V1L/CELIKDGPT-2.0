
"use client";

import type React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useEffect, useState } from 'react';
import { Loader2, LogOut, Moon, Sun, Settings, Menu, Wand2, Edit3, History, PanelLeft, Smartphone, UserCircle, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import logo from '@/assets/logo.png'; // Assuming you have a logo in your assets
// Removed FeedbackButton import as it's now integrated into ChatInput

// Primary navigation items for the AppShell sidebar (non-chat view)
const appShellNavItems = [
  { href: '/dashboard', label: 'Explore', icon: Wand2 },
];

const appShellSecondaryNavItems = [
   { href: '/settings', label: 'Settings', icon: Settings },
];

// const NEW_LOGO_URL = "https://github.com/user-attachments/assets/abdf8382-b8d4-4319-8af1-1880156a1dac";


export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading: authLoading } = useAuth();
  const {
    chatSessions,
    activeChatId,
    setActiveChatId,
    isSessionsLoading
  } = useChat();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const isChatPageActive = pathname.startsWith('/chat');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    console.log("AppShell Effect Triggered. Pathname:", pathname, "User:", !!user, "AuthLoading:", authLoading, "SessionsLoading:", isSessionsLoading, "IsChatPageActive:", isChatPageActive, "ActiveChatId:", activeChatId);
    if (authLoading) {
      console.log("AppShell Effect: Auth loading, returning.");
      return;
    }

    if (!user && pathname !== '/login' && !pathname.startsWith('/_next/')) {
      if (pathname !== '/login') {
        console.log("AppShell Effect: No user, not on /login. Redirecting to /login.");
        router.replace('/login');
      }
      return;
    }

    if (user) {
      if (isChatPageActive && isSessionsLoading) {
        console.log("AppShell Effect: User exists, on chat page, but sessions loading. Returning.");
        return;
      }

      if (isChatPageActive) {
        const pathParts = pathname.split('/');
        const chatIdFromUrl = pathParts.length === 3 && pathParts[1] === 'chat' ? pathParts[2] : undefined;

        if (chatIdFromUrl) {
          const chatSessionExists = chatSessions.some(s => s.id === chatIdFromUrl);
          if (chatSessionExists) {
            if (activeChatId !== chatIdFromUrl) {
              console.log(`AppShell Effect: Syncing activeChatId. URL: ${chatIdFromUrl}, Context: ${activeChatId}. Setting to ${chatIdFromUrl}`);
              setActiveChatId(chatIdFromUrl);
            }
          } else {
            console.log(`AppShell Effect: Chat session ${chatIdFromUrl} from URL not found.`);
            let redirectTo = '/chat';

            const validActiveChatExists = activeChatId && chatSessions.some(s => s.id === activeChatId);

            if (validActiveChatExists && activeChatId !== chatIdFromUrl) {
                redirectTo = `/chat/${activeChatId}`;
            } else if (chatSessions.length > 0 && (!activeChatId || !chatSessions.some(s => s.id === activeChatId))) {
                 redirectTo = `/chat/${chatSessions[0].id}`;
            }

            if (pathname !== redirectTo) {
              console.log(`AppShell Effect: Redirecting from invalid chat URL ${pathname} to ${redirectTo}.`);
              router.replace(redirectTo);
            } else if (pathname === '/chat' && activeChatId && !chatSessions.some(s => s.id === activeChatId)) {
               console.log(`AppShell Effect: On /chat and activeChatId ${activeChatId} is also invalid, setting to null.`);
               setActiveChatId(null);
            }
          }
        } else if (pathname === '/chat') { // User is on /chat page itself
          // If there's an activeChatId that isn't valid, or no activeChatId but chats exist,
          // we might want to clear activeChatId to reflect the "new chat" state.
          // Or, if an activeChatId is set but doesn't exist in chatSessions, clear it.
          if (activeChatId && !chatSessions.some(s => s.id === activeChatId)) {
            console.log(`AppShell Effect: On /chat, activeChatId ${activeChatId} is invalid, clearing.`);
            setActiveChatId(null);
          }
          // No redirect is necessary if just on /chat; the page handles its own content.
        }
      }
    }
  }, [pathname, user, authLoading, router, chatSessions, activeChatId, setActiveChatId, isSessionsLoading, isChatPageActive]);


  if (authLoading || (!user && pathname !== '/login' && !pathname.startsWith('/_next/'))) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const NavItemContent = ({ label, icon: Icon }: {label: string, icon: React.ElementType}) => (
    <>
      <Icon className={cn("h-5 w-5 flex-shrink-0", isSidebarCollapsed && !isMobile ? "mx-auto" : "mr-3")} />
      {(!isSidebarCollapsed || isMobile) && <span className="truncate">{label}</span>}
    </>
  );

  const NavLink = ({ href, label, icon: Icon, onClick, variant = "ghost", disabled = false }: { href?: string; label: string; icon: React.ElementType; onClick?: () => void; variant?: "ghost" | "default" | "secondary"; disabled?: boolean }) => {
    const commonClasses = cn(
      "w-full flex items-center text-sm font-medium rounded-md transition-colors duration-150 ease-in-out",
      "text-sidebar-foreground",
      variant === "ghost" && "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      variant === "default" && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
      pathname === href && variant === "ghost" && "bg-sidebar-accent text-sidebar-accent-foreground",
      isSidebarCollapsed && !isMobile ? "justify-center px-2 py-2 h-9 w-9" : "px-3 py-2 h-9",
      disabled && "opacity-50 cursor-not-allowed"
    );

    const content = <NavItemContent label={label} icon={Icon} />;

    const itemElement = href && !disabled ? (
      <Link href={href} className={commonClasses} onClick={onClick}>
        {content}
      </Link>
    ) : (
      <button className={commonClasses} onClick={onClick} disabled={disabled}>
        {content}
      </button>
    );

    if (isSidebarCollapsed && !isMobile && !disabled) {
      return (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>{itemElement}</TooltipTrigger>
            <TooltipContent side="right" sideOffset={5} className="bg-popover text-popover-foreground border-border shadow-md">
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return itemElement;
  };

  const handleGlobalNewChat = () => {
    // This will navigate to /chat page where user can type first message
    // Or, if on /chat already, it ensures the active chat context might be cleared
    if (pathname !== '/chat') {
      router.push('/chat');
    } else {
      // If already on /chat, ensure activeChatId is null to reflect "new chat" state.
      // The /chat page itself handles starting a new chat when a message is entered.
      if(activeChatId !== null) setActiveChatId(null);
    }
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };


  const renderSidebarContent = (isMobileSheet: boolean = false) => {
    const currentIsCollapsed = isMobileSheet ? false : isSidebarCollapsed;

    if (isChatPageActive) {
      return <ChatSidebar isCollapsed={currentIsCollapsed} />;
    }

    return (
      <div className="flex flex-col h-full bg-sidebar-background text-sidebar-foreground p-2 space-y-2">
         <div className={cn("flex items-center border-b border-sidebar-border pb-2 mb-1", currentIsCollapsed ? "justify-center h-[50px]" : "justify-start h-[50px] px-1")}>
            {!currentIsCollapsed && (
                <Link href="/dashboard" className="flex items-center gap-2 shrink-0" onClick={() => isMobileSheet && setMobileMenuOpen(false)}>
                 <Image src={logo} alt="C3L1KD GPT Logo" width={28} height={28} className="rounded-sm" data-ai-hint="app logo"/>
                 <h1 className="text-lg font-semibold text-foreground">C3L1KD GPT</h1>
                </Link>
            )}
             {currentIsCollapsed && (
                <Link href="/dashboard" className="flex items-center justify-center shrink-0 h-full" onClick={() => isMobileSheet && setMobileMenuOpen(false)}>
                    <Image src={NEW_LOGO_URL} alt="C3L1KD GPT Logo" width={28} height={28} className="rounded-sm" data-ai-hint="app logo"/>
                </Link>
            )}
            </div>
            <NavLink
              onClick={handleGlobalNewChat}
              label="New Chat"
              icon={MessageSquarePlus}
              variant="default"
            />
            <nav className="flex-grow space-y-1 mt-2">
              {appShellNavItems.map(item => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  onClick={() => isMobileSheet && setMobileMenuOpen(false)}
                />
              ))}
            </nav>
            <div className="mt-auto space-y-1">
              {appShellSecondaryNavItems.map(item => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  onClick={() => isMobileSheet && setMobileMenuOpen(false)}
                />
              ))}
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span tabIndex={0} className={cn("block w-full", currentIsCollapsed && !isMobileSheet ? "flex justify-center" : "")}>
                       <NavLink
                        label="Get App"
                        icon={Smartphone}
                        onClick={() => { if (isMobileSheet) setMobileMenuOpen(false); }}
                        disabled={true}
                       />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side={currentIsCollapsed && !isMobileSheet ? "right" : "top"} sideOffset={5} className="bg-popover text-popover-foreground border-border shadow-md">
                    <p>Coming soon</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <button className={cn(
                      "w-full flex items-center text-sm font-medium rounded-md transition-colors duration-150 ease-in-out text-sidebar-foreground",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      currentIsCollapsed ? "justify-center px-2 py-2 h-9 w-9" : "px-3 py-2 h-9 justify-start"
                    )}>
                    <Avatar className={cn("h-6 w-6 flex-shrink-0", currentIsCollapsed ? "" : "mr-2.5")}>
                      <AvatarImage src={user?.avatar} alt={user?.username} data-ai-hint="user profile placeholder"/>
                      <AvatarFallback className="text-xs">{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {!currentIsCollapsed && <span className="truncate">{user?.username}</span>}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side={currentIsCollapsed && !isMobileSheet ? "right" : "top"} sideOffset={currentIsCollapsed && !isMobileSheet ? 10 : 5} className="min-w-[180px] bg-popover text-popover-foreground border-border shadow-xl">
                  <DropdownMenuLabel className="text-muted-foreground px-2 py-1.5 text-xs">{user?.username}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50"/>
                  <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="cursor-pointer focus:bg-accent focus:text-accent-foreground text-sm">
                    {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                    Toggle Theme
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { logout(); if (isMobileSheet) setMobileMenuOpen(false);}} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer text-sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
      </div>
    );
  };


  return (
    <div className="flex h-screen bg-background text-foreground">
      {!isMobile && (
        <aside className={cn(
          "flex flex-col border-r border-sidebar-border bg-sidebar-background transition-all duration-200 ease-in-out",
          isSidebarCollapsed ? "w-14" : "w-60 lg:w-72"
        )}>
          {user && renderSidebarContent(false)}
        </aside>
      )}

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-sidebar-background text-sidebar-foreground border-r-0">
           {user && renderSidebarContent(true)}
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col overflow-hidden">
        {user && (
          <header className="h-14 flex items-center justify-between border-b border-border bg-background sticky top-0 z-20 px-4">
            <div className="flex items-center gap-1">
              {isMobile ? (
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} className="md:hidden h-8 w-8">
                  <Menu className="h-5 w-5" />
                </Button>
              ) : (
                  <Button variant="ghost" size="icon" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="h-8 w-8">
                     {isSidebarCollapsed ? <PanelLeft className="h-5 w-5" /> : <History className="h-5 w-5" />}
                  </Button>
              )}
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
              {/* Can add a mobile-specific title or logo here if needed */}
            </div>

            <div className="flex items-center gap-2">
               {isMobile && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={user.avatar} alt={user.username} data-ai-hint="user profile placeholder"/>
                          <AvatarFallback className="text-xs">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[180px] bg-popover text-popover-foreground border-border shadow-xl">
                      <DropdownMenuLabel className="text-muted-foreground px-2 py-1.5 text-xs">{user.username}</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-border/50"/>
                      <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="cursor-pointer focus:bg-accent focus:text-accent-foreground text-sm">
                        {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                        Toggle Theme
                      </DropdownMenuItem>
                       <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer text-sm">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
            </div>
          </header>
        )}
        <main className={cn(
          "flex-1 flex flex-col overflow-hidden bg-background",
        )}>
          <div className="flex-1 overflow-y-auto">
            {mounted ? children : <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
          </div>
        </main>
      </div>
      {/* Removed global FeedbackButton, it's now in ChatInput */}
      {/* {user && mounted && <FeedbackButton />} */}
    </div>
  );
}
