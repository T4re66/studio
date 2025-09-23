
'use client'

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { FloatingWalkieTalkie } from '@/components/walkie-talkie/floating-walkie-talkie';
import { ThemeProvider } from '@/components/theme-provider';

function AppLayout({ children }: { children: React.ReactNode }) {
  // The logic to differentiate between landing page and app layout has been removed
  // to create a consistent UI shell.
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col flex-1">
          <AppHeader />
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
      </div>
      <FloatingWalkieTalkie />
    </SidebarProvider>
  )
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
      <body className={cn('min-h-screen bg-background font-body antialiased flex')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {/* AuthProvider has been removed */}
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
