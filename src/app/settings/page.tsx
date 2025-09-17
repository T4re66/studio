
'use client'

import { PageHeader } from "@/components/page-header";
import { ThemeSelector } from "@/components/settings/theme-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Cloud, Link, LogOut } from 'lucide-react';
import { useMicrosoft365 } from '@/components/microsoft365-provider';

function Microsoft365Integration() {
    const { isConnected, connect, disconnect } = useMicrosoft365();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-3">
                    <Cloud className="text-primary" />
                    Microsoft 365 Integration
                </CardTitle>
                <CardDescription>
                    {isConnected 
                        ? "Du bist erfolgreich mit deinem Microsoft 365 Konto verbunden." 
                        : "Verbinde dein Microsoft-Konto, um E-Mails, Kalender und Notizen zu synchronisieren."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isConnected ? (
                     <div className="p-6 bg-green-100/50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                            <h3 className="font-semibold text-green-800 dark:text-green-300">Verbindung aktiv</h3>
                            <p className="text-sm text-green-700 dark:text-green-400">OfficeZen hat Lesezugriff auf deine Live-Daten.</p>
                        </div>
                    </div>
                ) : (
                     <div className="p-6 bg-muted/50 border rounded-lg flex items-center justify-center">
                        <Button size="lg" onClick={connect}>
                            <Link className="mr-2"/>
                            Mit Microsoft 365 verbinden
                        </Button>
                    </div>
                )}
            </CardContent>
            {isConnected && (
                <CardFooter>
                    <Button variant="destructive" onClick={disconnect}>
                        <LogOut className="mr-2"/>
                        Verbindung trennen
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Einstellungen"
        description="Passe die Anwendung an deine Bedürfnisse an."
      />
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <ThemeSelector />
        <Microsoft365Integration />
      </div>
    </div>
  );
}
