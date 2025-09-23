
'use client';

<<<<<<< HEAD
import { useState, useEffect, useMemo } from 'react';
=======
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Coffee, Gift, Medal, Sparkles, ArrowRight, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { isSameDay } from "date-fns";
>>>>>>> ef6eeef (geht immernoch nicht auf das github passe alles so an das es zu 100pro f)
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { TeamMember } from "@/lib/data";
import { useAuth } from '@/hooks/use-auth';
import { fetchCalendar, fetchGmail } from '@/lib/google-api';
import { getDailyBriefing } from '@/ai/flows/daily-briefing-flow';
import { parseISO, differenceInDays } from 'date-fns';
import { liveEmails, liveCalendarEvents } from '@/lib/data';
=======
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { User } from "@/lib/data";


// --- Placeholder Data for UI Shell ---
const placeholderMembers: User[] = [
  { id: '1', name: 'Tarec', avatar: 'https://picsum.photos/seed/user1/200/200', status: 'office', role: 'Frontend Developer', department: 'Engineering', lastSeen: 'now', dnd: false, points: 1250, birthday: '1990-07-15', seat: 'A4', online: true, mood: 5 },
  { id: '3', name: 'Charlie Brown', avatar: 'https://picsum.photos/seed/user3/200/200', status: 'office', role: 'UI/UX Designer', department: 'Design', lastSeen: '5m ago', dnd: false, points: 1500, birthday: '1995-03-30', seat: 'B2', online: true, mood: 4 },
  { id: '4', name: 'Diana Miller', avatar: 'https://picsum.photos/seed/user4/200/200', status: 'office', role: 'Product Manager', department: 'Product', lastSeen: '15m ago', dnd: false, points: 1100, birthday: '1992-09-05', seat: 'C1', online: true, mood: 2 },
  { id: '7', name: 'George Clark', avatar: 'https://picsum.photos/seed/user7/200/200', status: 'office', role: 'DevOps Engineer', department: 'Engineering', lastSeen: 'now', dnd: true, points: 1300, birthday: '1989-08-25', seat: 'A3', online: true, mood: 3 },
];
const currentUser = placeholderMembers[0];
const nextBirthday = { member: placeholderMembers[1], days: 10 };
const nextBreakMatch = { user1: placeholderMembers[0], user2: placeholderMembers[1], time: "12:30" };
// --- End Placeholder Data ---
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)


const statusClasses: { [key: string]: string } = {
  office: "bg-green-500",
  remote: "bg-blue-500",
  away: "bg-gray-400",
};

const getSeatPosition = (index: number, total: number, tableWidth: number, tableHeight: number) => {
    const angle = (index / total) * 2 * Math.PI;
    const x = 50 + (tableWidth / 2) * Math.cos(angle);
    const y = 50 + (tableHeight / 2) * Math.sin(angle);
    return { left: `${x.toPrecision(6)}%`, top: `${y.toPrecision(6)}%` };
};

const AnimatedCounter = ({ to }: { to: number }) => {
<<<<<<< HEAD
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const duration = 1000;
        const frameRate = 60;
        const totalFrames = duration / (1000 / frameRate);
        let increment = (to - displayValue) / totalFrames;
        let current = displayValue;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= to) || (increment < 0 && current <= to)) {
                clearInterval(timer);
                current = to;
            }
            setDisplayValue(Math.floor(current));
        }, 1000 / frameRate);

        return () => clearInterval(timer);

    }, [to, displayValue]);

    return <>{displayValue.toLocaleString()}</>;
=======
    // State and animation logic removed for UI shell
    return <>{to.toLocaleString()}</>;
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
}


