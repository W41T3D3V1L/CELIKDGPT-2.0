
"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface RenameChatDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentTitle: string;
  onRename: (newTitle: string) => void;
}

export function RenameChatDialog({
  isOpen,
  onOpenChange,
  currentTitle,
  onRename,
}: RenameChatDialogProps) {
  const [newTitle, setNewTitle] = useState(currentTitle);

  useEffect(() => {
    if (isOpen) {
      setNewTitle(currentTitle); // Reset title when dialog opens
    }
  }, [isOpen, currentTitle]);

  const handleSave = () => {
    if (newTitle.trim() && newTitle.trim() !== currentTitle) {
      onRename(newTitle.trim());
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Rename Chat</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter a new name for this chat session.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="chat-name" className="text-right text-foreground">
              Name
            </Label>
            <Input
              id="chat-name"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="col-span-3 bg-input border-input focus:border-primary"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="border-input hover:bg-accent hover:text-accent-foreground">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
