"use client";

import * as Icons from "lucide-react";
import { ChevronsUpDown, Loader, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { useLogout } from "@/hooks/use-logout";
import UserNavMenu from "@/data/user-nav-menu";
import AdminNavMenu from "@/data/admin-nav-menu";

export function NavUser() {
    const { logout } = useLogout();

    const { isMobile } = useSidebar();
    const { user } = usePage().props;
    const initials = user.last_name
        ? user.first_name.charAt(0) + user.last_name.charAt(0)
        : user.first_name.slice(0, 2);
    const [isLoading, setIsLoading] = useState(false);
    const navMenu = user.role === "admin" ? AdminNavMenu : UserNavMenu;
    const resolveIcon = (iconName) => {
        const Icon = Icons[iconName];
        return Icon ? <Icon className="w-4 h-4 mr-2" /> : null;
    };
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={user.avatar}
                                    alt={user.first_name + " " + user.last_name}
                                />
                                <AvatarFallback className="rounded-lg">
                                    {initials ?? "PM"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {user.first_name +
                                        " " +
                                        (user.last_name ?? "")}
                                </span>
                                <span className="truncate text-xs">
                                    {user.email ?? ""}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={user.avatar}
                                        alt={
                                            user.first_name +
                                            " " +
                                            user.last_name
                                        }
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        {initials ?? "PM"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {user.first_name +
                                            " " +
                                            (user.last_name ?? "")}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user.email ?? ""}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {navMenu.map((item, idx) => {
                            if (item.divider) {
                                return <DropdownMenuSeparator key={"divider-" + idx} />;
                            }
                            if (item.href) {
                                return (
                                    <DropdownMenuItem key={item.name + idx} asChild>
                                        <a href={item.href} className="flex items-center">
                                            {resolveIcon(item.icon)}
                                            {item.name}
                                        </a>
                                    </DropdownMenuItem>
                                );
                            }
                            return (
                                <DropdownMenuItem key={item.name + idx}>
                                    <span className="flex items-center">
                                        {resolveIcon(item.icon)}
                                        {item.name}
                                    </span>
                                </DropdownMenuItem>
                            );
                        })}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <LogOut />}
                            {isLoading ? "Logging out..." : "Log out"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
