import { House, Package, Truck, Cube, Star } from "phosphor-react"
import { useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import React from "react"
import { Link } from "react-router-dom"
import { useIsMobile } from "@/hooks/use-mobile"

const items = [
  {
    title: "Solicitações",
    url: "/app/solicitacoes",
    icon: Package,
  },
  {
    title: "Gerenciar rotas",
    url: "/app/rotas-atendidas",
    icon: Truck,
  },
  {
    title: "Avaliações",
    url: "/app/avaliacoes",
    icon: Star,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { toggleSidebar } = useSidebar()
  const isMobile = useIsMobile()

  function handleSidebarToggle() {
    if (isMobile) {
      toggleSidebar()
    }
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Teruel Express</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title} onClick={handleSidebarToggle}>
                    <SidebarMenuButton asChild className="h-10">
                      <Link to={item.url}>
                        <item.icon
                          className="size-10"
                          weight={isActive ? "fill" : "regular"} // Change weight here
                        />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}