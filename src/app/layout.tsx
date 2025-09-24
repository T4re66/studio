
'use client'

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { FloatingWalkieTalkie } from '@/components/walkie-talkie/floating-walkie-talkie';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';


function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, team } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait until loading is finished

    const isAuthRoute = pathname === '/';
    const isTeamSelectRoute = pathname === '/team/select';

    if (user) {
      // User is logged in
      if (!team && !isTeamSelectRoute) {
        // User has no team, redirect to team selection
        router.replace('/team/select');
      }
    } else if (!isAuthRoute) {
      // User is not logged in and not on the public landing page -> redirect there
      router.replace('/');
    }
  }, [user, loading, team, pathname, router]);

  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  // Render children without sidebar for auth pages
  const noSidebarRoutes = ['/', '/team/select'];
  const showSidebar = user && !noSidebarRoutes.includes(pathname);
  
  if (showSidebar) {
    return (
        <SidebarProvider>
            <div className='flex min-h-screen'>
                <AppSidebar />
                <div className="flex flex-col flex-1">
                    <AppHeader />
                    <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                    </main>
                </div>
                <FloatingWalkieTalkie />
            </div>
        </SidebarProvider>
    )
  }
  
  // Render children without layout for public/special pages
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lexend:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <AuthProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
