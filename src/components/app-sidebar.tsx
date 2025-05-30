import { House, Package, Truck, Cube, Star } from "phosphor-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import React from "react"
import { Link } from "react-router-dom"

// Menu items.
const items = [
  {
    title: "Página inicial",
    url: "/app/home",
    icon: House,
  },
  {
    title: "Solicitar orçamento",
    url: "/app/orcamento",
    icon: Package,
  },
  {
    title: "Solicitações",
    url: "/app/solicitacoes",
    icon: Package,
  },
  {
    title: "Rotas atendidas",
    url: "/app/rotas-atendidas",
    icon: Truck,
  },
  {
    title: "Avaliacoes",
    url: "/app/avaliacoes",
    icon: Star,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Teruel Express</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <Link to={item.url}>
                      <item.icon className="size-10"/>
                      <span className="text-base">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
