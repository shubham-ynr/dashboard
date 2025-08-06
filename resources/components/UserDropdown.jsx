"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    LogOut,
    Bell,
    CreditCard,
    Sparkles,
    BadgeCheck,
    Loader,
} from "lucide-react";
import { usePage } from "@inertiajs/react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useLogout } from "@/hooks/use-logout";

export function UserDropdown() {
    const { logout } = useLogout();
    const { user } = usePage().props;
    const [ isLoading, setIsLoading ] = useState(false);
    const initials = user.last_name
        ? user.first_name.charAt(0) + user.last_name.charAt(0)
        : user.first_name.slice(0, 2);


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    {initials ?? "PM"}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg mt-2"
                side="bottom"
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
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
                                {user.first_name + " " + (user.last_name ?? "")}
                            </span>
                            <span className="truncate text-xs">
                                {user.email ?? ""}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Sparkles />
                        Upgrade to Pro
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <BadgeCheck />
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreditCard />
                        Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Bell />
                        Notifications
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <LogOut />}
                    {isLoading ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
