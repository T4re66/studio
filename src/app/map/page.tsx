'use client'

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { OfficeMap } from "@/components/office-map";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { teamMembers } from '@/lib/data';
import { UserCard } from '@/components/people/user-card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pin } from 'lucide-react';
import type { User } from '@/lib/data';

export default function MapPage() {
    const [highlightedSeat, setHighlightedSeat] = useState<string | null>(null);
    
    const officeMembers = teamMembers.filter(m => m.status === 'office' && m.seat);

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Bürokarte"
                description="Finde heraus, wer heute wo im Büro sitzt."
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <OfficeMap highlightedSeat={highlightedSeat} />
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
                                            variant={highlightedSeat === member.seat ? "default" : "ghost"}
                                            onClick={() => setHighlightedSeat(highlightedSeat === member.seat ? null : member.seat!)}
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
