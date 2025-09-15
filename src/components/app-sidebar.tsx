'use client'

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  Home,
  Refrigerator,
  Timer,
  Users,
  HeartPulse,
  Settings,
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Icons } from "./icons"

const menuItems = [
  { href: "/", label: "Übersicht", icon: Home },
  { href: "/fridge", label: "Kühlschrank", icon: Refrigerator },
  { href: "/focus", label: "Fokus", icon: Timer },
  { href: "/people", label: "Team", icon: Users },
  { href: "/check-in", label: "Check-in", icon: HeartPulse },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icons.logo className="size-5" />
          </div>
          <span className="text-lg font-semibold text-foreground group-data-[collapsible=icon]:hidden">
            OfficeZen
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(item => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
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
