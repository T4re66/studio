
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
import { Camera, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { add, format } from "date-fns";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (newItem: {name: string, expiryDate: string}) => void;
}

export function AddItemDialog({ open, onOpenChange, onAddItem }: AddItemDialogProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [itemName, setItemName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const { toast } = useToast();

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setItemName("Joghurt");
      const futureDate = add(new Date(), { days: 7 });
      setExpiryDate(format(futureDate, 'yyyy-MM-dd'));
      setIsScanning(false);
      toast({
        title: "Scan erfolgreich",
        description: "Artikelname und Ablaufdatum wurden erkannt.",
      });
    }, 1500);
  };

  const handleAdd = () => {
    if (!itemName || !expiryDate) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Bitte fülle alle Felder aus.",
      });
      return;
    }
    
    onAddItem({ name: itemName, expiryDate: expiryDate });
    onOpenChange(false);
    setItemName("");
    setExpiryDate("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Neuer Artikel</DialogTitle>
          <DialogDescription>
            Füge einen neuen Artikel zum Kühlschrank hinzu. Scanne ihn für eine
            automatische Erfassung.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg">
            <Button
              variant="outline"
              size="lg"
              onClick={handleScan}
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Scanne...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-5 w-5" />
                  Artikel scannen
                </>
              )}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Oder manuell eingeben
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="item-name">Artikelname</Label>
            <Input
              id="item-name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="z.B. Milch, Sandwich"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expiry-date">Ablaufdatum</Label>
            <Input
              id="expiry-date"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
             <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                AI-Vorschlag basierend auf ähnlichen Artikeln: 5 Tage
            </p>
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
