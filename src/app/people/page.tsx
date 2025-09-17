'use client'

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { teamMembers as initialTeamMembers } from "@/lib/data"
import { UserCard } from "@/components/people/user-card"
import { UserProfileDialog } from "@/components/people/user-profile-dialog"
import type { User } from "@/lib/data"

export default function PeoplePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // We use state to hold teamMembers so UI can re-render when check-in updates it.
  const [teamMembers, setTeamMembers] = useState<User[]>(initialTeamMembers);

  useEffect(() => {
    // This effect ensures that if the underlying data changes (e.g. via check-in),
    // the component reflects the change. A more robust solution might involve a global state manager.
    const interval = setInterval(() => {
      setTeamMembers([...initialTeamMembers]);
    }, 1000); // Check for updates every second

    return () => clearInterval(interval);
  }, []);

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          placeholder="Suche nach Name, Rolle oder Abteilung..."
          className="pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <button key={member.id} onClick={() => setSelectedUser(member)} className="text-left h-full w-full">
              <UserCard user={member} />
            </button>
          ))
        ) : (
          <p className="text-muted-foreground col-span-full text-center py-12">Keine Teammitglieder gefunden.</p>
        )}
      </div>
      
      <UserProfileDialog 
        user={selectedUser} 
        open={!!selectedUser} 
        onOpenChange={(open) => !open && setSelectedUser(null)} 
      />
    </div>
  );
}
