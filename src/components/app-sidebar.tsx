
'use client'

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  Home,
  Refrigerator,
  Timer,
  Users,
  HeartPulse,
  Settings,
  Coffee,
  Gift,
  Trophy,
  ListChecks,
  BookMarked,
  ShoppingCart,
  Map,
  Swords,
  BookText,
  Bot,
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Icons } from "./icons"

const mainMenuItems = [
  { href: "/dashboard", label: "Übersicht", icon: Home },
  { href: "/briefing", label: "Briefing", icon: BookText },
  { href: "/chatbot", label: "Chatbot", icon: Bot },
]

const teamMenuItems = [
    { href: "/people", label: "Team", icon: Users },
    { href: "/breaks", label: "Pausen", icon: Coffee },
    { href: "/birthdays", label: "Geburtstage", icon: Gift },
    { href: "/tournaments", label: "Turniere", icon: Swords },
];

const gamificationMenuItems = [
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/tasks", label: "Aufgaben", icon: ListChecks },
    { href: "/shop", label: "Shop", icon: ShoppingCart },
]

const toolsMenuItems = [
    { href: "/focus", label: "Fokus", icon: Timer },
    { href: "/check-in", label: "Check-in", icon: HeartPulse },
    { href: "/grades", label: "Notenblatt", icon: BookMarked },
];

const officeMenuItems = [
    { href: "/map", label: "Bürokarte", icon: Map },
    { href: "/fridge", label: "Kühlschrank", icon: Refrigerator },
]

export function AppSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-card text-primary-foreground">
            <Icons.logo className="size-5" />
          </div>
          <span className="text-lg font-semibold text-foreground group-data-[collapsible=icon]:hidden">
            OfficeZen
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
            {mainMenuItems.map(item => (
                <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                    <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label }}
                    >
                    <item.icon />
                    <span>{item.label}</span>
                    </SidebarMenuButton>
                </Link>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
        
        <SidebarSeparator />

        <SidebarGroup>
            <SidebarGroupLabel>Team</SidebarGroupLabel>
            <SidebarMenu>
                 {teamMenuItems.map(item => (
                    <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                        <SidebarMenuButton
                        isActive={isActive(item.href)}
                        tooltip={{ children: item.label }}
                        >
                        <item.icon />
                        <span>{item.label}</span>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
            <SidebarGroupLabel>Gamification</SidebarGroupLabel>
            <SidebarMenu>
                 {gamificationMenuItems.map(item => (
                    <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                        <SidebarMenuButton
                        isActive={isActive(item.href)}
                        tooltip={{ children: item.label }}
                        >
                        <item.icon />
                        <span>{item.label}</span>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
            <SidebarGroupLabel>Werkzeuge</SidebarGroupLabel>
            <SidebarMenu>
                 {toolsMenuItems.map(item => (
                    <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                        <SidebarMenuButton
                        isActive={isActive(item.href)}
                        tooltip={{ children: item.label }}
                        >
                        <item.icon />
                        <span>{item.label}</span>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>

         <SidebarGroup>
            <SidebarGroupLabel>Büro</SidebarGroupLabel>
            <SidebarMenu>
                 {officeMenuItems.map(item => (
                    <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                        <SidebarMenuButton
                        isActive={isActive(item.href)}
                        tooltip={{ children: item.label }}
                        >
                        <item.icon />
                        <span>{item.label}</span>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                 <SidebarMenuButton tooltip={{ children: "Einstellungen" }}>
                    <Settings/>
                    <span>Einstellungen</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
