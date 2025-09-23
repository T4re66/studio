
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
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                 try {
                    // On page load or session restoration, get a fresh token.
                    const token = await user.getIdToken();
                    setAccessToken(token);
                    setUser(user);
                } catch (error) {
                    console.error("Error getting access token:", error);
                    setUser(null);
                    setAccessToken(null);
                }
            } else {
                setUser(null);
                setAccessToken(null);
            }
            // This is crucial: set loading to false regardless of auth state.
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signIn = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            if (credential?.accessToken) {
                setAccessToken(credential.accessToken);
                setUser(result.user);
                toast({
                    title: "Erfolgreich verbunden",
                    description: "Dein Google-Konto wurde verknüpft.",
                });
            } else {
                throw new Error("Kein Access Token von Google erhalten.");
            }
        } catch (error: any) {
            console.error("Authentication error:", error);
            if (error.code === 'auth/unauthorized-domain') {
                 const domain = window.location.hostname;
                 toast({
                    variant: "destructive",
                    title: "Domain nicht autorisiert",
                    description: `Die Domain "${domain}" ist nicht für die Anmeldung autorisiert. Bitte füge sie in den Firebase Authentication-Einstellungen unter 'Authorized domains' hinzu.`,
                    duration: 15000,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Anmeldung fehlgeschlagen",
                    description: error.code === 'auth/popup-closed-by-user' ? 'Das Anmeldefenster wurde geschlossen.' : 'Bitte versuche es erneut.',
                });
            }
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
