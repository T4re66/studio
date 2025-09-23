
'use client'

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Coins, Coffee, Pizza, Headphones, CalendarOff, Armchair, Cookie } from "lucide-react";
import type { ShopItem } from '@/lib/data';


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
      </div>
    </div>
  );
}
