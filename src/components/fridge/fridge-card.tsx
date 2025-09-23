
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FridgeItem } from "@/lib/data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { differenceInDays, parseISO } from "date-fns";

interface FridgeCardProps {
  item: FridgeItem;
}

export function FridgeCard({ item }: FridgeCardProps) {
  const expiryDays = differenceInDays(parseISO(item.expiryDate), new Date());

  const getStatus = (days: number): { label: string; className: string } => {
    if (days < 0) return { label: "Abgelaufen", className: "bg-status-red text-white" };
    if (days === 0) return { label: "Heute", className: "bg-status-red text-white" };
    if (days <= 3) return { label: `${days} Tage`, className: "bg-status-yellow text-yellow-800" };
    return { label: `${days} Tage`, className: "bg-status-green/20 text-green-700" };
  };

  const status = getStatus(expiryDays);

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-0 relative">
        <Image
          src={item.imageUrl}
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
            <Avatar className="h-6 w-6">
                <AvatarFallback>{item.ownerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{item.ownerName}</span>
        </div>
        <span className="text-xs font-mono text-muted-foreground bg-white px-2 py-1 rounded-md border">
          Fach {item.shelf}
        </span>
      </CardFooter>
    </Card>
  );
}
