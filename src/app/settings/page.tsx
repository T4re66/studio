
'use client'

import { PageHeader } from "@/components/page-header";
import { ThemeSelector } from "@/components/settings/theme-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
<<<<<<< HEAD
import { CheckCircle, Cloud, Link as LinkIcon, LogOut, Loader2, Users, AlertCircle } from 'lucide-react';
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";


function GoogleAccountIntegration() {
    const { user, isPreview, signIn, signOut, loading } = useAuth();
    const isConnected = !!user && !isPreview;
=======
import { CheckCircle, Cloud, Link as LinkIcon, LogOut } from 'lucide-react';


function GoogleAccountIntegration() {
    const isConnected = false; // Hardcoded for UI shell
    const userEmail = "user@example.com";
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-3">
                    <Cloud className="text-primary" />
                    Google-Konto Integration
                </CardTitle>
                <CardDescription>
                    {isConnected 
                        ? "Verwalte hier die Verbindung zu deinem Google-Konto." 
                        : "Verbinde dein Google-Konto, um persönliche Daten wie E-Mails und Kalendereinträge zu sehen."}
                </CardDescription>
            </CardHeader>
            <CardContent>
<<<<<<< HEAD
                {loading ? (
                    <div className="p-6 bg-muted/50 border rounded-lg flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : isConnected ? (
                     <div className="p-6 bg-green-100/50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                            <div>
                                <h3 className="font-semibold text-green-800 dark:text-green-300">Verbindung aktiv</h3>
                                <p className="text-sm text-green-700 dark:text-green-400">Verbunden als: {user.email}</p>
                            </div>
                        </div>
                         <Button variant="destructive" size="sm" onClick={signOut}>
                            <LogOut className="mr-2 h-4 w-4"/>
                            Trennen
                        </Button>
                    </div>
                ) : isPreview ? (
                     <div className="p-6 bg-yellow-100/50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center gap-4">
                        <AlertCircle className="h-8 w-8 text-yellow-600" />
=======
                {isConnected ? (
                     <div className="p-6 bg-green-100/50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
                        <div>
                            <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">Vorschaumodus</h3>
                            <p className="text-sm text-yellow-700 dark:text-yellow-400">Melde dich an, um dein eigenes Konto zu verbinden.</p>
                        </div>
                    </div>
                ) : (
                     <div className="p-6 bg-muted/50 border rounded-lg flex items-center justify-center">
<<<<<<< HEAD
                        <Button size="lg" onClick={signIn}>
=======
                        <Button size="lg">
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
                            <LinkIcon className="mr-2"/>
                            Mit Google verbinden
                        </Button>
                    </div>
                )}
            </CardContent>
<<<<<<< HEAD
=======
            {isConnected && (
                <CardFooter>
                    <Button variant="destructive">
                        <LogOut className="mr-2"/>
                        Verbindung trennen
                    </Button>
                </CardFooter>
            )}
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
        </Card>
    );
}

function TeamManagement() {
    const { team, isPreview } = useAuth();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-3">
                    <Users className="text-primary"/>
                    Team-Management
                </CardTitle>
                <CardDescription>
                    Verwalte dein Team oder trete einem neuen bei.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {team ? (
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <h3 className="font-semibold">Aktuelles Team</h3>
                        <p className="text-2xl font-bold text-primary">{team.name}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-1">ID: {team.id}</p>
                    </div>
                ) : isPreview ? (
                    <p className="text-muted-foreground">Im Vorschaumodus bist du in keinem Team.</p>
                ) : (
                    <p className="text-muted-foreground">Du bist aktuell in keinem Team.</p>
                )}
            </CardContent>
            <CardFooter>
                 <Link href={isPreview ? "#" : "/team/select"} passHref>
                    <Button variant="outline" disabled={isPreview}>{team ? 'Team wechseln oder erstellen' : 'Team beitreten oder erstellen'}</Button>
                </Link>
            </CardFooter>
        </Card>
    )
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
        <GoogleAccountIntegration />
        <TeamManagement />
      </div>
    </div>
  );
}
