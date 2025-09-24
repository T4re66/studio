
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, FC, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, User, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';
import { useToast } from './use-toast';
import { getTeamForUser, createTeamMember, getTeamMember } from '@/lib/team-api';
import type { Team, TeamMember } from '@/lib/data';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';
import { teamMembers as mockTeamMembers } from '@/lib/data';

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
    const pathname = usePathname();

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
        clearAuthAndTeamState();
        setIsPreview(true);
        setUser(PREVIEW_USER);
        setTeam(PREVIEW_TEAM);
        const previewMember = mockTeamMembers.find(m => m.id === 'preview-user') || null;
        setTeamMember(previewMember);
        Cookies.set('is-preview', 'true', { expires: 1 });
        Cookies.set('has-team', 'true', { expires: 1 });
    }, [clearAuthAndTeamState]);
    
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
            console.warn("User may not be part of a team, continuing without team context.");
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

        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (isPreviewCookie) {
                // If preview cookie exists, prioritize it and ignore auth state
                if (!isPreview) {
                    enterPreviewMode();
                }
                setLoading(false);
            } else if (authUser) {
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

        if (isPreviewCookie && !user) {
            enterPreviewMode();
            setLoading(false);
        }

        return () => unsubscribe();
    }, [fetchUserAndTeamData, clearAuthAndTeamState, enterPreviewMode, isPreview, user]);


    // This effect handles redirection AFTER authentication state is fully resolved.
    useEffect(() => {
        if (!loading) {
            const isAuthenticated = user || isPreview;
            
            if (isAuthenticated && pathname === '/') {
                router.push('/dashboard');
            } else if (user && !isPreview && !team && pathname !== '/team/select' && pathname !== '/') {
                 router.push('/team/select');
            }
        }
    }, [loading, user, isPreview, team, pathname, router]);

    const signIn = async () => {
        setLoading(true);
        try {
            clearAuthAndTeamState();
            await signInWithPopup(auth, provider);
            // onAuthStateChanged will handle the rest.
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
            clearAuthAndTeamState();
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
