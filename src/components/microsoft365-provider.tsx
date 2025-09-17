
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Microsoft365ContextType {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const Microsoft365Context = createContext<Microsoft365ContextType | undefined>(undefined);

export function Microsoft365Provider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  // In a real app, this would trigger the OAuth flow.
  const connect = () => {
    // Simulate API call and success
    setTimeout(() => {
        setIsConnected(true);
        toast({
            title: 'Verbindung erfolgreich',
            description: 'Du bist jetzt mit deinem Microsoft 365 Konto verbunden.',
        });
    }, 1000);
  };

  const disconnect = () => {
    setIsConnected(false);
    toast({
      title: 'Verbindung getrennt',
      description: 'Die Verbindung zu deinem Microsoft 365 Konto wurde getrennt.',
    });
  };

  return (
    <Microsoft365Context.Provider value={{ isConnected, connect, disconnect }}>
      {children}
    </Microsoft365Context.Provider>
  );
}

export function useMicrosoft365() {
  const context = useContext(Microsoft365Context);
  if (context === undefined) {
    throw new Error('useMicrosoft365 must be used within a Microsoft365Provider');
  }
  return context;
}