export default function DashboardPage() {
<<<<<<< HEAD
  const { user, accessToken, team, teamMembers, teamMember, loading, isPreview } = useAuth();
  const [briefing, setBriefing] = useState<string | null>(null);
  const [isLoadingBriefing, setIsLoadingBriefing] = useState(true);

  const currentUser = teamMember;
  
  const sortedLeaderboard = useMemo(() => {
      return [...teamMembers].sort((a,b) => b.points - a.points)
  }, [teamMembers]);

  const currentUserRank = useMemo(() => {
    if (!currentUser) return 0;
    return sortedLeaderboard.findIndex(m => m.id === currentUser.id) + 1;
  }, [sortedLeaderboard, currentUser]);

  const nextBirthday = useMemo(() => {
      const today = new Date();
      today.setHours(0,0,0,0);

      const upcoming = teamMembers
        .filter(m => m.birthday)
        .map(member => {
            const birthDate = parseISO(member.birthday);
            const nextBirthdayDate = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
            if (nextBirthdayDate < today) {
                nextBirthdayDate.setFullYear(today.getFullYear() + 1);
            }
            return {
                member,
                days: differenceInDays(nextBirthdayDate, today),
            };
        })
        .sort((a,b) => a.days - b.days);
    
      return upcoming[0] || null;

  }, [teamMembers]);

  const nextBreakMatch = useMemo(() => {
      const lunchGroups: { [time: string]: TeamMember[] } = {};
      teamMembers.forEach(member => {
          if (member.lunchTime) {
              if (!lunchGroups[member.lunchTime]) lunchGroups[member.lunchTime] = [];
              lunchGroups[member.lunchTime].push(member);
          }
      });
      const matches = Object.values(lunchGroups).filter(group => group.length > 1);
      if (matches.length > 0 && matches[0].length >=2) {
          return { user1: matches[0][0], user2: matches[0][1], time: matches[0][0].lunchTime || '' };
      }
      return null;
  }, [teamMembers]);

  const onlineMembers = useMemo(() => teamMembers.filter(m => m.status === 'office'), [teamMembers]);
  const tableWidth = 45;
  const tableHeight = 90;

  useEffect(() => {
    const loadBriefing = async () => {
        setIsLoadingBriefing(true);
<<<<<<< HEAD
        if (isPreview) {
            const summary = await getDailyBriefing({ emails: liveEmails, events: liveCalendarEvents });
            setBriefing(summary);
        } else if (accessToken) {
            try {
                const [emails, events] = await Promise.all([
                    fetchGmail(accessToken),
                    fetchCalendar(accessToken)
                ]);
                const unreadEmails = emails.filter(e => !e.isRead);
                const summary = await getDailyBriefing({ emails: unreadEmails, events });
                setBriefing(summary);
            } catch (err) {
                console.error("Failed to load daily briefing:", err);
                setBriefing("Fehler beim Laden des Briefings. Bitte prüfe deine Google-Verbindung in den Einstellungen.");
            }
        } else {
             setBriefing("Verbinde dein Google-Konto, um ein persönliches Tages-Briefing zu erhalten.");
        }
        setIsLoadingBriefing(false);
    };
    if (!loading) { // Only load briefing when auth is done
        loadBriefing();
=======
        // This is a placeholder now. In a real app you would fetch this.
        setBriefing({
            emailSummary: "Dein Posteingang ist aufgeräumt. Wichtige E-Mail von 'Projekt Phoenix' bezüglich der Action Items.",
            calendarSummary: "Dein Tag ist voll! Wichtigstes Ereignis: 'Project Phoenix Sync' um 10:00 Uhr.",
            notesSummary: "Deine Notizen deuten auf offene Punkte beim 'Project Phoenix' hin. Dies scheint heute Priorität zu haben."
        });
        setIsLoadingBriefing(false);
>>>>>>> ef6eeef (geht immernoch nicht auf das github passe alles so an das es zu 100pro f)
    }
  }, [accessToken, isPreview, loading]);


  if (loading) {
      return (
          <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      )
  }

  if (!team && !isPreview) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <PageHeader
                title={`Willkommen, ${user?.displayName?.split(' ')[0] || 'User'}!`}
                description="Du bist noch keinem Team beigetreten. Erstelle eines oder tritt einem bei, um loszulegen."
            />
            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-md">
                 <Button asChild size="lg" className="w-full">
                    <Link href="/team/select">Team beitreten</Link>
                </Button>
                 <Button asChild size="lg" variant="outline" className="w-full">
                    <Link href="/team/select">Team erstellen</Link>
                </Button>
            </div>
        </div>
    )
  }
  
  const pageDescription = team ? `Willkommen zurück bei Team "${team.name}"! Hier ist dein Überblick für heute.` : "Hier ist ein Überblick, wie dein Dashboard aussehen könnte. Erkunde die App!";
