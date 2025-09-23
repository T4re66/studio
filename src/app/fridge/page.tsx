
'use client'

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { PlusCircle, User, Users, Clock, Refrigerator, Loader2 } from "lucide-react"
import { AddItemDialog } from "@/components/fridge/add-item-dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FridgeCard } from "@/components/fridge/fridge-card"
import type { FridgeItem } from "@/lib/data"
import { useAuth } from "@/hooks/use-auth"
import { differenceInDays, parseISO } from "date-fns"

// In a real app, this would be fetched from Firestore.
const getFridgeItems = async (): Promise<FridgeItem[]> => {
  console.log("Fetching fridge items...");
  // Mocking a delay and returning empty as we don't have a backend yet.
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [];
};


export default function FridgePage() {
  const { user } = useAuth();
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (user) {
        const fetchItems = async () => {
            setLoading(true);
            const items = await getFridgeItems();
            setFridgeItems(items);
            setLoading(false);
        }
        fetchItems();
    } else {
        setFridgeItems([]);
        setLoading(false);
    }
  }, [user]);
  
  const getExpiryDays = (isoDate: string) => differenceInDays(parseISO(isoDate), new Date());

  const filters = {
    all: () => true,
    mine: (item: FridgeItem) => item.ownerId === user?.uid,
    expiring: (item: FridgeItem) => {
        const days = getExpiryDays(item.expiryDate);
        return days <= 3 && days >= 0;
    },
    shared: (item: FridgeItem) => item.ownerId === 'team',
  }

  const renderItems = (filter: (item: FridgeItem) => boolean) => {
    if (loading) {
        return (
            <div className="col-span-full flex justify-center items-center py-12 gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Lade Kühlschrankinhalt...</span>
            </div>
        );
    }
    const items = fridgeItems.filter(filter).sort((a,b) => getExpiryDays(a.expiryDate) - getExpiryDays(b.expiryDate));
    if (items.length === 0) {
      return <p className="text-muted-foreground col-span-full text-center py-12">Keine Artikel gefunden.</p>
    }
    return items.map((item) => <FridgeCard key={item.id} item={item} />)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <PageHeader
          title="Kühlschrank"
          description="Behalte den Überblick über deine Lebensmittel und die des Teams."
        />
        <Button onClick={() => setIsDialogOpen(true)} disabled={!user}>
          <PlusCircle />
          Artikel hinzufügen
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="all"><Refrigerator/>Alle</TabsTrigger>
          <TabsTrigger value="mine"><User/>Mir gehört</TabsTrigger>
          <TabsTrigger value="expiring"><Clock/>Läuft bald ab</TabsTrigger>
          <TabsTrigger value="shared"><Users/>Geteilt</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {renderItems(filters.all)}
        </TabsContent>
        <TabsContent value="mine" className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {renderItems(filters.mine)}
        </TabsContent>
        <TabsContent value="expiring" className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {renderItems(filters.expiring)}
        </TabsContent>
        <TabsContent value="shared" className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {renderItems(filters.shared)}
        </TabsContent>
      </Tabs>

      <AddItemDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onAddItem={() => {}}/>
    </div>
  )
}
