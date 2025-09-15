'use client'

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { PlusCircle, User, Users, Clock, Refrigerator } from "lucide-react"
import { AddItemDialog } from "@/components/fridge/add-item-dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { fridgeItems } from "@/lib/data"
import { FridgeCard } from "@/components/fridge/fridge-card"
import type { FridgeItem } from "@/lib/data"

export default function FridgePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Assuming current user is Alice Johnson for demo purposes
  const myUserId = "1"; 

  const filters = {
    all: () => true,
    mine: (item: FridgeItem) => item.ownerId === myUserId,
    expiring: (item: FridgeItem) => item.expiryDays <= 3 && item.expiryDays >= 0,
    shared: (item: FridgeItem) => item.ownerId === 'team',
  }

  const renderItems = (filter: (item: FridgeItem) => boolean) => {
    const items = fridgeItems.filter(filter);
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
        <Button onClick={() => setIsDialogOpen(true)}>
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

      <AddItemDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}
