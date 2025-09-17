
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface GoogleAccountContextType {
  isConnected: boolean;
  userEmail: string | null;
  connect: (email: string) => void;
  disconnect: () => void;
}

const GoogleAccountContext = createContext<GoogleAccountContextType | undefined>(undefined);

export function GoogleAccountProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { toast } = useToast();

  const connect = (emailToConnect: string) => {
    // Simulate asking the user to pick an account.
    // For this simulation, we'll use a prompt. In a real app, this would be the Google OAuth pop-up.
    const selectedEmail = prompt("Bitte gib die E-Mail-Adresse des Google-Kontos ein, das du verknüpfen möchtest:", "t4re66@gmail.com");

    if (!selectedEmail) {
        toast({
            variant: 'destructive',
            title: 'Verknüpfung abgebrochen',
            description: 'Es wurde kein Google-Konto ausgewählt.',
        });
        return;
    }

    // --- Security Guard: Check if the email is exactly the allowed one ---
    if (selectedEmail !== "t4re66@gmail.com") {
        toast({
            variant: 'destructive',
            title: 'Zugriff verweigert',
            description: `Das Konto "${selectedEmail}" ist für diese Anwendung nicht autorisiert. Bitte wähle das korrekte Konto aus.`,
        });
        return;
    }

    // Simulate API call and success
    setTimeout(() => {
        setIsConnected(true);
        setUserEmail(selectedEmail);
        toast({
            title: 'Verbindung erfolgreich',
            description: `Du bist jetzt mit deinem Google-Konto "${selectedEmail}" verbunden.`,
        });
    }, 1000);
  };

  const disconnect = () => {
    setIsConnected(false);
    setUserEmail(null);
    toast({
      title: 'Verbindung getrennt',
      description: 'Die Verbindung zu deinem Google-Konto wurde getrennt.',
    });
  };

  return (
    <GoogleAccountContext.Provider value={{ isConnected, userEmail, connect, disconnect }}>
      {children}
    </GoogleAccountContext.Provider>
  );
}

export function useGoogleAccount() {
  const context = useContext(GoogleAccountContext);
  if (context === undefined) {
    throw new Error('useGoogleAccount must be used within a GoogleAccountProvider');
  }
  return context;
}