=======
  const onlineMembers = placeholderMembers.filter(m => m.status === 'office');
  const tableWidth = 45;
  const tableHeight = 90;
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)

  return (
    <div className="flex flex-col gap-8 fade-in">
      <PageHeader
        title={`Hallo, ${currentUser?.name?.split(' ')[0] || 'Gast'}!`}
        description={pageDescription}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 flex flex-col gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Wer ist heute im Büro?</CardTitle>
                    <CardDescription>{onlineMembers.length} von {placeholderMembers.length} Kollegen sind anwesend.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center relative p-6 min-h-[350px]">
                    <div 
                        className="absolute w-[50%] h-full rounded-[50%] transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 opacity-50 blur-2xl"
                        style={{ background: 'var(--gradient)'}}
                    />
                    {onlineMembers.length > 0 ? onlineMembers.map((member, index) => {
                        const position = getSeatPosition(index, onlineMembers.length, tableWidth, tableHeight);
                        return (
                            <TooltipProvider key={member.id}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={`/people#${member.id}`}>
                                            <Avatar 
                                                className="h-14 w-14 border-2 border-card absolute transition-transform duration-300 transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 hover:border-primary"
                                                style={position}
                                            >
                                                {member.avatar && <AvatarImage src={member.avatar} alt={member.name || ''} />}
                                                <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                                                <span className={cn("absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full border-2 border-background", statusClasses[member.status])} />
                                            </Avatar>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="font-semibold">{member.name}</p>
                                        <p className="text-muted-foreground">Tisch {member.seat}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )
                    }) : (
                        <p className="text-muted-foreground">Heute ist niemand im Büro.</p>
                    )}
                </CardContent>
            </Card>

            <Card className="flex-1 flex flex-col bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-lg">
                        <Sparkles className="text-primary h-5 w-5"/>
                        Tages-Briefing
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4 overflow-y-auto">
<<<<<<< HEAD
                    {isLoadingBriefing ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin"/>
                            <span>KI-Zusammenfassung wird generiert...</span>
                        </div>
                    ) : (
                        <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                            {briefing}
                        </p>
                    )}
