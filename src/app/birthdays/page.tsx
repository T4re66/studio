import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { teamMembers } from "@/lib/data";
import { format, parseISO, isSameMonth, getMonth } from 'date-fns';
import { de } from 'date-fns/locale';

export default function BirthdaysPage() {
    const today = new Date();
    const currentMonth = getMonth(today);

    const sortedMembers = [...teamMembers].sort((a, b) => {
        const dateA = parseISO(a.birthday);
        const dateB = parseISO(b.birthday);
        return dateA.getDate() - dateB.getDate();
    });

    const membersByMonth: { [key: number]: typeof teamMembers } = {};
    sortedMembers.forEach(member => {
        const month = getMonth(parseISO(member.birthday));
        if (!membersByMonth[month]) {
            membersByMonth[month] = [];
        }
        membersByMonth[month].push(member);
    });
    
    const months = Array.from({length: 12}, (_, i) => i);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Geburtstags-Kalender"
        description="Alle Geburtstage des Teams auf einen Blick."
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {months.map(month => (
            <Card key={month} className={month === currentMonth ? 'border-primary' : ''}>
                <CardContent className="p-4">
                    <h3 className="font-headline text-lg mb-4">{format(new Date(2024, month, 1), 'MMMM', {locale: de})}</h3>
                    <div className="space-y-3">
                        {membersByMonth[month] ? (
                            membersByMonth[month].map(member => (
                                <div key={member.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{member.name}</p>
                                            <p className="text-sm text-muted-foreground">{member.role}</p>
                                        </div>
                                    </div>
                                    <p className="font-mono text-sm">{format(parseISO(member.birthday), 'dd.')}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">Keine Geburtstage in diesem Monat.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
