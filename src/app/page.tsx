import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { teamMembers, emails } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Coffee, Gift, Mail, Medal, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { summarizeEmails } from "@/ai/flows/summarize-emails-flow";

const statusClasses: { [key: string]: string } = {
  office: "bg-green-500",
  remote: "bg-blue-500",
  away: "bg-gray-400",
};

function getNextBirthday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const currentYear = today.getFullYear();

    let nextBirthdayMember: (typeof teamMembers[0]) | null = null;
    let minDays = Infinity;

    teamMembers.forEach(member => {
        const birthday = new Date(member.birthday);
        birthday.setFullYear(currentYear);

        if (birthday < today) {
            birthday.setFullYear(currentYear + 1);
        }

        const diffTime = birthday.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < minDays) {
            minDays = diffDays;
            nextBirthdayMember = member;
        }
    });

    return { member: nextBirthdayMember, days: minDays };
}


export default async function Home() {
  const onlineMembers = teamMembers.filter(m => m.status === 'office');
  const currentUser = teamMembers[0]; // Assuming current user is Alice
  const nextBirthday = getNextBirthday();
  const emailSummary = await summarizeEmails(emails.filter(e => !e.isRead));


  return (
    <div className="flex flex-col gap-8 fade-in">
      <PageHeader
        title={`Hallo, ${currentUser.name.split(' ')[0]}!`}
        description="Willkommen zurück! Hier ist dein Überblick für heute."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        
        {/* Who is where */}
        <Card className="xl:col-span-2 transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">Wer ist im Büro?</CardTitle>
              <CardDescription>{onlineMembers.length} von {teamMembers.length} Kollegen sind da.</CardDescription>
            </div>
             <Link href="/people">
              <Button variant="ghost" size="sm">Alle anzeigen</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {onlineMembers.slice(0, 7).map((member) => (
                <Link href="/people" key={member.id}>
                  <div className="flex flex-col items-center gap-2 group">
                    <Avatar className="h-14 w-14 border-2 border-transparent group-hover:border-primary transition-all duration-300 transform group-hover:scale-110">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                       <span
                        className={cn(
                          "absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full border-2 border-card",
                          statusClasses[member.status]
                        )}
                      />
                    </Avatar>
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{member.name.split(' ')[0]}</span>
                  </div>
                </Link>
              ))}
               {onlineMembers.length > 7 && (
                 <div className="flex flex-col items-center justify-center gap-2">
                    <Avatar className="h-14 w-14 bg-muted">
                      <AvatarFallback>+{onlineMembers.length - 7}</AvatarFallback>
                    </Avatar>
                     <span className="text-xs font-medium text-muted-foreground">Weitere</span>
                  </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Break Matcher */}
        <Link href="/breaks">
          <Card className="h-full flex flex-col justify-between transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-primary/50 hover:bg-primary/5">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-3"><Coffee className="text-primary"/>Pausen-Matcher</CardTitle>
              <CardDescription>Finde Kollegen für eine gemeinsame Pause.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-semibold">Nächster Match:</p>
              <p className="text-sm text-muted-foreground">Mittagessen mit Charlie um 12:30</p>
            </CardContent>
             <CardFooter>
              <Button className="w-full">Pausenzeit eintragen</Button>
            </CardFooter>
          </Card>
        </Link>
        
        {/* Leaderboard */}
         <Link href="/leaderboard">
            <Card className="h-full flex flex-col justify-between transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-accent/50 hover:bg-accent/5">
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-3"><Medal className="text-accent"/>Punktestand</CardTitle>
                  <CardDescription>Dein aktueller Rang im Team.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-4xl font-bold text-accent">{currentUser.points}</p>
                    <p className="text-sm text-muted-foreground">Punkte</p>
                    <p className="font-semibold mt-2">Rang 3 von {teamMembers.length}</p>
                </CardContent>
                 <CardFooter>
                    <p className="text-xs text-muted-foreground text-center w-full">Mach weiter so!</p>
                </CardFooter>
            </Card>
        </Link>

        {/* AI Inbox */}
        <Card className="xl:col-span-2 transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
           <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline flex items-center gap-2"><Sparkles className="text-primary w-5 h-5"/>KI-Posteingang</CardTitle>
              <CardDescription>Deine wichtigsten E-Mails zusammengefasst.</CardDescription>
            </div>
             <Link href="/inbox">
              <Button variant="ghost" size="sm">Alle anzeigen</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
             <p className="text-sm text-muted-foreground">{emailSummary.summary}</p>
          </CardContent>
        </Card>
        
        {/* Birthday calendar */}
        <Link href="/birthdays">
            <Card className="h-full flex flex-col justify-between transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
                 <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-3"><Gift className="text-pink-500"/>Geburtstage</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                   {nextBirthday.member && (
                    <>
                        <Avatar className="h-20 w-20 mx-auto border-4 border-pink-300">
                            <AvatarImage src={nextBirthday.member.avatar} alt={nextBirthday.member.name} />
                            <AvatarFallback>{nextBirthday.member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="font-semibold mt-3">{nextBirthday.member.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {nextBirthday.days === 0 ? 'hat heute Geburtstag!' : `wird in ${nextBirthday.days} Tagen ${new Date().getFullYear() - new Date(nextBirthday.member.birthday).getFullYear()}!`}
                        </p>
                    </>
                   )}
                </CardContent>
                 <CardFooter>
                    <Button variant="outline" className="w-full">Zum Kalender</Button>
                </CardFooter>
            </Card>
        </Link>
      </div>
    </div>
  );
}
