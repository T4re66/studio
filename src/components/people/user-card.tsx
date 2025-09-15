import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/componentsui/card";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Moon } from "lucide-react";

const statusInfo: {
  [key in User['status']]: { label: string; className: string };
} = {
  office: { label: "Im Büro", className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" },
  remote: { label: "Remote", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" },
  away: { label: "Abwesend", className: "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300" },
};

const statusDotClasses = {
  office: "bg-green-500",
  remote: "bg-blue-500",
  away: "bg-gray-400",
};

export function UserCard({ user }: { user: User }) {
  const info = statusInfo[user.status];
  return (
    <Card className="hover:bg-muted/50 transition-colors h-full">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-14 w-14">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span
            className={cn(
              "absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full border-2 border-card",
              statusDotClasses[user.status]
            )}
            title={info.label}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base">{user.name}</h3>
            {user.dnd && (
              <Badge variant="secondary" className="px-1.5 py-0.5 h-fit" title="Nicht stören">
                <Moon className="h-3 w-3" />
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{user.role}</p>
          <Badge variant="outline" className={cn("mt-2 text-xs border-0", info.className)}>
            {info.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
