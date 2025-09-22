
'use client'

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { ThemeSelector } from "@/components/settings/theme-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Cloud, Link as LinkIcon, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from "@/context/auth-context";


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
      </div>
    </div>
  );
}
