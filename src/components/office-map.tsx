'use client'

import { officeLayout, teamMembers } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip"
import { Armchair, Coffee } from "lucide-react"

interface OfficeMapProps {
    interactive?: boolean;
    selectedSeat?: string | null;
    onSeatSelect?: (seat: string) => void;
}

export function OfficeMap({ interactive = false, selectedSeat, onSeatSelect }: OfficeMapProps) {
    
    const membersBySeat = teamMembers.reduce((acc, member) => {
        if (member.seat) {
            acc[member.seat] = member;
        }
        return acc;
    }, {} as {[key: string]: typeof teamMembers[0]});

    const renderDesk = (id: string) => {
        const member = membersBySeat[id];
        const isSelected = selectedSeat === id;
        const isOccupied = !!member;

        const canSelect = interactive && !isOccupied;

        const deskContent = (
             <div className="w-full h-full flex flex-col items-center justify-center">
                {member ? (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                 <Avatar className={cn("h-10 w-10 border-2", member.dnd ? "border-red-500" : "border-green-500")}>
                                    <AvatarImage src={member.avatar} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="font-semibold">{member.name}</p>
                                <p className="text-muted-foreground">{member.role}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ): (
                    <Armchair className="w-8 h-8 text-muted-foreground/50"/>
                )}
                <span className="text-xs font-mono text-muted-foreground mt-1">{id}</span>
            </div>
        )

        if (interactive) {
            return (
                <button
                    key={id}
                    className={cn(
                        "aspect-[3/4] bg-card border rounded-lg flex items-center justify-center relative overflow-hidden transition-all",
                        canSelect && "cursor-pointer hover:bg-primary/10 hover:border-primary",
                        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                        isOccupied && !interactive && "cursor-not-allowed opacity-70",
                    )}
                    onClick={() => canSelect && onSeatSelect?.(id)}
                    disabled={!canSelect}
                >
                    {deskContent}
                    {isOccupied && !interactive && <div className="absolute inset-0 bg-black/30"></div>}
                </button>
            )
        }

        return (
            <div key={id} className="aspect-[3/4] bg-card border rounded-lg flex items-center justify-center relative">
               {deskContent}
            </div>
        )
    }

    return (
        <div className="w-full bg-background p-6 border rounded-lg">
            <div className="flex flex-col gap-4">
                {officeLayout.rows.map((row, rowIndex) => {
                    if (row.type === 'desks') {
                        return (
                            <div key={rowIndex} className={`grid grid-cols-4 gap-4`}>
                                {Array.from({ length: row.count }).map((_, deskIndex) => {
                                    const deskId = `${row.id}${deskIndex + 1}`;
                                    return renderDesk(deskId);
                                })}
                            </div>
                        )
                    }
                    if (row.type === 'space') {
                        return <div key={rowIndex} style={{ height: row.size }}></div>
                    }
                    return null;
                })}
            </div>
             <div className="mt-8 flex items-center justify-center gap-2 p-4 rounded-lg bg-muted/50">
                <Coffee className="h-8 w-8 text-muted-foreground"/>
                <p className="font-medium text-muted-foreground">Kaffeeecke & Lounge</p>
             </div>
        </div>
    )
}
