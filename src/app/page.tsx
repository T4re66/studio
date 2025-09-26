
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BrainCircuit, Eye, Refrigerator, Users, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const features = [
  {
    icon: <Users className="h-8 w-8" />,
    title: "Team-Zentrale",
    description: "Behalte den Überblick über dein Team, plane Pausen und feiere Geburtstage.",
  },
  {
    icon: <Refrigerator className="h-8 w-8" />,
    title: "Büro-Helfer",
    description: "Organisiere den Kühlschrank, finde freie Plätze und bleibe fokussiert.",
  },
    {
    icon: <BrainCircuit className="h-8 w-8" />,
    title: "Tages-Briefing",
    description: "Starte organisiert in den Tag mit smarten Zusammenfassungen deiner Infos.",
  },
];

function AuthButtons() {
    const { user, team, signIn, loading, enterPreviewMode, isPreview } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return; // Wait until loading is finished

        if (user && (team || isPreview)) {
            router.push('/dashboard');
        }
    }, [user, team, isPreview, router, loading]);


    if (loading) {
        return (
             <div className="mt-8 flex items-center justify-center h-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="mt-8 flex flex-col items-center justify-center gap-4">
                <Button size="lg" onClick={signIn}>
                    <Icons.logo className="mr-2" />
                    Mit Google anmelden
                </Button>
                 <Button size="lg" variant="outline" onClick={enterPreviewMode}>
                    <Eye className="mr-2" />
                    Vorschau ansehen
                </Button>
            </div>
        )
    }
    
    // User is logged in but doesn't have a team yet.
    if (user && !team && !isPreview) {
         return (
            <div className="mt-8 flex flex-col items-center justify-center gap-4">
                <p className="font-semibold">Nächster Schritt:</p>
                <div className="flex gap-4">
                     <Button asChild size="lg" variant="outline">
                        <Link href="/team/select">Team erstellen</Link>
                     </Button>
                    <Button asChild size="lg">
                        <Link href="/team/select">Team beitreten</Link>
                    </Button>
                </div>
            </div>
        )
    }

    // This part should ideally not be seen due to the useEffect redirect.
    return (
        <div className="mt-8 flex flex-col items-center justify-center gap-4 h-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    )

}


export default function LandingPage() {
  return (
        <div className="flex flex-col min-h-screen bg-background">
             <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-card text-primary-foreground">
                            <Icons.logo className="size-5" />
                        </div>
                        <span className="text-lg font-semibold text-foreground">
                            OfficeZen
                        </span>
                    </Link>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="container mx-auto px-4 py-20 text-center sm:py-32">
                    <h1 className="text-4xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl font-headline gradient-text">
                        Dein Büro. Organisiert. Vernetzt.
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                        OfficeZen ist die All-in-One-Lösung, die den Büroalltag vereinfacht, die Zusammenarbeit fördert und mit smarten Funktionen und Gamification für mehr Spass bei der Arbeit sorgt.
                    </p>
                    <AuthButtons />
                </section>

                {/* Feature Image Section */}
                <section className="container mx-auto px-4 pb-20">
                     <Card className="overflow-hidden shadow-2xl shadow-primary/10">
                        <CardContent className="p-2 relative aspect-[12/8]">
                             <Image
                                src="https://picsum.photos/seed/modern-office/1200/800"
                                alt="Ein modernes und helles Büro mit Menschen, die zusammenarbeiten"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="rounded-lg object-cover"
                                data-ai-hint="modern office"
                            />
                        </CardContent>
                    </Card>
                </section>


                {/* Features Section */}
                <section className="bg-muted/50 py-20 sm:py-32">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">Alles, was dein Team braucht</h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Von der Pausenplanung bis zum Gamification-Wettbewerb – OfficeZen hat die richtigen Werkzeuge.
                            </p>
                        </div>
                        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                            {features.map((feature, index) => (
                                <Card key={index} className="text-center">
                                    <CardContent className="p-8">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            {feature.icon}
                                        </div>
                                        <h3 className="mt-6 font-headline text-xl font-semibold">{feature.title}</h3>
                                        <p className="mt-2 text-muted-foreground">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t">
                <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
                    <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} OfficeZen. Alle Rechte vorbehalten.</p>
                     <nav className="flex gap-4">
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
