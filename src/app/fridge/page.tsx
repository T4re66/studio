
'use client'

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { PlusCircle, User, Users, Clock, Refrigerator, Loader2 } from "lucide-react"
import { AddItemDialog } from "@/components/fridge/add-item-dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FridgeCard } from "@/components/fridge/fridge-card"
import type { FridgeItem, TeamMember } from "@/lib/data"
import { useAuth } from "@/hooks/use-auth"
import { getFridgeItems, addFridgeItem, getTeamMembers } from "@/lib/team-api"
import { differenceInDays, parseISO } from "date-fns"
import { useToast } from "@/hooks/use-toast"

export default function FridgePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchItems = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [items, members] = await Promise.all([getFridgeItems(), getTeamMembers()]);
        const itemsWithOwnerNames = items.map(item => {
            const owner = members.find(m => m.id === item.ownerId);
            return {
                ...item,
                ownerName: owner?.name || item.ownerId === 'team' ? 'Team' : 'Unbekannt'
            }
        });
        setFridgeItems(itemsWithOwnerNames);
        setTeamMembers(members);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Fehler', description: 'Kühlschrank-Inhalt konnte nicht geladen werden.' });
      } finally {
        setLoading(false);
      }
  }

  useEffect(() => {
    fetchItems();
  }, [user]);

  const handleAddItem = async (newItemData: { name: string, expiryDate: string }) => {
    if (!user) return;

    const owner = teamMembers.find(m => m.id === user.uid);

    const newItem: Omit<FridgeItem, 'id'> = {
        ...newItemData,
        ownerId: user.uid,
        ownerName: owner?.name || 'Unbekannt',
        imageUrl: `https://picsum.photos/seed/${newItemData.name.replace(/\s+/g, '')}/${Date.now()}/400/300`,
        shelf: 'A1', // Placeholder shelf
    };

    try {
        await addFridgeItem(newItem);
        toast({ title: 'Artikel hinzugefügt', description: `${newItem.name} wurde in den Kühlschrank gelegt.` });
        fetchItems(); // Refetch
    } catch (error) {
        toast({ variant: 'destructive', title: 'Fehler', description: 'Artikel konnte nicht hinzugefügt werden.' });
    }
  }
  
  const getExpiryDays = (isoDate: string) => differenceInDays(parseISO(isoDate), new Date());

  const filters = {
    all: () => true,
    mine: (item: FridgeItem) => item.ownerId === user?.uid,
    expiring: (item: FridgeItem) => {
        if (!item.expiryDate) return false;
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
    const items = fridgeItems.filter(filter).sort((a,b) => {
        if (!a.expiryDate || !b.expiryDate) return 0;
        return getExpiryDays(a.expiryDate) - getExpiryDays(b.expiryDate)
    });
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

      <AddItemDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onAddItem={handleAddItem}/>
    </div>
  )
}
