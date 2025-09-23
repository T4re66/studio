
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Phone, Video, Mic, Send } from "lucide-react";
import type { User } from "@/lib/data";

interface UserProfileDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusInfo: {
  [key in User['status']]: { label: string; className: string };
} = {
  office: { label: "Im Büro", className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" },
  remote: { label: "Remote", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" },
  away: { label: "Abwesend", className: "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300" },
};

const moodEmojis = ["😔", "😕", "😐", "🙂", "😄"];


export function UserProfileDialog({ user, open, onOpenChange }: UserProfileDialogProps) {
  if (!user) return null;

  const info = statusInfo[user.status];
  const moodEmoji = user.mood ? moodEmojis[user.mood - 1] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0">
        <div className="bg-muted/50 p-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-3 border-4 border-background">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-3xl">{user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-3">
              <DialogTitle className="font-headline text-2xl">{user.name}</DialogTitle>
              {moodEmoji && <span className="text-3xl" title={`Stimmung: ${moodEmoji}`}>{moodEmoji}</span>}
            </div>
            <DialogDescription>{user.role} &middot; {user.department}</DialogDescription>
            <Badge variant="outline" className={`mt-2 text-xs border-0 ${info.className}`}>
                {info.label} {user.seat && `(Tisch ${user.seat})`}
            </Badge>
            <div className="flex gap-2 mt-4">
                <Button size="icon"><Phone /></Button>
                <Button size="icon"><Video /></Button>
                <Button size="icon" variant="destructive"><Mic /></Button>
            </div>
        </div>

        <div className="p-4 space-y-4">
            <h3 className="font-semibold text-sm px-2">Chat</h3>
            <div className="h-64 flex flex-col space-y-3 overflow-y-auto p-2 bg-muted/50 rounded-lg">
                <div className="flex items-end gap-2">
                     <Avatar className="h-6 w-6"><AvatarImage src={user.avatar}/><AvatarFallback>{user.name.charAt(0)}</AvatarFallback></Avatar>
                     <div className="max-w-[75%] p-2 px-3 rounded-lg bg-background border">
                        <p className="text-sm">Hey, hast du kurz Zeit?</p>
                     </div>
                </div>
                 <div className="flex items-end gap-2 justify-end">
                     <div className="max-w-[75%] p-2 px-3 rounded-lg bg-primary text-primary-foreground">
                        <p className="text-sm">Klar, worum geht's?</p>
                     </div>
                </div>
            </div>
            <form className="flex gap-2">
                <Input 
                    placeholder="Nachricht schreiben..." 
                />
                <Button type="submit" size="icon">
                    <Send />
                </Button>
            </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
