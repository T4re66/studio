import type { Metadata } from 'next';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { FloatingWalkieTalkie } from '@/components/walkie-talkie/floating-walkie-talkie';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col w-full">
            <AppHeader />
            <main className="p-4 sm:p-6 lg:p-8">
              {children}
            </main>
        </div>
        <FloatingWalkieTalkie />
    </SidebarProvider>
  );
}
