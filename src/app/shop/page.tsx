
'use client'

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Coins, Coffee, Pizza, Headphones, CalendarOff, Armchair, Cookie, Loader2, Plus } from "lucide-react";
import type { ShopItem } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';
import { getTeamMember, getShopItems, purchaseShopItem } from '@/lib/team-api';
import { useToast } from '@/hooks/use-toast';
import { AddShopItemDialog } from '@/components/shop/add-shop-item-dialog';


const iconComponents: { [key: string]: React.ElementType } = {
    Coffee,
    Pizza,
    Headphones,
    CalendarOff,
    Armchair,
    Cookie
};

export default function ShopPage() {
    const { user, team } = useAuth();
    const { toast } = useToast();
    const [shopItems, setShopItems] = useState<ShopItem[]>([]);
    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchShopData = async () => {
        if (!user || !team) return;
        setLoading(true);
        try {
            const [items, member] = await Promise.all([
                getShopItems(team.id),
                getTeamMember(user.uid)
            ]);
            setShopItems(items);
            setPoints(member?.points || 0);
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Fehler beim Laden',
                description: 'Shop-Daten konnten nicht geladen werden.'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && team) {
            fetchShopData();
        } else {
            setShopItems([]);
            setPoints(0);
            setLoading(false);
        }
    }, [user, team]);

    const handlePurchase = async (item: ShopItem) => {
        if (!user || !team) return;
        try {
            await purchaseShopItem(user.uid, team.id, item);
            toast({
                title: 'Kauf erfolgreich!',
                description: `Du hast "${item.title}" für ${item.cost} Punkte gekauft.`
            });
            await fetchShopData(); // Refetch data to update points
        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : 'Unbekannter Fehler';
            toast({
                variant: 'destructive',
                title: 'Kauf fehlgeschlagen',
                description: errorMessage,
            });
        }
    }

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
        <div className="flex justify-between items-start flex-wrap gap-4">
            <PageHeader
                title="Prämien-Shop"
                description="Gib deine gesammelten Punkte für tolle Prämien aus."
            />
             <Button onClick={() => setIsDialogOpen(true)} disabled={!user}>
                <Plus />
                Angebot hinzufügen
            </Button>
        </div>


        <Alert className="bg-accent/10 border-accent/30">
            <Coins className="h-4 w-4" />
            <AlertTitle className="font-headline">Dein Punktestand</AlertTitle>
            <AlertDescription>
                <p className="text-2xl font-bold text-accent">{points.toLocaleString()} Punkte</p>
            </AlertDescription>
        </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopItems.map(item => {
            const Icon = iconComponents[item.icon] || Coins;
            const canAfford = points >= item.cost;
            return (
                <Card key={item.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="font-headline text-xl flex items-center gap-3">
                                <Icon className="h-6 w-6 text-primary" />
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
                        <Button className="w-full" disabled={!canAfford || !user} onClick={() => handlePurchase(item)}>
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
      <AddShopItemDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onItemAdded={fetchShopData} />
    </div>
  );
}
