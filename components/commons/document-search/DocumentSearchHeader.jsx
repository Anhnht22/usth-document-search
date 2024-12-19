"use client";

import {cn} from "@/lib/utils";
import {CircleUser, LogOut, User} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {useAuth} from "@/provider/AuthProvider";

const DocumentSearchHeader = () => {
    const {logout} = useAuth();

    return (
        <header
            className={cn("absolute left-[var(--left-toolbar-width)] top-0 transition-all duration-300",
                "h-[var(--header-height)] w-[calc(100dvw-var(--left-toolbar-width))]",
                "bg-white shadow flex justify-center items-center px-8 py-4"
            )}>
            <div className="flex-1"></div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none">
                        <CircleUser width={30} height={30}/>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem>
                        <User className="h-4 w-4"/>
                        <span>Information</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={logout}>
                        <LogOut className="h-4 w-4"/>
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}

export default DocumentSearchHeader;