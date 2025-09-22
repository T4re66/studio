
'use client'

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { ThemeSelector } from "@/components/settings/theme-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Cloud, Link as LinkIcon, LogOut, Loader2, Download, AlertTriangle, Trash2 } from 'lucide-react';
import { useAuth } from "@/context/auth-context";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


function GoogleAccountIntegration() {
    const { user, loading, signInWithGoogle, signOut } = useAuth();

    const isConnected = !!user;
    const userEmail = user?.email;

    const handleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Sign-in error", error);
            // Optional: Show a toast notification for the error
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Sign-out error", error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-3">
                    <Cloud className="text-primary" />
                    Firebase-Konto Integration
                </CardTitle>
                <CardDescription>
                    {isConnected 
                        ? "Du bist erfolgreich mit deinem Google-Konto via Firebase verbunden." 
                        : "Verbinde dein Google-Konto, um alle Features von OfficeZen zu nutzen."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center p-6">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : isConnected ? (
                     <div className="p-6 bg-green-100/50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                            <h3 className="font-semibold text-green-800 dark:text-green-300">Verbindung aktiv</h3>
                            <p className="text-sm text-green-700 dark:text-green-400">Verbunden als: {userEmail}</p>
                        </div>
                    </div>
                ) : (
                     <div className="p-6 bg-muted/50 border rounded-lg flex items-center justify-center">
                        <Button size="lg" onClick={handleSignIn}>
                            <LinkIcon className="mr-2"/>
                            Mit Google verbinden
                        </Button>
                    </div>
                )}
            </CardContent>
            {isConnected && (
                <CardFooter>
                    <Button variant="destructive" onClick={handleSignOut}>
                        <LogOut className="mr-2"/>
                        Verbindung trennen
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}

function GdprActions() {
    const { toast } = useToast();
    const [isExporting, setIsExporting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const functions = getFunctions();

    const handleExport = async () => {
        setIsExporting(true);
        toast({ title: "Daten-Export gestartet", description: "Wir sammeln deine Daten. Dies kann einen Moment dauern."});
        try {
            const exportMyData = httpsCallable(functions, 'exportMyData');
            const result: any = await exportMyData();
            if (result.data.downloadUrl) {
                toast({ title: "Export abgeschlossen", description: "Dein Download wird gestartet."});
                window.open(result.data.downloadUrl, '_blank');
            } else {
                 throw new Error("Keine Download-URL erhalten");
            }
        } catch (error) {
            console.error("Error exporting data:", error);
            toast({ variant: "destructive", title: "Fehler beim Export", description: "Deine Daten konnten nicht exportiert werden." });
        } finally {
            setIsExporting(false);
        }
    }
    
    const handleDelete = async () => {
        setIsDeleting(true);
        toast({ title: "Kontolöschung eingeleitet", description: "Dein Konto und deine Daten werden jetzt gelöscht."});
        try {
            const deleteMyAccount = httpsCallable(functions, 'deleteMyAccount');
            await deleteMyAccount();
            toast({ title: "Konto gelöscht", description: "Du wirst in Kürze abgemeldet."});
            // The onAuthStateChanged listener will handle the redirect.
        } catch (error) {
            console.error("Error deleting account:", error);
            toast({ variant: "destructive", title: "Fehler bei der Löschung", description: "Dein Konto konnte nicht gelöscht werden." });
        } finally {
            setIsDeleting(false);
        }
    }


    return (
         <Card>
            <CardHeader>
                <CardTitle className="font-headline">Datenschutz</CardTitle>
                <CardDescription>Verwalte deine persönlichen Daten gemäss DSGVO.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <Button className="w-full" onClick={handleExport} disabled={isExporting}>
                    {isExporting ? <Loader2 className="mr-2 animate-spin" /> : <Download className="mr-2" />}
                    Meine Daten exportieren (JSON)
                </Button>
            </CardContent>
            <CardFooter className="flex-col gap-4 !p-4 border-t bg-destructive/10">
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button variant="destructive" className="w-full" disabled={isDeleting}>
                        {isDeleting ? <Loader2 className="mr-2 animate-spin" /> : <Trash2 className="mr-2" />}
                        Mein Konto endgültig löschen
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle/>Bist du dir absolut sicher?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Daten werden
                        dauerhaft gelöscht und dein Konto wird entfernt.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Ja, Konto löschen</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    )
}


export default function SettingsPage() {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Einstellungen"
        description="Passe die Anwendung an deine Bedürfnisse an."
      />
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <ThemeSelector />
        <GoogleAccountIntegration />
        {user && <GdprActions />}
      </div>
    </div>
  );
}
