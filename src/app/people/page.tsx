
'use client'

import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { UserCard } from "@/components/people/user-card"
import { UserProfileDialog } from "@/components/people/user-profile-dialog"
import type { TeamMember } from "@/lib/data"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"
import { getTeamMembers } from "@/lib/team-api"


export default function PeoplePage() {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMembers = async () => {
      setLoading(true);
      const members = await getTeamMembers();
      setTeamMembers(members);
      setLoading(false);
  }

  useEffect(() => {
    if (user) {
        fetchMembers();
    } else {
        setTeamMembers([]);
        setLoading(false);
    }
  }, [user]);

  const filteredMembers = teamMembers.filter(member => 
    member.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
          placeholder="Suche nach Name..."
          className="pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
        onUserUpdate={fetchMembers}
      />
    </div>
  );
}
