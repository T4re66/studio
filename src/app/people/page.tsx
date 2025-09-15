'use client'

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { teamMembers } from "@/lib/data"
import { UserCard } from "@/components/people/user-card"

export default function PeoplePage() {
  const [searchTerm, setSearchTerm] = useState("");

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
            <UserCard key={member.id} user={member} />
          ))
        ) : (
          <p className="text-muted-foreground col-span-full text-center py-12">Keine Teammitglieder gefunden.</p>
        )}
      </div>
    </div>
  );
}
