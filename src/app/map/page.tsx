
'use client'

import { PageHeader } from "@/components/page-header";
import { OfficeMap } from "@/components/office-map";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pin } from 'lucide-react';
import type { User } from '@/lib/data';

// Placeholder data for UI shell
const teamMembers: User[] = [
  { id: '1', name: 'Tarec', avatar: 'https://picsum.photos/seed/user1/200/200', status: 'office', role: 'Frontend Developer', department: 'Engineering', lastSeen: 'now', dnd: false, points: 1250, birthday: '1990-07-15', seat: 'A4', online: true, mood: 5 },
  { id: '3', name: 'Charlie Brown', avatar: 'https://picsum.photos/seed/user3/200/200', status: 'office', role: 'UI/UX Designer', department: 'Design', lastSeen: '5m ago', dnd: false, points: 1500, birthday: '1995-03-30', seat: 'B2', online: true, mood: 4 },
  { id: '4', name: 'Diana Miller', avatar: 'https://picsum.photos/seed/user4/200/200', status: 'office', role: 'Product Manager', department: 'Product', lastSeen: '15m ago', dnd: false, points: 1100, birthday: '1992-09-05', seat: 'C1', online: true, mood: 2 },
  { id: '7', name: 'George Clark', avatar: 'https://picsum.photos/seed/user7/200/200', status: 'office', role: 'DevOps Engineer', department: 'Engineering', lastSeen: 'now', dnd: true, points: 1300, birthday: '1989-08-25', seat: 'A3', online: true, mood: 3 },
];
// ---

export default function MapPage() {
    
    const officeMembers = teamMembers.filter(m => m.status === 'office' && m.seat);

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Bürokarte"
                description="Finde heraus, wer heute wo im Büro sitzt."
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <OfficeMap />
                </div>
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Heute im Büro</CardTitle>
                            <CardDescription>
                                {officeMembers.length} Kolleg{officeMembers.length === 1 ? 'e' : 'en'} sind heute vor Ort.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {officeMembers.length > 0 ? (
                                officeMembers.map(member => (
                                    <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={member.avatar} />
                                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{member.name}</p>
                                                <p className="text-sm text-muted-foreground">Tisch {member.seat}</p>
                                            </div>
                                        </div>
                                        <Button 
                                            size="icon" 
                                            variant="ghost"
                                        >
                                            <Pin className="h-5 w-5" />
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-center py-8">Heute ist niemand im Büro.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
