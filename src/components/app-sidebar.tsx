"use client"

import {
  LayoutDashboard,
  CalendarDays,
  ListTodo,
  Focus,
  Heart,
  Settings,
  ShieldCheck,
  Zap
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Timetable",
    url: "/timetable",
    icon: CalendarDays,
  },
  {
    title: "Assignments",
    url: "/assignments",
    icon: ListTodo,
  },
  {
    title: "Focus Mode",
    url: "/focus",
    icon: Zap,
  },
  {
    title: "Wellness Hub",
    url: "/wellness",
    icon: Heart,
  },
  {
    title: "App Blocking",
    url: "/blocking",
    icon: ShieldCheck,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4 flex flex-row items-center gap-2">
        <div className="bg-primary p-2 rounded-lg">
          <Zap className="text-white w-5 h-5" />
        </div>
        <span className="font-headline font-bold text-xl text-primary tracking-tight group-data-[collapsible=icon]:hidden">
          Aura Academic
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="h-11"
                  >
                    <Link href={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border group-data-[collapsible=icon]:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold">JD</div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Jane Doe</span>
            <span className="text-xs text-muted-foreground">Premium Plan</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
