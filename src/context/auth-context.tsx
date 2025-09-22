
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, User } from 'firebase/auth';
import { auth, rtdb, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { ref, onValue, set, onDisconnect, serverTimestamp } from 'firebase/database';
import { doc, getDoc, serverTimestamp as firestoreServerTimestamp, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        
        // Get orgId from custom claims
        const idTokenResult = await user.getIdTokenResult();
        const orgId = idTokenResult.claims.orgId;

        if (orgId) {
            // Firestore document reference
            const userStatusRef = doc(db, `orgs/${orgId}/users/${user.uid}`);
             // Realtime Database reference
            const presenceRef = ref(rtdb, `/status/${orgId}/${user.uid}`);
            
            // Sync presence with RTDB
            onValue(ref(rtdb, '.info/connected'), (snapshot) => {
                if (snapshot.val() === false) {
                    return;
                }
                onDisconnect(presenceRef).set({ online: false, dnd: false, last_changed: serverTimestamp() }).then(() => {
                    set(presenceRef, { online: true, dnd: false, last_changed: serverTimestamp() });
                     // Update Firestore last seen
                     setDoc(userStatusRef, { lastLoginAt: firestoreServerTimestamp() }, { merge: true });
                });
            });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
    provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google', error);
      throw error;
    }
  };

  const signOut = async () => {
     if (auth.currentUser) {
        const idTokenResult = await auth.currentUser.getIdTokenResult();
        const orgId = idTokenResult.claims.orgId;
        if (orgId) {
            const presenceRef = ref(rtdb, `/status/${orgId}/${auth.currentUser.uid}`);
            set(presenceRef, { online: false, dnd: false, last_changed: serverTimestamp() });
        }
    }
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
      throw error;
    }
  };

  const value = { user, loading, signInWithGoogle, signOut };

  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