=======
                    <div>
                        <h4 className="font-semibold text-sm flex items-center gap-2 mb-1"><Mail className="h-4 w-4"/>Posteingang</h4>
                        <p className="text-sm text-foreground/80">
                            Zusammenfassung des Posteingangs wird hier angezeigt.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm flex items-center gap-2 mb-1"><CalendarDays className="h-4 w-4"/>Kalender</h4>
                        <p className="text-sm text-foreground/80">
                            Zusammenfassung des Kalenders wird hier angezeigt.
                        </p>
                    </div>
                        <div>
                        <h4 className="font-semibold text-sm flex items-center gap-2 mb-1"><Users className="h-4 w-4"/>Notizen</h4>
                        <p className="text-sm text-foreground/80">
                            Zusammenfassung der Notizen wird hier angezeigt.
                        </p>
                    </div>
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Link href="/briefing">
                        <Button variant="ghost" size="sm">Zum Briefing <ArrowRight className="ml-2"/></Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
        
        <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
            <Link href="/breaks" className="sm:col-span-1">
                <Card className="h-full flex flex-col justify-between transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden">
                     <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-3"><Coffee className="text-primary"/>Pausen</CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-col items-center justify-center text-center relative py-8'>
                         <div 
                            className="absolute w-full h-[80%] rounded-[50%] transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 opacity-30 blur-2xl -z-1"
                            style={{ background: 'var(--gradient)'}}
                         />
                         {nextBreakMatch ? (
                            <>
                                <div className="flex -space-x-4 z-10">
                                    <Avatar className="h-12 w-12 border-2 border-card">
                                        {nextBreakMatch.user1.avatar && <AvatarImage src={nextBreakMatch.user1.avatar} />}
                                        <AvatarFallback>{nextBreakMatch.user1.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <Avatar className="h-12 w-12 border-2 border-card">
                                        {nextBreakMatch.user2.avatar && <AvatarImage src={nextBreakMatch.user2.avatar} />}
                                        <AvatarFallback>{nextBreakMatch.user2.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <p className="text-sm font-semibold mt-3 z-10">Lunch um {nextBreakMatch.time}</p>
                                <p className="text-xs text-muted-foreground z-10">{nextBreakMatch.user1.name?.split(' ')[0]} & {nextBreakMatch.user2.name?.split(' ')[0]}</p>
                            </>
                         ) : (
                            <p className="text-muted-foreground z-10">Keine Pausen-Matches</p>
                         )}
                    </CardContent>
                </Card>
            </Link>

             <Link href="/leaderboard" className="sm:col-span-1">
                <Card className="h-full flex flex-col justify-between transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-3"><Medal className="text-accent"/>Punkte</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center flex-1 flex flex-col justify-center relative py-8">
                         <div 
                            className="absolute w-[80%] h-full rounded-[50%] transform -translate-x-1-2 -translate-y-1-2 top-1-2 left-1-2 opacity-30 blur-2xl -z-1 bg-accent/50"
                         />
                        <p className="text-5xl font-bold text-accent z-10">
                           <AnimatedCounter to={currentUser?.points || 0} />
                        </p>
                        {currentUserRank > 0 && <p className="font-semibold mt-1 z-10">Dein Rang: {currentUserRank}.</p>}
                    </CardContent>
                </Card>
            </Link>
            
            <Link href="/birthdays" className="sm:col-span-2 lg:col-span-1">
                 <Card className={cn(
                    "h-full flex flex-col justify-center items-center text-center transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden",
                    nextBirthday?.days === 0 && "bg-pink-100/50 border-pink-400"
                )}>
                     {nextBirthday?.days === 0 && <div className="absolute top-2 right-2 text-xs font-bold text-pink-600 bg-white/50 px-2 py-1 rounded-full animate-pulse">HEUTE!</div>}
                     <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-3"><Gift className="text-pink-500"/>Geburtstage</CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <div 
                            className="absolute w-full h-[150%] rounded-[50%] transform -translate-x-1-2 -translate-y-1-2 top-1-2 left-1-2 opacity-30 blur-2xl -z-1 bg-pink-500/50"
                         />
                    {nextBirthday?.member ? (
                        <>
                            <Avatar className="h-16 w-16 mx-auto border-4 border-pink-300">
                                {nextBirthday.member.avatar && <AvatarImage src={nextBirthday.member.avatar} alt={nextBirthday.member.name || ''} />}
                                <AvatarFallback>{nextBirthday.member.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="font-semibold mt-3 text-sm">{nextBirthday.member.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {nextBirthday.days === 0 ? 'hat heute Geburtstag!' : nextBirthday.member.birthday ? `wird in ${nextBirthday.days} Tagen ${new Date().getFullYear() - new Date(nextBirthday.member.birthday).getFullYear()}!` : `hat bald Geburtstag!`}
                            </p>
                        </>
                    ) : (
                        <p className="text-muted-foreground z-10">Keine anstehenden Geburtstage.</p>
                    )}
                    </CardContent>
                </Card>
            </Link>
        </div>
      </div>
    </div>
  );
}
