
'use client'

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { shopItems, teamMembers } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Coins, Coffee, Pizza, Headphones, CalendarOff, Armchair, Cookie } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ShopItem } from '@/lib/data';

const iconComponents: { [key: string]: React.ElementType } = {
    Coffee,
    Pizza,
    Headphones,
    CalendarOff,
    Armchair,
    Cookie
};

export default function ShopPage() {
    // For demo purposes, we'll assume the current user is Tarec.
    const currentUser = teamMembers.find(m => m.id === '1');
    const [points, setPoints] = useState(currentUser?.points || 0);
    const { toast } = useToast();

    const handleBuy = (item: ShopItem) => {
        if (points >= item.cost) {
            setPoints(currentPoints => currentPoints - item.cost);
            toast({
                title: "Kauf erfolgreich!",
                description: `Du hast "${item.title}" für ${item.cost} Punkte gekauft.`,
            });
            // In a real app, you'd also update the user's points on the backend.
        } else {
            toast({
                variant: "destructive",
                title: "Nicht genügend Punkte",
                description: `Du benötigst ${item.cost} Punkte, hast aber nur ${points}.`,
            });
        }
    };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Prämien-Shop"
        description="Gib deine gesammelten Punkte für tolle Prämien aus."
      />

        <Alert className="bg-accent/10 border-accent/30">
            <Coins className="h-4 w-4" />
            <AlertTitle className="font-headline">Dein Punktestand</AlertTitle>
            <AlertDescription>
                <p className="text-2xl font-bold text-accent">{points.toLocaleString()} Punkte</p>
            </AlertDescription>
        </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopItems.map(item => {
            const Icon = iconComponents[item.icon];
            return (
                <Card key={item.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="font-headline text-xl flex items-center gap-3">
                                {Icon && <Icon className="h-6 w-6 text-primary" />}
                                {item.title}
                            </CardTitle>
                             <Badge variant="secondary">{item.category}</Badge>
                        </div>
                        <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <div className="text-2xl font-bold text-primary text-center p-4 bg-muted/50 rounded-lg">
                            {item.cost.toLocaleString()} Punkte
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => handleBuy(item)} disabled={points < item.cost}>
                            Kaufen
                        </Button>
                    </CardFooter>
                </Card>
            )
        })}
      </div>
    </div>
  );
}

