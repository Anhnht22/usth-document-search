"use client"

import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip"
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {usePathname} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import {Building2, ChevronLeft, ChevronRight} from "lucide-react";
import Link from "next/link";
import logo from "@/public/logo.png";
import Image from "next/image";
import {useAuth} from "@/provider/AuthProvider";
import {useDepartments} from "@/hook/useDepartments";
import {useSubject} from "@/hook/useSubject";
import {useTopic} from "@/hook/useTopic";
import clientRoutes from "@/routes/client";

// const menuItems = [
// {
//
//     icon: FileText,
//     value: {title: "Reports"},
//     subItems: [
//         {value: {title: "Report 1", path: "/report"}},
//     ]
// },
// ]

const DocumentSearchLeftToolbar = () => {
    const {role} = useAuth();

    const [menuItems, setMenuItems] = useState([]);

    const menuItemsByRole = useMemo(() => menuItems.reduce((acc, item) => {
        if (!item.value.roles) return [...acc, item];
        return item.value.roles.includes(role) ? [...acc, item] : acc
    }, []), [role, menuItems]);

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
            isExpanded ? "400px" : "60px"
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

    const {data: departmentResp, isPending: isPendingDepartment} = useDepartments({
        limit: -999,
        active: 1,
        order: JSON.stringify({"t.department_id": "desc"})
    });

    const {data: subjectResp, isPending: isPendingSubject} = useSubject({
        limit: -999,
        active: 1,
        // department_id: department_id,
        order: JSON.stringify({"t.subject_id": "desc"})
    });

    const {data: topicResp, isPending: isPendingTopic} = useTopic({
        limit: -999,
        active: 1,
        // department_id: department_id,
        // subject_id: subject_id,
        order: JSON.stringify({"t.topic_id": "desc"})
    });

    useEffect(() => {
        if (isPendingDepartment || isPendingSubject || isPendingTopic) return;

        const menuItems = [];
        departmentResp?.data?.forEach(departmentRespItem => {
            const subjectItem = subjectResp?.data?.reduce((acc, subject) => {
                const {department, subject_id, subject_name} = subject;
                for (let i = 0; i < department.length; i++) {
                    const {department_id} = department[i];
                    if (department_id === departmentRespItem.department_id) {
                        acc.push({
                            icon: Building2,
                            value: {
                                title: subject_name,
                                path: clientRoutes.documentSearch.listTopic.path + `?department_id=${department_id}&subject_id=${subject_id}`
                            },
                            subItems: null
                            // subItems: topicResp?.data?.reduce((acc, topic) => {
                            //     const {subject, topic_id, topic_name} = topic;
                            //     subject.forEach(subject_id => {
                            //         if (subject_id === subject.subject_id) {
                            //             return [...acc, {
                            //                 value: {title: topic_name, path: `/document-search/${department_id}/${subject_id}/${topic_id}`}
                            //             }]
                            //         }
                            //     })
                            //     return acc;
                            // }, [])
                        })
                    }
                }

                return acc
            }, [])

            menuItems.push({
                icon: Building2,
                value: {
                    title: departmentRespItem.department_name,
                    path: subjectItem?.length > 0 ? clientRoutes.documentSearch.listSubject.path + `?department_id=${departmentRespItem.department_id}` : null
                },
                subItems: subjectItem?.length > 0 ? subjectItem : null
            })
        })

        setMenuItems(menuItems);
    }, [departmentResp, subjectResp, topicResp]);
    console.log("menuItems: ", menuItems)

    return (
        <TooltipProvider>
            <div
                className={cn("absolute h-[100dvh] w-[var(--left-toolbar-width)]",
                    "top-0 bg-white shadow bg-background overflow-hidden",
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
                    {menuItemsByRole.map(({value, subItems, ...itemMenu}) => {
                        console.log("value: ", itemMenu)
                        return (
                            <div key={value.title} className={cn("[&:not(:first-child)]:mt-2")}>
                                <Tooltip delayDuration={100}>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={cn(
                                                "flex items-start px-3 py-2 hover:bg-accent gap-2",
                                                isActive(value.path) && "bg-accent text-accent-foreground",
                                                !isExpanded && "justify-center"
                                            )}
                                        >
                                            {itemMenu.icon && <itemMenu.icon className={cn("h-5 w-5")}/>}
                                            {isExpanded && (
                                                <Link href={value.path ? value.path : "#"}
                                                      className={cn(
                                                          "flex-1 line-clamp-2 h-full",
                                                          value.path ? "hover:underline" : ""
                                                      )}
                                                >
                                                    {value.title}
                                                </Link>
                                            )}
                                            <div
                                                className={cn(
                                                    "w-6 flex items-center justify-center h-full",
                                                    "hover:cursor-pointer"
                                                )}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    subItems && toggleMenu(value.title)
                                                }}
                                            >
                                                {isExpanded && subItems && (
                                                    <p className={cn("")}>
                                                        <ChevronRight

                                                            className={cn(
                                                                "transition-transform",
                                                                openMenus.includes(value.title) && "transform rotate-90"
                                                            )}/>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
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
                                                href={"/"}
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
                        )
                    })}
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

export default DocumentSearchLeftToolbar;