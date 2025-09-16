'use client'

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { teamMembers } from "@/lib/data";
import { Mic, Signal, Volume2, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/lib/data";

export default function WalkieTalkiePage() {
    const [selectedUser, setSelectedUser] = useState<User | null>(teamMembers[2]);
    const [isTalking, setIsTalking] = useState(false);
    const { toast } = useToast();

    const handleSelectUser = (user: User) => {
        if (user.status === 'away' || !user.online) {
            toast({
                variant: 'destructive',
                title: `${user.name.split(' ')[0]} ist nicht erreichbar`,
                description: "Du kannst nur Kollegen anfunken, die online und nicht abwesend sind.",
            })
            return;
        }
        setSelectedUser(user);
    }
    
    const handleTalk = () => {
        if (!selectedUser) return;
        setIsTalking(true);
        toast({
            title: `Spreche mit ${selectedUser.name.split(' ')[0]}...`,
            description: "Halte die Maustaste gedrückt. Dein Mikrofon ist jetzt aktiv.",
        })
    }

    const handleStopTalk = () => {
        setIsTalking(false);
    }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Walkie-Talkie"
        description="Sprich schnell und direkt mit einem Kollegen, der gerade online ist."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
            <CardHeader>
                <CardTitle>Online-Team</CardTitle>
                <CardDescription>Wähle einen Kollegen aus.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {teamMembers.map(user => (
                    <button 
                        key={user.id} 
                        className={cn(
                            "w-full text-left p-2 rounded-lg flex items-center gap-3 transition-colors",
                            user.id === selectedUser?.id ? "bg-primary/10" : "hover:bg-muted/50",
                            (user.status === 'away' || !user.online) && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => handleSelectUser(user)}
                    >
                         <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                             <div className={cn("absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-background", user.online ? 'bg-green-500' : 'bg-gray-400')} />
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.role}</p>
                        </div>
                         {(user.status !== 'away' && user.online) && <Signal className="h-5 w-5 text-green-500" />}
                    </button>
                ))}
            </CardContent>
        </Card>
        
        <Card className="md:col-span-2 flex flex-col items-center justify-center text-center p-8 bg-muted/30 min-h-[400px]">
            {selectedUser ? (
                 <>
                    <Avatar className="h-32 w-32 border-4 border-card mb-4">
                        <AvatarImage src={selectedUser.avatar} />
                        <AvatarFallback className="text-5xl">{selectedUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold font-headline">{selectedUser.name}</h2>
                    <p className="text-muted-foreground">{selectedUser.department}</p>
                    
                    <div className="my-8 w-24 h-24 rounded-full flex items-center justify-center transition-all"
                        style={{ background: isTalking ? `hsla(var(--primary), 0.3)`: `hsla(var(--muted))`}}>
                        <Button
                            size="icon"
                            className="h-20 w-20 rounded-full shadow-lg"
                            onMouseDown={handleTalk}
                            onMouseUp={handleStopTalk}
                            onTouchStart={handleTalk}
                            onTouchEnd={handleStopTalk}
                        >
                            <Mic className="h-10 w-10" />
                        </Button>
                    </div>

                    <p className="text-sm text-muted-foreground">Zum Sprechen gedrückt halten</p>
                </>
            ) : (
                <p className="text-muted-foreground">Wähle einen Kollegen, um ihn anzufunken.</p>
            )}
        </Card>

      </div>
    </div>
  );
}
