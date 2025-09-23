
'use client'

<<<<<<< HEAD
import { useState, useEffect, useMemo } from 'react';
=======
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
<<<<<<< HEAD
import { Coins, Coffee, Pizza, Headphones, CalendarOff, Armchair, Cookie, Loader2, Plus } from "lucide-react";
=======
import { Coins, Coffee, Pizza, Headphones, CalendarOff, Armchair, Cookie } from "lucide-react";
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
import type { ShopItem } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';
import { getShopItems, purchaseShopItem } from '@/lib/team-api';
import { useToast } from '@/hooks/use-toast';
import { AddShopItemDialog } from '@/components/shop/add-shop-item-dialog';


// Placeholder data for UI shell
const shopItems: ShopItem[] = [
    { id: 's1', title: 'Kaffee für eine Woche', description: 'Eine Woche lang kostenloser Kaffee aus der Büro-Barista-Maschine.', cost: 500, category: 'Essen & Trinken', icon: 'Coffee' },
    { id: 's2', title: 'Team-Pizza', description: 'Eine Pizza-Session für dich und dein unmittelbares Team.', cost: 2000, category: 'Essen & Trinken', icon: 'Pizza' },
    { id: 's3', title: 'Fokus-Kopfhörer', description: 'Hochwertige Noise-Cancelling-Kopfhörer für einen Tag ausleihen.', cost: 300, category: 'Büro-Vorteile', icon: 'Headphones' },
    { id: 's4', title: 'Ein Tag frei', description: 'Ein zusätzlicher bezahlter Urlaubstag. Muss mit dem Management abgestimmt werden.', cost: 10000, category: 'Freizeit', icon: 'CalendarOff' },
];
const points = 1250;

const iconComponents: { [key: string]: React.ElementType } = {
    Coffee,
    Pizza,
    Headphones,
    CalendarOff,
    Armchair,
    Cookie
};

export default function ShopPage() {
<<<<<<< HEAD
    const { user, team, teamMember, loading, isPreview, refetchTeam } = useAuth();
    const { toast } = useToast();
    const [shopItems, setShopItems] = useState<ShopItem[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const points = useMemo(() => teamMember?.points || 0, [teamMember]);

    const fetchShopData = async () => {
        if (!team) {
            setIsDataLoading(false);
            return;
        }

        setIsDataLoading(true);
        try {
            const items = await getShopItems(team.id);
            setShopItems(items);
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Fehler beim Laden',
                description: 'Shop-Daten konnten nicht geladen werden.'
            });
        } finally {
            setIsDataLoading(false);
        }
    };
=======
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)

    useEffect(() => {
        if (!loading) {
            fetchShopData();
        }
    }, [loading, team]);

    const handlePurchase = async (item: ShopItem) => {
        if (isPreview) {
            toast({
                title: 'Vorschau-Modus',
                description: `Im echten Modus hättest du "${item.title}" jetzt gekauft!`
            });
            return;
        }
        if (!user || !team) return;
        try {
            await purchaseShopItem(user.uid, team.id, item);
            toast({
                title: 'Kauf erfolgreich!',
                description: `Du hast "${item.title}" für ${item.cost} Punkte gekauft.`
            });
            await refetchTeam(); // Refetch data to update points in auth context
        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : 'Unbekannter Fehler';
            toast({
                variant: 'destructive',
                title: 'Kauf fehlgeschlagen',
                description: errorMessage,
            });
        }
    }

    if (loading || isDataLoading) {
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
<<<<<<< HEAD
                        <Button className="w-full" disabled={!canAfford || !user} onClick={() => handlePurchase(item)}>
=======
                        <Button className="w-full" disabled={points < item.cost}>
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
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
