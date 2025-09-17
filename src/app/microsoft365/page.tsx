
'use client'

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Cloud, Link, Mail, Calendar, Notebook } from 'lucide-react';

export default function Microsoft365Page() {
    const [isConnected, setIsConnected] = useState(false);

    const handleConnect = () => {
        // In a real application, this would trigger the OAuth flow.
        // For this demo, we'll just simulate the connection.
        setIsConnected(true);
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Microsoft 365 Integration"
                description="Verbinde dein Microsoft-Konto, um E-Mails, Kalender und Notizen zu synchronisieren."
            />

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-3">
                        <Cloud className="text-primary" />
                        Verbindungsstatus
                    </CardTitle>
                    <CardDescription>
                        {isConnected 
                            ? "Du bist erfolgreich mit deinem Microsoft 365 Konto verbunden." 
                            : "Dein Microsoft 365 Konto ist nicht verbunden."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isConnected ? (
                         <div className="p-6 bg-green-100/50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                            <div>
                                <h3 className="font-semibold text-green-800 dark:text-green-300">Verbindung aktiv</h3>
                                <p className="text-sm text-green-700 dark:text-green-400">OfficeZen hat jetzt Lesezugriff auf deine Daten.</p>
                            </div>
                        </div>
                    ) : (
                         <div className="p-6 bg-muted/50 border rounded-lg flex items-center justify-center">
                            <Button size="lg" onClick={handleConnect}>
                                <Link className="mr-2"/>
                                Mit Microsoft 365 verbinden
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {isConnected && (
                <div className="grid md:grid-cols-3 gap-8">
                    <Card className="animate-in fade-in-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Mail/>Letzte E-Mails</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Hier werden deine letzten Outlook-E-Mails angezeigt.
                        </CardContent>
                    </Card>
                     <Card className="animate-in fade-in-50 delay-100">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Calendar/>Nächste Termine</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Hier werden deine nächsten Termine aus dem Outlook-Kalender angezeigt.
                        </CardContent>
                    </Card>
                     <Card className="animate-in fade-in-50 delay-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Notebook/>Letzte Notizen</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Hier werden deine letzten OneNote-Notizen angezeigt.
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
