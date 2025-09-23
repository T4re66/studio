
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FridgeItem, User } from "@/lib/data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// Placeholder data for UI shell
const teamMembers: User[] = [
  { id: '1', name: 'Tarec', avatar: 'https://picsum.photos/seed/user1/200/200', status: 'office', role: 'Frontend Developer', department: 'Engineering', lastSeen: 'now', dnd: false, points: 1250, birthday: '1990-07-15', seat: 'A4', online: true, mood: 5 },
  { id: '3', name: 'Charlie Brown', avatar: 'https://picsum.photos/seed/user3/200/200', status: 'office', role: 'UI/UX Designer', department: 'Design', lastSeen: '5m ago', dnd: false, points: 1500, birthday: '1995-03-30', seat: 'B2', online: true, mood: 4 },
];
// ---

interface FridgeCardProps {
  item: FridgeItem;
}

export function FridgeCard({ item }: FridgeCardProps) {
  const getStatus = (days: number): { label: string; className: string } => {
    if (days < 0) return { label: "Abgelaufen", className: "bg-status-red text-white" };
    if (days <= 1) return { label: "Heute", className: "bg-status-red text-white" };
    if (days <= 3) return { label: `${days} Tage`, className: "bg-status-yellow text-yellow-800" };
    return { label: `${days} Tage`, className: "bg-status-green/20 text-green-700" };
  };

  const status = getStatus(item.expiryDays);
  const owner = teamMembers.find(m => m.id === item.ownerId);

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-0 relative">
        <Image
          src={item.image}
          alt={item.name}
          width={400}
          height={300}
          className="aspect-video object-cover"
          data-ai-hint="food item"
        />
        <Badge className={cn("absolute top-3 right-3 border-none", status.className)}>
          {status.label}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <h3 className="font-semibold text-lg">{item.name}</h3>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center bg-muted/50">
        <div className="flex items-center gap-2">
            {owner ? (
                 <Avatar className="h-6 w-6">
                    <AvatarImage src={owner.avatar} alt={owner.name} />
                    <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
                </Avatar>
            ) : (
                 <Avatar className="h-6 w-6">
                    <AvatarFallback>T</AvatarFallback>
                </Avatar>
            )}
           
            <span className="text-xs text-muted-foreground">{item.owner}</span>
        </div>
        <span className="text-xs font-mono text-muted-foreground bg-white px-2 py-1 rounded-md border">
          Fach {item.shelf}
        </span>
      </CardFooter>
    </Card>
  );
}
