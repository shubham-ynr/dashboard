import * as React from "react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import LogoIcon from "./LogoIcon"
import Logo from "./Logo"

export function TeamSwitcher() {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div
                className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <LogoIcon className="h-8" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <Logo className="h-5" />
              </div>
            </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
