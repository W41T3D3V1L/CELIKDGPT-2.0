
"use client";
// Removed ChatSidebar import as AppShell now handles sidebar content
import type React from 'react';
import { useAuth } from '@/contexts/AuthContext';
// Removed useChat import as sidebar visibility is handled by AppShell
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
// Removed cn import as it's no longer used for conditional class names here

export default function ChatSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  // Removed isChatSidebarVisible from useChat()
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    // This outer div is part of the AppShell's <main> content area when on chat pages
    // The AppShell itself provides its own persistent sidebar which now includes chat history.
    // The main content area for chat messages is now the direct child.
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Chat History Sidebar has been removed from here. 
          AppShell now renders ChatSidebar within its own main sidebar when on chat pages. */}
      
      {/* Main chat content area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background">
        {children}
      </main>
    </div>
  );
}
