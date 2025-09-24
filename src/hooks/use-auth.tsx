
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, FC, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, User, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';
import { useToast } from './use-toast';
import { getTeamForUser, createTeamMember } from '@/lib/team-api';
import type { Team, TeamMembership } from '@/lib/data';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    isPreview: boolean;
    accessToken: string | null;
    loading: boolean;
    team: Team | null;
    teamMember: TeamMembership | null;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    enterPreviewMode: () => void;
    refetchTeam: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PREVIEW_USER: User = {
    uid: 'preview-user',
    displayName: 'Gast',
    email: 'gast@officezen.app',
    photoURL: 'https://picsum.photos/seed/guest/200/200',
    // Add other required User properties with mock values
    emailVerified: true,
    isAnonymous: true,
    metadata: {},
    providerData: [],
    providerId: 'preview',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'preview-token',
    getIdTokenResult: async () => ({} as any),
    reload: async () => {},
    toJSON: () => ({}),
};


export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isPreview, setIsPreview] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [team, setTeam] = useState<Team | null>(null);
    const [teamMember, setTeamMember] = useState<TeamMembership | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const clearAuthAndTeamState = useCallback(() => {
        setUser(null);
        setAccessToken(null);
        setTeam(null);
        setTeamMember(null);
        setIsPreview(false);
        Cookies.remove('firebase-auth-token');
        Cookies.remove('is-preview');
        Cookies.remove('has-team');
    }, []);
    
    const fetchUserAndTeamData = useCallback(async (authUser: User) => {
        const token = await authUser.getIdToken();
        setAccessToken(token);
        setUser(authUser);
        Cookies.set('firebase-auth-token', token, { expires: 1 });
        
        await createTeamMember(authUser);
        
        try {
            const teamData = await getTeamForUser(authUser.uid);
            if (teamData) {
                setTeam(teamData.team);
                setTeamMember(teamData.membership);
                Cookies.set('has-team', 'true', { expires: 1 });
            } else {
                setTeam(null);
                setTeamMember(null);
                Cookies.set('has-team', 'false', { expires: 1 });
            }
        } catch (error) {
            console.warn("User is not part of any team, continuing without team context.");
            setTeam(null);
            setTeamMember(null);
            Cookies.set('has-team', 'false', { expires: 1 });
        }
    }, []);

    const refetchTeam = useCallback(async () => {
        if (user && !isPreview) {
             try {
                const teamData = await getTeamForUser(user.uid);
                if (teamData) {
                    setTeam(teamData.team);
                    setTeamMember(teamData.membership);
                    Cookies.set('has-team', 'true', { expires: 1 });
                } else {
                    setTeam(null);
                    setTeamMember(null);
                    Cookies.set('has-team', 'false', { expires: 1 });
                }
            } catch (error) {
                 setTeam(null);
                 setTeamMember(null);
                 Cookies.set('has-team', 'false', { expires: 1 });
            }
        }
    }, [user, isPreview]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            setLoading(true);
            const isPreviewCookie = Cookies.get('is-preview') === 'true';

            if (authUser) {
                 try {
                    await fetchUserAndTeamData(authUser);
                } catch (error) {
                    console.error("Error during auth state change:", error);
                    clearAuthAndTeamState();
                }
            } else if (isPreviewCookie) {
                // If no real user but preview cookie exists, enter preview mode
                setUser(PREVIEW_USER);
                setIsPreview(true);
                setTeam(null);
            } else {
                clearAuthAndTeamState();
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [fetchUserAndTeamData, clearAuthAndTeamState]);

    const enterPreviewMode = () => {
        setLoading(true);
        setUser(PREVIEW_USER);
        setIsPreview(true);
        setTeam(null);
        Cookies.set('is-preview', 'true', { expires: 1 });
        Cookies.remove('firebase-auth-token');
        router.push('/dashboard');
        setLoading(false);
    };

    const signIn = async () => {
        setLoading(true);
        try {
            Cookies.remove('is-preview');
            const result = await signInWithPopup(auth, provider);
            // The onAuthStateChanged listener will handle the rest
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
            // setLoading(false) is handled by onAuthStateChanged
        }
    };

    const signOut = async () => {
        setLoading(true);
        if (isPreview) {
            clearAuthAndTeamState();
            router.push('/');
        } else {
            try {
                await firebaseSignOut(auth);
                // onAuthStateChanged will trigger clearAuthAndTeamState
                toast({
                    title: "Abgemeldet",
                    description: "Du wurdest erfolgreich abgemeldet.",
                });
                router.push('/');
            } catch (error: any) {
                 toast({
                    variant: "destructive",
                    title: "Abmeldung fehlgeschlagen",
                    description: error.message,
                });
            }
        }
        setLoading(false);
    };

    const value = { user, isPreview, accessToken, loading, team, teamMember, signIn, signOut, refetchTeam, enterPreviewMode };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
