"use client"

import {TooltipProvider,} from "@/components/ui/tooltip"
import {cn} from "@/lib/utils";
import {usePathname, useSearchParams} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import {ChevronRight} from "lucide-react";
import Link from "next/link";
import logo from "@/public/logo.png";
import Image from "next/image";
import {useAuth} from "@/provider/AuthProvider";
import {useDepartments} from "@/hook/useDepartments";
import {useSubject} from "@/hook/useSubject";
import {useTopic} from "@/hook/useTopic";
import clientRoutes from "@/routes/client";
import {useDocumentSearchLeftToolbarProvider} from "@/provider/DocumentSearchLeftToolbarProvider";

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
    const {
        isExpanded,
        openMenus,
        openSubMenus,
        setIsExpanded,
        setOpenMenus,
        setOpenSubMenus,
        toggleMenu,
        toggleSubMenu
    } = useDocumentSearchLeftToolbarProvider();

    const {role} = useAuth();
    const searchParams = useSearchParams();

    const subject_id = searchParams.getAll('subject_id') || []
    const department_id = searchParams.getAll('department_id') || []
    const topic_id = searchParams.getAll('topic_id') || []

    const [menuItems, setMenuItems] = useState([]);

    const menuItemsByRole = useMemo(() => menuItems.reduce((acc, item) => {
        if (!item.value.roles) return [...acc, item];
        return item.value.roles.includes(role) ? [...acc, item] : acc
    }, []), [role, menuItems]);

    const pathname = usePathname();
    const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

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

    const [departmentDataAll, setDepartmentDataAll] = useState([]);
    const [departmentPage, setDepartmentPage] = useState(1);
    const {data: departmentResp, isPending: isPendingDepartment} = useDepartments({
        limit: 20,
        page: departmentPage,
        active: 1,
        order: JSON.stringify({"t.department_id": "desc"})
    });
    useEffect(() => {
        const {total: totalObj} = departmentResp || {};
        const {limits, pages, total} = totalObj || {};
        if (limits * pages < total) {
            setDepartmentPage(prev => prev + 1)
        }
    }, [departmentResp]);
    useEffect(() => {
        if (departmentResp?.data) {
            setDepartmentDataAll(prev => [
                ...prev,
                ...departmentResp.data.filter(department => !prev.some(prevDept => prevDept.department_id === department.department_id))
            ])
        }
    }, [departmentResp]);

    const [subjectDataAll, setSubjectDataAll] = useState([]);
    const [subjectPage, setSubjectPage] = useState(1);
    const {data: subjectResp, isPending: isPendingSubject} = useSubject({
        limit: 20,
        page: subjectPage,
        active: 1,
        order: JSON.stringify({"t.subject_id": "desc"})
    });
    useEffect(() => {
        const {total: totalObj} = subjectResp || {};
        const {limits, pages, total} = totalObj || {};
        if (limits * pages < total) {
            setSubjectPage(prev => prev + 1)
        }
    }, [subjectResp]);
    useEffect(() => {
        if (subjectResp?.data) {
            setSubjectDataAll(prev => [
                ...prev,
                ...subjectResp.data.filter(subject => !prev.some(prevDept => prevDept.subject_id === subject.subject_id))
            ])
        }
    }, [subjectResp]);

    const [topicDataAll, setTopicDataAll] = useState([]);
    const [topicPage, setTopicPage] = useState(1);
    const {data: topicResp, isPending: isPendingTopic} = useTopic({
        limit: 20,
        page: topicPage,
        active: 1,
        order: JSON.stringify({"t.topic_id": "desc"})
    });
    useEffect(() => {
        const {total: totalObj} = topicResp || {};
        const {limits, pages, total} = totalObj || {};
        if (limits * pages < total) {
            setTopicPage(prev => prev + 1)
        }
    }, [topicResp]);
    useEffect(() => {
        if (topicResp?.data) {
            setTopicDataAll(prev => [
                ...prev,
                ...topicResp.data.filter(topic => !prev.some(prevDept => prevDept.topic_id === topic.topic_id))
            ])
        }
    }, [topicResp]);

    useEffect(() => {
        const menuItems = [];
        departmentDataAll?.forEach(departmentRespItem => {
            const subjectItem = subjectDataAll?.filter(subject =>
                subject.department.some(dept => dept.department_id === departmentRespItem.department_id)
            ).reduce((acc, subject) => {
                const {department, subject_id, subject_name} = subject;
                for (let i = 0; i < department.length; i++) {
                    const {department_id} = department[i];
                    if (department_id === departmentRespItem.department_id) {
                        const topicItem = topicDataAll?.filter(topic =>
                            topic.subject.some(sub => sub.subject_id === subject_id)
                        ).map(topic => {
                            const {topic_id, topic_name} = topic;
                            return {
                                value: {
                                    title: topic_name,
                                    path: clientRoutes.documentSearch.list.path + `?department_id=${department_id}&subject_id=${subject_id}&topic_id=${topic_id}`
                                },
                                subItems: null
                            };
                        });

                        acc.push({
                            value: {
                                title: subject_name,
                                path: clientRoutes.documentSearch.listTopic.path + `?department_id=${department_id}&subject_id=${subject_id}`
                            },
                            subItems: topicItem
                        });
                    }
                }
                return acc
            }, []);

            menuItems.push({
                value: {
                    title: departmentRespItem.department_name,
                    path: subjectItem?.length > 0 ? clientRoutes.documentSearch.listSubject.path + `?department_id=${departmentRespItem.department_id}` : null
                },
                subItems: subjectItem?.length > 0 ? subjectItem : null
            })
        })

        setMenuItems(menuItems);
    }, [departmentDataAll, subjectDataAll, topicDataAll]);

    return (
        <TooltipProvider>
            <div
                className={cn("absolute h-[100dvh] w-[var(--left-toolbar-width)]",
                    "top-0 shadow bg-background overflow-hidden",
                    "transition-all duration-300 flex flex-col",// px-2 pb-2
                )}>

                <div className={cn("h-[var(--header-height)] flex justify-center items-center pt-1")}>
                    <Image
                        src={logo ?? ""}
                        alt="Logo of the application"
                        className="w-auto max-h-full"
                    />
                </div>

                <nav className="flex-1 mt-2 pt-3 overflow-y-auto overflow-x-hidden">
                    {menuItemsByRole.map(({value, subItems, ...itemMenu}) => (
                        <div key={value.title} className={cn("[&:not(:first-child)]:mt-2")}>
                            <div
                                className={cn("flex items-start px-3 py-2 hover:bg-accent gap-2", isActive(value.path) && "bg-accent text-accent-foreground", !isExpanded && "justify-center")}>
                                {itemMenu.icon && <itemMenu.icon className={cn("h-5 w-5")}/>}
                                {isExpanded && (
                                    <Link href={value.path ? value.path : "#"}
                                          className={cn("flex-1 line-clamp-2 h-full font-bold text-[#ff6500]", value.path ? "hover:underline" : "")}>
                                        {value.title}
                                    </Link>
                                )}
                                <div
                                    className={cn("w-6 flex items-center justify-center h-full", "hover:cursor-pointer")}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        subItems && toggleMenu(value.title)
                                    }}>
                                    {isExpanded && subItems && (
                                        <p className={cn("")}>
                                            <ChevronRight
                                                className={cn("transition-transform", openMenus.includes(value.title) && "transform rotate-90")}/>
                                        </p>
                                    )}
                                </div>
                            </div>
                            {isExpanded && subItems && openMenus.includes(value.title) && (
                                <div className="ml-6 border-l">
                                    {subItems.map(({value: subValue, subItems: subSubItems}) => (
                                        <div key={subValue.title}>
                                            <div
                                                className={cn("flex items-start px-3 py-2 hover:bg-accent gap-2", isActive(subValue.path) && "bg-accent text-accent-foreground", !isExpanded && "justify-center")}>
                                                <Link href={subValue.path ? subValue.path : "#"}
                                                      className={cn("flex-1 line-clamp-2 h-full font-bold text-[#ff6500]", subValue.path ? "hover:underline" : "")}>
                                                    {subValue.title}
                                                </Link>
                                                <div
                                                    className={cn("w-6 flex items-center justify-center h-full", "hover:cursor-pointer")}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        subSubItems && toggleSubMenu(value.title + subValue.title)
                                                    }}>
                                                    {isExpanded && subSubItems && (
                                                        <p className={cn("")}>
                                                            <ChevronRight
                                                                className={cn("transition-transform", openSubMenus.includes(value.title + subValue.title) && "transform rotate-90")}/>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {isExpanded && subSubItems && openSubMenus.includes(value.title + subValue.title) && (
                                                <div className="ml-6 border-l">
                                                    {subSubItems.map(({value: subSubValue}) => (
                                                        <Link key={subSubValue.title}
                                                              href={subSubValue.path ? subSubValue.path : "#"}
                                                              className={cn("block p-2 pl-6 hover:bg-accent", isActive(subSubValue.path) && "bg-accent text-accent-foreground")}>
                                                            {subSubValue.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {/*{menuItemsByRole.map(({value, subItems, ...itemMenu}) => (
                        <div key={value.title} className={cn("[&:not(:first-child)]:mt-2")}>
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
                                              "flex-1 line-clamp-2 h-full font-bold text-[#ff6500]",
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
                                                )}
                                            />
                                        </p>
                                    )}
                                </div>
                            </div>
                            {isExpanded && subItems && openMenus.includes(value.title) && (
                                <div className="ml-6 border-l">
                                    {subItems.map(({value: subValue, subItems: subSubItems}) => (
                                        <div key={subValue.title}>
                                            <Link
                                                href={subValue.path ? subValue.path : "#"}
                                                className={cn(
                                                    "block p-2 pl-6 hover:bg-accent",
                                                    isActive(subValue.path) && "bg-accent text-accent-foreground"
                                                )}
                                            >
                                                {subValue.title}
                                            </Link>
                                            {subSubItems && (
                                                <div className="ml-6 border-l">
                                                    {subSubItems.map(({value: subSubValue}) => (
                                                        <Link
                                                            key={subSubValue.title}
                                                            href={subSubValue.path ? subSubValue.path : "#"}
                                                            className={cn(
                                                                "block p-2 pl-6 hover:bg-accent",
                                                                isActive(subSubValue.path) && "bg-accent text-accent-foreground"
                                                            )}
                                                        >
                                                            {subSubValue.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}*/}
                </nav>

                {/*<div*/}
                {/*    className={cn(*/}
                {/*        "pt-2 flex",*/}
                {/*        isExpanded ? "justify-end" : "justify-center"*/}
                {/*    )}*/}
                {/*>*/}
                {/*    <Button variant="ghost" size="icon" onClick={toggleSidebar}>*/}
                {/*        {isExpanded ? <ChevronLeft/> : <ChevronRight/>}*/}
                {/*    </Button>*/}
                {/*</div>*/}
            </div>
        </TooltipProvider>
    );
}

export default DocumentSearchLeftToolbar;