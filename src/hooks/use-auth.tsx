
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';
import { getAuth, onAuthStateChanged, signInWithRedirect, getRedirectResult, signOut as firebaseSignOut, User, OAuthCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';
import { useToast } from './use-toast';

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
             if (!user) {
                setAccessToken(null);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    if (credential?.accessToken) {
                        setAccessToken(credential.accessToken);
                        setUser(result.user);
                        toast({
                            title: "Erfolgreich verbunden",
                            description: "Dein Google-Konto wurde verknüpft.",
                        });
                    } else {
                        throw new Error("Kein Access Token nach Weiterleitung gefunden.");
                    }
                }
            } catch (error: any) {
                console.error("Authentication redirect error:", error);
                toast({
                    variant: "destructive",
                    title: "Anmeldung fehlgeschlagen",
                    description: "Die Anmeldung über Google konnte nicht abgeschlossen werden.",
                });
                setAccessToken(null);
            } finally {
                // This will be false if there was no redirect result to process
                if (auth.currentUser) {
                    setLoading(false);
                }
            }
        };

        handleRedirectResult();
    }, [toast]);


    const signIn = async () => {
        setLoading(true);
        try {
            await signInWithRedirect(auth, provider);
        } catch (error: any) {
            console.error("Authentication error:", error);
            toast({
                variant: "destructive",
                title: "Anmeldung fehlgeschlagen",
                description: "Bitte versuche es erneut.",
            });
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await firebaseSignOut(auth);
            setUser(null);
            setAccessToken(null);
            toast({
                title: "Verbindung getrennt",
                description: "Dein Google-Konto wurde erfolgreich getrennt.",
            });
        } catch (error: any) {
             toast({
                variant: "destructive",
                title: "Abmeldung fehlgeschlagen",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const value = { user, accessToken, loading, signIn, signOut };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
