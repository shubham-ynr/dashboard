"use client"
import React from "react"

import { ChevronRight } from "lucide-react"
import * as Icons from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import adminMenu from "@/data/admin-menu"
import userMenu from "@/data/user-menu"
import { Link, usePage } from "@inertiajs/react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export function NavMain() {
  const { user } = usePage().props;
  const { state } = useSidebar();
  const menuStorageKey = `sidebar_last_opened_${user.role}`;
  const [openIndex, setOpenIndex] = React.useState(() => {
    const stored = localStorage.getItem(menuStorageKey);
    return stored !== null ? Number(stored) : null;
  });

  React.useEffect(() => {
    if (openIndex !== null) {
      localStorage.setItem(menuStorageKey, openIndex);
    }
  }, [openIndex, menuStorageKey]);

  const resolveIcon = (iconName) => {
    const Icon = Icons[iconName];
    return Icon ? <Icon className="w-4 h-4" /> : null;
  };

  const isActive = (href) => {
    return window.location.pathname === href;
  };

  const items = user.role === "admin" ? adminMenu : userMenu;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Panel Master</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => {
          const key = `menu-${item.name}-${item.sort ?? index}`;
          const isCollapsible = item.children && item.children.length > 0;
          const isActiveItem = isActive(item.href);
          if (isCollapsible) {
            if (state === "expanded") {
              return (
                <Collapsible
                  key={key}
                  asChild
                  open={openIndex === index}
                  onOpenChange={(open) => setOpenIndex(open ? index : null)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.name}>
                        {resolveIcon(item.icon)}
                        <span>{item.name}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.children.map((subItem, subIndex) => (
                          <SidebarMenuSubItem
                            key={`submenu-${subItem.name}-${subItem.sort ?? subIndex}`}
                          >
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem.href}>
                                {resolveIcon(subItem.icon)}
                                <span>{subItem.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            } else if (state === "collapsed") {
              return (
                <Popover key={key}>
                  <PopoverTrigger asChild>
                    <SidebarMenuButton tooltip={item.name}>
                      {resolveIcon(item.icon)}
                      <span>{item.name}</span>
                      <ChevronRight className="ml-auto" />
                    </SidebarMenuButton>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    side="right"
                    sideOffset={8}
                    className="p-0 rounded-xs shadow-lg ml-1 z-[50] min-w-[200px] max-w-[250px] w-full"
                  >
                    <SidebarMenuSub className="border-none p-2 m-0">
                      {item.children.map((subItem, subIndex) => (
                        <SidebarMenuSubItem
                          key={`submenu-${subItem.name}-${subItem.sort ?? subIndex}`}
                        >
                          <SidebarMenuSubButton asChild className={`rounded-xs ${isActive(subItem.href) ? "bg-accent text-accent-foreground" : ""}`}>
                            <Link href={subItem.href}>
                              {resolveIcon(subItem.icon)}
                              <span>{subItem.name}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </PopoverContent>
                </Popover>
              );
            }
          }

          return (
            <SidebarMenuItem key={key}>
              <SidebarMenuButton asChild tooltip={item.name} className="cursor-pointer rounded-xs">
                <Link href={item.href} className={`${isActive(item.href) ? "bg-accent text-accent-foreground" : ""}`}>
                  {resolveIcon(item.icon)}
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
