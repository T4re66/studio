
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, FC, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, User, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';
import { useToast } from './use-toast';
import { getTeamForUser, createTeamMember } from '@/lib/team-api';
import type { Team, TeamMembership } from '@/lib/data';

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    team: Team | null;
    teamMember: TeamMembership | null;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    refetchTeam: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [team, setTeam] = useState<Team | null>(null);
    const [teamMember, setTeamMember] = useState<TeamMembership | null>(null);
    const { toast } = useToast();

    const clearAuthAndTeamState = () => {
        setUser(null);
        setAccessToken(null);
        setTeam(null);
        setTeamMember(null);
    }
    
    const fetchUserAndTeamData = useCallback(async (authUser: User) => {
        const token = await authUser.getIdToken();
        setAccessToken(token);
        setUser(authUser);
        
        await createTeamMember(authUser); // Ensure user profile exists in 'users' collection
        
        const teamData = await getTeamForUser(authUser.uid);
        if (teamData) {
            setTeam(teamData.team);
            setTeamMember(teamData.membership);
        } else {
            setTeam(null);
            setTeamMember(null);
        }
    }, []);

    const refetchTeam = useCallback(async () => {
        if (user) {
            const teamData = await getTeamForUser(user.uid);
            if (teamData) {
                setTeam(teamData.team);
                setTeamMember(teamData.membership);
            } else {
                setTeam(null);
                setTeamMember(null);
            }
        }
    }, [user]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            setLoading(true);
            if (authUser) {
                 try {
                    await fetchUserAndTeamData(authUser);
                } catch (error) {
                    console.error("Error during auth state change:", error);
                    clearAuthAndTeamState();
                }
            } else {
                clearAuthAndTeamState();
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [fetchUserAndTeamData]);

    const signIn = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            if (credential?.accessToken) {
                await fetchUserAndTeamData(result.user);
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
            clearAuthAndTeamState();
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

    const value = { user, accessToken, loading, team, teamMember, signIn, signOut, refetchTeam };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
