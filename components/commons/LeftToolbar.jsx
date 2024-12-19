"use client"

import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip"
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {usePathname} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import {Building2, ChevronLeft, ChevronRight, Files, FileText, Home, Lightbulb, Users, WholeWord} from "lucide-react";
import Link from "next/link";
import logo from "@/public/logo.png";
import Image from "next/image";
import clientRoutes from "@/routes/client";
import {useAuth} from "@/provider/AuthProvider";

const menuItems = [
    {icon: Home, value: clientRoutes.home},
    {icon: Users, value: clientRoutes.user.list},
    {icon: Building2, value: clientRoutes.department.list},
    {icon: Files, value: clientRoutes.subject.list},
    {icon: Lightbulb, value: clientRoutes.topic.list},
    {icon: WholeWord, value: clientRoutes.keyword.list},
    {icon: Files, value: clientRoutes.document.list},
    {icon: Files, value: clientRoutes.documentSearch.listDepartment},
    {

        icon: FileText,
        value: {title: "Reports"},
        subItems: [
            {value: {title: "Report 1", path: "/report"}},
        ]
    },
]

const LeftToolbar = () => {
    const {role} = useAuth();

    const menuItemsByRole = useMemo(() => menuItems.reduce((acc, item) => {
        if (!item.value.roles) return [...acc, item];
        return item.value.roles.includes(role) ? [...acc, item] : acc
    }, []), [role]);

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
        menuItemsByRole.forEach(item => {
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
                className={cn("absolute h-[100dvh] w-[var(--left-toolbar-width)]",
                    "top-0 bg-white shadow bg-background overflow-hidden",
                    "transition-all duration-300 flex flex-col px-2 pb-2",
                )}
            >
                <div className={cn("h-[var(--header-height)] flex justify-center items-center pt-1")}>
                    <Image
                        src={logo ?? ""}
                        alt="Logo of the application"
                        className="w-auto max-h-full"
                    />
                </div>

                <nav className="flex-1 pt-3 overflow-y-auto overflow-x-hidden">
                    {menuItemsByRole.map(({value, subItems, ...itemMenu}) => (
                        <div key={value.title} className={cn("[&:not(:first-child)]:mt-2")}>
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={value.path ?? "#"}
                                        className={cn(
                                            "flex items-center px-3 py-2 hover:bg-accent gap-2",
                                            isActive(value.path) && "bg-accent text-accent-foreground",
                                            !isExpanded && "justify-center"
                                        )}
                                        onClick={(e) => {
                                            if (!value.path) {
                                                e.preventDefault();
                                                subItems && toggleMenu(value.title)
                                            }
                                        }}
                                    >
                                        {itemMenu.icon && <itemMenu.icon className={cn("h-5 w-5")}/>}
                                        {isExpanded && (
                                            <span className="flex-1 h-5">{value.title}</span>
                                        )}
                                        {isExpanded && subItems && (
                                            <ChevronRight className={cn(
                                                "h-4 w-4 transition-transform",
                                                openMenus.includes(value.title) && "transform rotate-90"
                                            )}/>
                                        )}
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent className={cn(isExpanded && "hidden")} side="right">
                                    {value.title}
                                </TooltipContent>
                            </Tooltip>
                            {isExpanded && subItems && openMenus.includes(value.title) && (
                                <div className="ml-6 border-l">
                                    {subItems.map(({value: subValue}) => (
                                        <Link
                                            key={subValue.title}
                                            href={subValue.path}
                                            className={cn(
                                                "block p-2 pl-6 hover:bg-accent",
                                                isActive(subValue.path) && "bg-accent text-accent-foreground"
                                            )}
                                        >
                                            {subValue.title}
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