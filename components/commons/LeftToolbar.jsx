"use client"

import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip"
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import {BarChart2, ChevronLeft, ChevronRight, FileText, Home, Settings, Users} from "lucide-react";
import Link from "next/link";
import logo from "@/public/logo.png";
import Image from "next/image";
import clientRoutes from "@/routes/client";

const menuItems = [
    {name: "Home", icon: Home, href: clientRoutes.home},
    {name: "Users", icon: Users, href: "/users"},
    {
        name: "Reports",
        icon: FileText,
        subItems: [
            {name: "Daily", href: "/reports/daily"},
            {name: "Weekly", href: "/reports/weekly"},
            {name: "Monthly", href: "/reports/monthly"},
        ]
    },
    {name: "Analytics", icon: BarChart2, href: "/analytics"},
    {name: "Settings", icon: Settings, href: "/settings"},
]

const LeftToolbar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [openMenus, setOpenMenus] = useState([]);
    const pathname = usePathname();

    const toggleSidebar = () => {
        setIsExpanded((prev) => !prev);
    };

    const toggleMenu = (menuName) => {
        setOpenMenus(prev =>
            prev.includes(menuName)
                ? prev.filter(name => name !== menuName)
                : [...prev, menuName]
        )
    }

    const isActive = (href) => pathname === href || pathname.startsWith(href + '/')

    useEffect(() => {
        const sidebar = document.documentElement;
        sidebar.style.setProperty(
            "--left-toolbar-width",
            isExpanded ? null : "60px"
        );
    }, [isExpanded]);

    // Auto-open parent menus if a subitem is active
    useEffect(() => {
        menuItems.forEach(item => {
            if (item.subItems) {
                const isSubItemActive = item.subItems.some(subItem => isActive(subItem.href));
                if (isSubItemActive && !openMenus.includes(item.name)) {
                    setOpenMenus(prev => [...prev, item.name]);
                }
            }
        });
    }, [pathname, openMenus]);

    return (
        <TooltipProvider>
            <div
                className={cn("fixed h-[100dvh] w-[var(--left-toolbar-width)]",
                    "top-0 bg-white shadow bg-background",
                    "transition-all duration-300 flex flex-col px-2 pb-2",
                )}>

                <div className={cn("h-[var(--header-height)] flex justify-center items-center pt-1")}>
                    <Image
                        src={logo ?? ""}
                        alt="Logo of the application"
                        className="w-auto max-h-full"
                    />
                </div>

                <nav className="flex-1 pt-3 overflow-y-auto overflow-x-hidden">
                    {menuItems.map((item) => (
                        <div key={item.name} className={cn("[&:not(:first-child)]:mt-2")}>
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href ?? "#"}
                                        className={cn(
                                            "flex items-center px-3 py-2 hover:bg-accent gap-2",
                                            isActive(item.href) && "bg-accent text-accent-foreground",
                                            !isExpanded && "justify-center"
                                        )}
                                        onClick={(e) => {
                                            if (!item.href) {
                                                e.preventDefault();
                                                item.subItems && toggleMenu(item.name)
                                            }
                                        }}
                                    >
                                        <item.icon className={cn("h-5 w-5")}/>
                                        {isExpanded && (
                                            <span className="flex-1 h-5">{item.name}</span>
                                        )}
                                        {isExpanded && item.subItems && (
                                            <ChevronRight className={cn(
                                                "h-4 w-4 transition-transform",
                                                openMenus.includes(item.name) && "transform rotate-90"
                                            )}/>
                                        )}
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent className={cn(isExpanded && "hidden")} side="right">
                                    {item.name}
                                </TooltipContent>
                            </Tooltip>
                            {isExpanded && item.subItems && openMenus.includes(item.name) && (
                                <div className="ml-6 border-l">
                                    {item.subItems.map((subItem) => (
                                        <Link
                                            key={subItem.name}
                                            href={subItem.href}
                                            className={cn(
                                                "block p-2 pl-6 hover:bg-accent",
                                                isActive(subItem.href) && "bg-accent text-accent-foreground"
                                            )}
                                        >
                                            {subItem.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                <div className={cn("pt-2 flex", isExpanded ? "justify-end" : "justify-center")}>
                    <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                        {isExpanded ? <ChevronLeft/> : <ChevronRight/>}
                    </Button>
                </div>
            </div>
        </TooltipProvider>
    );
}

export default LeftToolbar;