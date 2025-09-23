
'use client'

import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip"
import { Coffee, Tv } from "lucide-react"
<<<<<<< HEAD
import type { TeamMember } from "@/lib/data"

// This layout data is now static within the component
=======
import type { User } from "@/lib/data"


// Placeholder data for UI shell
const teamMembers: User[] = [
  { id: '1', name: 'Tarec', avatar: 'https://picsum.photos/seed/user1/200/200', status: 'office', role: 'Frontend Developer', department: 'Engineering', lastSeen: 'now', dnd: false, points: 1250, birthday: '1990-07-15', seat: 'A4', online: true, mood: 5 },
  { id: '3', name: 'Charlie Brown', avatar: 'https://picsum.photos/seed/user3/200/200', status: 'office', role: 'UI/UX Designer', department: 'Design', lastSeen: '5m ago', dnd: false, points: 1500, birthday: '1995-03-30', seat: 'B2', online: true, mood: 4 },
  { id: '4', name: 'Diana Miller', avatar: 'https://picsum.photos/seed/user4/200/200', status: 'office', role: 'Product Manager', department: 'Product', lastSeen: '15m ago', dnd: false, points: 1100, birthday: '1992-09-05', seat: 'C1', online: true, mood: 2 },
  { id: '7', name: 'George Clark', avatar: 'https://picsum.photos/seed/user7/200/200', status: 'office', role: 'DevOps Engineer', department: 'Engineering', lastSeen: 'now', dnd: true, points: 1300, birthday: '1989-08-25', seat: 'A3', online: true, mood: 3 },
];
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
const officeLayout = {
  grid: {
    rows: 12,
    cols: 20,
  },
  elements: [
    // Walls
    { id: 'wall-top', type: 'wall', gridArea: '1 / 1 / 2 / -1' },
    { id: 'wall-bottom', type: 'wall', gridArea: '-2 / 1 / -1 / -1' },
    { id: 'wall-left', type: 'wall', gridArea: '1 / 1 / -1 / 2' },
    { id: 'wall-right', type: 'wall', gridArea: '1 / -2 / -1 / -1' },
    { id: 'wall-meeting-room', type: 'wall', gridArea: '2 / 14 / 6 / 15' },

    // Areas
    { id: 'area-entrance', type: 'area', name: 'Eingang', gridArea: '12 / 9 / 13 / 13' },
    { id: 'area-lounge', type: 'area', name: 'Lounge', icon: 'Coffee', gridArea: '2 / 15 / 6 / 20' },
    { id: 'area-meeting-room', type: 'area', name: 'Meetingraum', icon: 'Tv', gridArea: '2 / 8 / 6 / 14' },

    // Desks
    { id: 'desk-a1', type: 'desk', seatId: 'A1', gridArea: '3 / 2 / 5 / 4' },
    { id: 'desk-a2', type: 'desk', seatId: 'A2', gridArea: '3 / 4 / 5 / 6' },
    { id: 'desk-a3', type: 'desk', seatId: 'A3', gridArea: '6 / 2 / 8 / 4' },
    { id: 'desk-a4', type: 'desk', seatId: 'A4', gridArea: '6 / 4 / 8 / 6' },
    { id: 'desk-b1', type: 'desk', seatId: 'B1', gridArea: '9 / 2 / 11 / 4' },
    { id: 'desk-b2', type: 'desk', seatId: 'B2', gridArea: '9 / 4 / 11 / 6' },
    { id: 'desk-b3', type: 'desk', seatId: 'B3', gridArea: '9 / 8 / 11 / 10' },
    { id: 'desk-b4', type: 'desk', seatId: 'B4', gridArea: '9 / 10 / 11 / 12' },
    { id: 'desk-c1', type: 'desk', seatId: 'C1', gridArea: '7 / 15 / 9 / 17', rotation: 90 },
    { id: 'desk-c2', type: 'desk', seatId: 'C2', gridArea: '7 / 17 / 9 / 19', rotation: 90 },
    { id: 'desk-c3', type: 'desk', seatId: 'C3', gridArea: '10 / 15 / 12 / 17', rotation: 90 },
    { id: 'desk-c4', type: 'desk', seatId: 'C4', gridArea: '10 / 17 / 12 / 19', rotation: 90 },
  ],
};
<<<<<<< HEAD

=======
// ---
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)

interface OfficeMapProps {
    interactive?: boolean;
    selectedSeat?: string | null;
    onSeatSelect?: (seat: string) => void;
    highlightedSeat?: string | null;
    members: TeamMember[];
}

const iconMap: {[key: string]: React.ElementType} = {
    Coffee: Coffee,
    Tv: Tv
};

export function OfficeMap({ interactive = false, selectedSeat, onSeatSelect, highlightedSeat, members }: OfficeMapProps) {
    
    const membersBySeat = members.reduce((acc, member) => {
        if (member.seat) {
            acc[member.seat] = member;
        }
        return acc;
    }, {} as {[key: string]: TeamMember});

    const renderElement = (el: any) => {
        const style = { gridArea: el.gridArea };

        switch (el.type) {
            case 'desk':
                const member = membersBySeat[el.seatId];
                const isSelected = selectedSeat === el.seatId;
                const isOccupied = !!member;
                const canSelect = interactive && !isOccupied;
                const isHighlighted = highlightedSeat === el.seatId;

                const deskContent = (
                    <div className="w-full h-full flex flex-col items-center justify-center relative">
                        {member ? (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Avatar className={cn("h-8 w-8 border-2 z-10", member.dnd ? "border-red-500" : "border-green-500")}>
                                            {member.avatar && <AvatarImage src={member.avatar} />}
                                            <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
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

                const commonClassNames = cn(
                    "bg-card border rounded-md flex items-center justify-center relative transition-all",
                    el.rotation === 90 && "rotate-90",
                    isHighlighted && "ring-2 ring-primary ring-offset-2 ring-offset-background z-20",
                );

                 if (interactive) {
                    return (
                        <button
                            key={el.id}
                            style={style}
                            className={cn(
                                commonClassNames,
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
                    <div key={el.id} style={style} className={commonClassNames}>
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
