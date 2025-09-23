
'use client'

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Coins, Coffee, Pizza, Headphones, CalendarOff, Armchair, Cookie, Loader2 } from "lucide-react";
import type { ShopItem } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';


// Placeholder for fetching shop items and user points from Firestore
const getShopData = async (): Promise<{ items: ShopItem[], userPoints: number }> => {
    return { items: [], userPoints: 0 };
}


const iconComponents: { [key: string]: React.ElementType } = {
    Coffee,
    Pizza,
    Headphones,
    CalendarOff,
    Armchair,
    Cookie
};

export default function ShopPage() {
    const { user } = useAuth();
    const [shopItems, setShopItems] = useState<ShopItem[]>([]);
    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            getShopData().then(({ items, userPoints }) => {
                setShopItems(items);
                setPoints(userPoints);
                setLoading(false);
            });
        } else {
            setShopItems([]);
            setPoints(0);
            setLoading(false);
        }
    }, [user]);

    if (loading) {
         return (
            <div className="flex flex-col gap-8">
                <PageHeader
                    title="Prämien-Shop"
                    description="Gib deine gesammelten Punkte für tolle Prämien aus."
                />
                <div className="flex justify-center items-center py-12 gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Lade Shop...</span>
                </div>
            </div>
        );
    }

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
                        <Button className="w-full" disabled={points < item.cost}>
                            Kaufen
                        </Button>
                    </CardFooter>
                </Card>
            )
        })}
        {shopItems.length === 0 && !loading && (
            <p className="text-muted-foreground col-span-full text-center py-12">
                Der Shop ist im Moment leer.
            </p>
        )}
      </div>
    </div>
  );
}
