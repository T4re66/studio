'use client'

import { officeLayout, teamMembers } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip"
import { Armchair, Coffee, Tv } from "lucide-react"

interface OfficeMapProps {
    interactive?: boolean;
    selectedSeat?: string | null;
    onSeatSelect?: (seat: string) => void;
}

const iconMap: {[key: string]: React.ElementType} = {
    Coffee: Coffee,
    Tv: Tv
};

export function OfficeMap({ interactive = false, selectedSeat, onSeatSelect }: OfficeMapProps) {
    
    const membersBySeat = teamMembers.reduce((acc, member) => {
        if (member.seat) {
            acc[member.seat] = member;
        }
        return acc;
    }, {} as {[key: string]: typeof teamMembers[0]});

    const renderElement = (el: any) => {
        const style = { gridArea: el.gridArea };

        switch (el.type) {
            case 'desk':
                const member = membersBySeat[el.seatId];
                const isSelected = selectedSeat === el.seatId;
                const isOccupied = !!member;
                const canSelect = interactive && !isOccupied;

                const deskContent = (
                    <div className="w-full h-full flex flex-col items-center justify-center relative">
                        {member ? (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Avatar className={cn("h-8 w-8 border-2 z-10", member.dnd ? "border-red-500" : "border-green-500")}>
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
                           <div className="absolute inset-1 rounded bg-muted-foreground/10 z-0"></div>
                        )}
                        <span className="absolute bottom-1 right-2 text-[10px] font-mono text-muted-foreground/70 z-10">{el.seatId}</span>
                    </div>
                );

                 if (interactive) {
                    return (
                        <button
                            key={el.id}
                            style={style}
                            className={cn(
                                "bg-card border rounded-md flex items-center justify-center relative transition-all",
                                el.rotation === 90 && "rotate-90",
                                canSelect && "cursor-pointer hover:bg-primary/10 hover:border-primary",
                                isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background z-20",
                                isOccupied && "cursor-not-allowed",
                            )}
                            onClick={() => canSelect && onSeatSelect?.(el.seatId)}
                            disabled={!canSelect}
                        >
                            {deskContent}
                        </button>
                    )
                }

                return (
                    <div key={el.id} style={style} className={cn("bg-card border rounded-md flex items-center justify-center relative", el.rotation === 90 && "rotate-90")}>
                       {deskContent}
                    </div>
                )

            case 'wall':
                return <div key={el.id} style={style} className="bg-muted-foreground/20 rounded-sm"></div>

            case 'area':
                const Icon = el.icon ? iconMap[el.icon] : null;
                return (
                    <div key={el.id} style={style} className="flex items-center justify-center gap-2 p-4 rounded-lg bg-muted/50 text-muted-foreground">
                        {Icon && <Icon className="h-6 w-6"/>}
                        <p className="font-medium text-sm">{el.name}</p>
                    </div>
                )

            default:
                return null;
        }
    }


    return (
        <div className="w-full bg-background p-4 sm:p-6 border rounded-xl shadow-inner">
            <div className="aspect-[16/10] grid gap-1" style={{
                gridTemplateColumns: `repeat(${officeLayout.grid.cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${officeLayout.grid.rows}, minmax(0, 1fr))`,
            }}>
                {officeLayout.elements.map(renderElement)}
            </div>
        </div>
    )
}
