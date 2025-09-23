
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';
import { getAuth, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, User, OAuthCredential, GoogleAuthProvider } from 'firebase/auth';
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
             if (user) {
                // If user is logged in, we assume we might need to get a fresh token,
                // but for simplicity, we'll handle token setting on sign-in.
             } else {
                setAccessToken(null);
             }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signIn = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            if (credential?.accessToken) {
                setAccessToken(credential.accessToken);
                setUser(result.user);
                toast({
                    title: "Erfolgreich verbunden",
                    description: "Dein Google-Konto wurde verknüpft.",
                });
            } else {
                throw new Error("Kein Access Token gefunden.");
            }
        } catch (error: any) {
            console.error("Authentication error:", error);
            toast({
                variant: "destructive",
                title: "Anmeldung fehlgeschlagen",
                description: error.code === 'auth/popup-closed-by-user' ? 'Das Anmeldefenster wurde geschlossen.' : 'Bitte versuche es erneut.',
            });
        } finally {
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
