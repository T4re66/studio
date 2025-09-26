
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, FC, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, User, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';
import { useToast } from './use-toast';
import { getTeamForUser, createTeamMember, getTeamMember, getTeamMembers } from '@/lib/team-api';
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
    teamMembers: TeamMember[];
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
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();

    const clearAuthAndTeamState = useCallback(() => {
        setUser(null);
        setAccessToken(null);
        setTeam(null);
        setTeamMember(null);
        setTeamMembers([]);
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
        setTeamMembers(mockTeamMembers);
        Cookies.set('is-preview', 'true', { expires: 1 });
        setLoading(false);
    }, [clearAuthAndTeamState]);
    
    const fetchUserAndTeamData = useCallback(async (authUser: User) => {
        const token = await authUser.getIdToken();
        setAccessToken(token);
        setUser(authUser);
        Cookies.set('firebase-auth-token', token, { expires: 1 });
        
        // Create user doc if it doesn't exist, then fetch all related data in parallel
        await createTeamMember(authUser);
        const teamDataPromise = getTeamForUser(authUser.uid);
        const memberDataPromise = getTeamMember(authUser.uid);

        const [teamData, memberData] = await Promise.all([teamDataPromise, memberDataPromise]);
        
        setTeamMember(memberData);

        if (teamData) {
            setTeam(teamData.team);
            const allMembers = await getTeamMembers(teamData.team.id);
            setTeamMembers(allMembers);
            Cookies.set('has-team', 'true', { expires: 1 });
        } else {
            setTeam(null);
            setTeamMembers([]);
            Cookies.set('has-team', 'false', { expires: 1 });
        }
    }, []);

    const refetchTeam = useCallback(async () => {
        if (isPreview) {
            setTeamMembers(mockTeamMembers);
            return;
        };

        if (user) {
             try {
                const teamData = await getTeamForUser(user.uid);
                if (teamData) {
                    const [memberData, allMembers] = await Promise.all([
                        getTeamMember(user.uid),
                        getTeamMembers(teamData.team.id)
                    ]);
                    setTeam(teamData.team);
                    setTeamMember(memberData);
                    setTeamMembers(allMembers);
                    Cookies.set('has-team', 'true', { expires: 1 });
                } else {
                    setTeam(null);
                    setTeamMember(null);
                    setTeamMembers([]);
                    Cookies.set('has-team', 'false', { expires: 1 });
                }
            } catch (error) {
                 setTeam(null);
                 setTeamMember(null);
                 setTeamMembers([]);
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
                setLoading(true);
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


    // This effect handles redirection AFTER authentication state is fully resolved.
    useEffect(() => {
        if (loading) return;

        const isAuthenticated = user || isPreview;
        const hasTeam = team || isPreview;

        if (isAuthenticated && pathname === '/') {
            router.push('/dashboard');
        } else if (user && !isPreview && !hasTeam && pathname !== '/team/select' && pathname !== '/') {
            router.push('/team/select');
        }
    }, [loading, user, isPreview, team, pathname, router]);

    const signIn = async () => {
        setLoading(true);
        try {
            clearAuthAndTeamState();
            const result = await signInWithPopup(auth, provider);
            await fetchUserAndTeamData(result.user);
            const teamData = await getTeamForUser(result.user.uid);
            
            // This is the robust redirect.
            if (teamData) {
                window.location.href = '/dashboard';
            } else {
                window.location.href = '/team/select';
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
            clearAuthAndTeamState();
        } finally {
            // Keep loading true, as the page will redirect and reload.
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
        window.location.href = '/';
        toast({
            title: "Abgemeldet",
            description: "Du wurdest erfolgreich abgemeldet.",
        });
        setLoading(false);
    };

    const value = { user, isPreview, accessToken, loading, team, teamMember, teamMembers, signIn, signOut, refetchTeam, enterPreviewMode };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
