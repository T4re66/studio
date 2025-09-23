
'use client'

import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { UserCard } from "@/components/people/user-card"
import { UserProfileDialog } from "@/components/people/user-profile-dialog"
<<<<<<< HEAD
import type { TeamMember } from "@/lib/data"
import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"


export default function PeoplePage() {
  const { teamMembers, loading, refetchTeam } = useAuth();
  const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = useMemo(() => {
    return teamMembers.filter(member => 
      member.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [teamMembers, searchTerm]);
=======
import type { User } from "@/lib/data"
import Link from "next/link"

const placeholderMembers: User[] = [
  { id: '1', name: 'Tarec', avatar: 'https://picsum.photos/seed/user1/200/200', status: 'office', role: 'Frontend Developer', department: 'Engineering', lastSeen: 'now', dnd: false, points: 1250, birthday: '1990-07-15', seat: 'A4', online: true, mood: 5 },
  { id: '2', name: 'Bob Williams', avatar: 'https://picsum.photos/seed/user2/200/200', status: 'remote', role: 'Backend Developer', department: 'Engineering', lastSeen: '2h ago', dnd: true, points: 800, birthday: '1988-11-22', online: true, mood: 3 },
  { id: '3', name: 'Charlie Brown', avatar: 'https://picsum.photos/seed/user3/200/200', status: 'office', role: 'UI/UX Designer', department: 'Design', lastSeen: '5m ago', dnd: false, points: 1500, birthday: '1995-03-30', seat: 'B2', online: true, mood: 4 },
  { id: '4', name: 'Diana Miller', avatar: 'https://picsum.photos/seed/user4/200/200', status: 'office', role: 'Product Manager', department: 'Product', lastSeen: '15m ago', dnd: false, points: 1100, birthday: '1992-09-05', seat: 'C1', online: true, mood: 2 },
  { id: '5', name: 'Ethan Davis', avatar: 'https://picsum.photos/seed/user5/200/200', status: 'away', role: 'QA Engineer', department: 'Engineering', lastSeen: 'yesterday', dnd: false, points: 600, birthday: '1993-12-10', online: false, mood: 5 },
];


export default function PeoplePage() {
  const filteredMembers = placeholderMembers;
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Team"
        description="Finde heraus, wer heute arbeitet und wo."
      />
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Suche nach Name..."
          className="pl-10 w-full"
        />
      </div>
<<<<<<< HEAD

      {loading && (
          <div className="flex justify-center items-center py-12 gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Lade Teammitglieder...</span>
          </div>
      )}

      {!loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <button key={member.id} className="text-left h-full w-full" onClick={() => setSelectedUser(member)}>
                <UserCard user={member} />
              </button>
            ))
          ) : (
            <p className="text-muted-foreground col-span-full text-center py-12">
              {teamMembers.length === 0 ? "Noch keine Teammitglieder hinzugefügt." : "Keine Teammitglieder gefunden."}
            </p>
          )}
        </div>
      )}
      
      <UserProfileDialog 
        user={selectedUser} 
        open={!!selectedUser} 
        onOpenChange={(open) => !open && setSelectedUser(null)}
        onUserUpdate={refetchTeam}
      />
=======
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            // The button is replaced by a div, onClick is removed for UI shell.
            // A profile dialog is too complex for a UI shell, so it's removed.
            <div key={member.id} className="text-left h-full w-full">
              <UserCard user={member} />
            </div>
          ))
        ) : (
          <p className="text-muted-foreground col-span-full text-center py-12">Keine Teammitglieder gefunden.</p>
        )}
      </div>
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
    </div>
  );
}
