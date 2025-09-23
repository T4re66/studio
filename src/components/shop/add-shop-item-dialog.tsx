
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { ShopItem } from "@/lib/data";
import { addShopItem } from "@/lib/team-api";
import { Armchair, CalendarOff, Coffee, Cookie, Headphones, Pizza } from "lucide-react";

interface AddShopItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemAdded: () => void;
}

const icons = [
    { name: 'Coffee', component: Coffee },
    { name: 'Pizza', component: Pizza },
    { name: 'Headphones', component: Headphones },
    { name: 'CalendarOff', component: CalendarOff },
    { name: 'Armchair', component: Armchair },
    { name: 'Cookie', component: Cookie },
]

export function AddShopItemDialog({ open, onOpenChange, onItemAdded }: AddShopItemDialogProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("500");
  const [category, setCategory] = useState<ShopItem['category'] | undefined>(undefined);
  const [icon, setIcon] = useState<string | undefined>(undefined);

  const handleAdd = async () => {
    if (!title || !description || !cost || !category || !icon) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Bitte fülle alle Felder aus.",
      });
      return;
    }

    try {
        const newItem: Omit<ShopItem, 'id'> = {
            title,
            description,
            cost: parseInt(cost),
            category,
            icon,
        };
        await addShopItem(newItem);
        toast({
            title: "Angebot hinzugefügt",
            description: `Das Angebot "${title}" wurde zum Shop hinzugefügt.`,
        });
        onItemAdded();
        onOpenChange(false);
        // Reset form
        setTitle("");
        setDescription("");
        setCost("500");
        setCategory(undefined);
        setIcon(undefined);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Fehler",
            description: "Angebot konnte nicht erstellt werden.",
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Neues Shop-Angebot</DialogTitle>
          <DialogDescription>
            Füge eine neue Prämie hinzu, die mit Punkten gekauft werden kann.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="item-title">Titel</Label>
            <Input
              id="item-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Kaffee für eine Woche"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="item-description">Beschreibung</Label>
            <Textarea
              id="item-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Eine kurze Beschreibung der Prämie."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="item-cost">Kosten (Punkte)</Label>
              <Input
                id="item-cost"
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="z.B. 500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="item-category">Kategorie</Label>
              <Select onValueChange={(v) => setCategory(v as ShopItem['category'])} value={category}>
                <SelectTrigger id="item-category">
                  <SelectValue placeholder="Kategorie wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Essen & Trinken">Essen & Trinken</SelectItem>
                  <SelectItem value="Büro-Vorteile">Büro-Vorteile</SelectItem>
                  <SelectItem value="Freizeit">Freizeit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
            <div className="grid gap-2">
              <Label htmlFor="item-icon">Icon</Label>
              <Select onValueChange={(v) => setIcon(v)} value={icon}>
                <SelectTrigger id="item-icon">
                    <SelectValue placeholder="Icon auswählen" />
                </SelectTrigger>
                <SelectContent>
                    {icons.map(({name, component: IconComponent}) => (
                        <SelectItem key={name} value={name}>
                            <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4" />
                                {name}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleAdd}>Hinzufügen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
