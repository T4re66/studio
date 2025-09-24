
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, FC, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, User, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';
import { useToast } from './use-toast';
import { getTeamForUser, createTeamMember, getTeamMember } from '@/lib/team-api';
import type { Team, TeamMember } from '@/lib/data';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { teamMembers } from '@/lib/data';

interface AuthContextType {
    user: User | null;
    isPreview: boolean;
    accessToken: string | null;
    loading: boolean;
    team: Team | null;
    teamMember: TeamMember | null;
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

const PREVIEW_TEAM: Team = {
  id: 'preview-team',
  name: 'Vorschau-Team',
  ownerId: 'preview-user',
  joinCode: '000000',
  createdAt: new Date(),
}


export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isPreview, setIsPreview] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [team, setTeam] = useState<Team | null>(null);
    const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
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

    const enterPreviewMode = useCallback(() => {
        setLoading(true);
        setUser(PREVIEW_USER);
        setIsPreview(true);
        setTeam(PREVIEW_TEAM);
        setTeamMember(teamMembers.find(m => m.id === 'preview-user') || null);
        Cookies.set('is-preview', 'true', { expires: 1 });
        Cookies.remove('firebase-auth-token');
        Cookies.set('has-team', 'true');
        router.push('/dashboard');
        setLoading(false);
    }, [router]);
    
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
                const memberData = await getTeamMember(authUser.uid);
                setTeamMember(memberData);
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
                    const memberData = await getTeamMember(user.uid);
                    setTeamMember(memberData);
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
        const isPreviewCookie = Cookies.get('is-preview') === 'true';

        if (isPreviewCookie) {
            enterPreviewMode();
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                 try {
                    await fetchUserAndTeamData(authUser);
                } catch (error) {
                    console.error("Error during auth state change:", error);
                    clearAuthAndTeamState();
                } finally {
                    setLoading(false);
                }
            } else {
                clearAuthAndTeamState();
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [fetchUserAndTeamData, clearAuthAndTeamState, enterPreviewMode]);

    const signIn = async () => {
        setLoading(true);
        try {
            Cookies.remove('is-preview');
            const result = await signInWithPopup(auth, provider);
             if (result.user) {
                // The onAuthStateChanged listener will handle the rest
            } else {
                setLoading(false);
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
             setLoading(false);
        }
    };

    const signOut = async () => {
        const wasPreview = isPreview;
        setLoading(true);
        clearAuthAndTeamState();
        if (!wasPreview) {
            try {
                await firebaseSignOut(auth);
            } catch (error: any) {
                 toast({
                    variant: "destructive",
                    title: "Abmeldung fehlgeschlagen",
                    description: error.message,
                });
            }
        }
        router.push('/');
        toast({
            title: "Abgemeldet",
            description: "Du wurdest erfolgreich abgemeldet.",
        });
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

    