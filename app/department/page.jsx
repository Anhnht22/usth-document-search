"use client";

import MainLayout from "@/components/commons/MainLayout";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {cn} from "@/lib/utils";
import {useDepartments} from "@/hook/useDepartments";
import {CheckCircle2, ChevronRight, Filter, XCircle} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useEffect, useMemo, useState} from "react";
import {Button} from "@/components/ui/button";
import {Typography} from "@/components/ui/typography";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {useForm, useWatch} from "react-hook-form";
import {debounce, omit} from "lodash";
import CreateDepartmentDialog from "@/app/department/CreateDepartmentDialog";
import {MultiSelect} from "@/components/ui/multi-select";
import {listActiveOptions} from "@/utils/common";

const Department = () => {
    const form = useForm({
        defaultValues: {
            department_name: "",
            description: "",
            active: []
        }
    });
    const searchParams = useWatch({control: form.control});

    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isHoveringSidebar, setIsHoveringSidebar] = useState(false);
    const [debounceFilter, setDebounceFilter] = useState(searchParams);

    const debouncedSetFilter = useMemo(
        () => debounce(setDebounceFilter, 200),
        [setDebounceFilter]
    );

    const {data: listDepartment, isLoading, isFetching} = useDepartments({
        limit: 20,
        ...(debounceFilter.active === "all" ? omit(debounceFilter, "active") : debounceFilter)
    });

    const toggleSidebar = () => {
        setIsSidebarVisible(prev => !prev);
    }

    useEffect(() => {
        debouncedSetFilter(searchParams);
        return () => debouncedSetFilter.cancel(); // Hủy debounce khi component unmount
    }, [searchParams, debouncedSetFilter]);

    return (
        <MainLayout>
            <div className={cn("flex gap-3 h-full")}>
                <div className="flex-1 py-3 pl-3 overflow-auto">
                    <div className={cn("flex justify-between")}>
                        <Typography variant="h2" className={cn("mb-4")}>Department</Typography>
                        <div className={cn("space-x-3")}>
                            <CreateDepartmentDialog/>
                        </div>
                    </div>
                    <Table>
                        <TableCaption>List of departments in the organization</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className={cn("w-20")}>ID</TableHead>
                                <TableHead className={cn("min-w-[300px]")}>Name</TableHead>
                                <TableHead className={cn("min-w-[300px]")}>Description</TableHead>
                                <TableHead className={cn("w-32 text-center")}>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listDepartment?.map((department) => {
                                const {department_id, department_name, description, active} = department
                                return (
                                    <TableRow key={department_id}>
                                        <TableCell>{department_id}</TableCell>
                                        <TableCell>{department_name}</TableCell>
                                        <TableCell>{description}</TableCell>
                                        <TableCell className={cn("flex justify-center")}>
                                            {active ? (
                                                <CheckCircle2 className="text-green-500"/>
                                            ) : (
                                                <XCircle className="text-red-500"/>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
                <div className={cn(
                    "h-full relative",
                    "shrink-0 transition-all duration-300 ease-in-out",
                    isSidebarVisible ? "w-80" : "w-10"
                )}
                     onMouseEnter={() => setIsHoveringSidebar(true)}
                     onMouseLeave={() => setIsHoveringSidebar(false)}>
                    <Card className={cn(
                        "h-full flex flex-col rounded-none overflow-hidden",
                        "transition-all duration-300 ease-in-out",
                        isSidebarVisible ? "bg-white p-4" : "bg-gray-100"
                    )}>
                        <div onClick={toggleSidebar}
                             className={cn(
                                 "hover:cursor-pointer flex justify-center border-0 shadow-none",
                                 "transition-all duration-300 ease-in-out",
                                 isSidebarVisible ? "opacity-0 h-0" : "py-3 opacity-100"
                             )}>
                            <Filter/>
                        </div>
                        <div className={cn(
                            "transition-opacity duration-300 ease-in-out",
                            isSidebarVisible ? "opacity-100" : "opacity-0"
                        )}>
                            <CardHeader className={cn("p-0 pb-3 mb-2 border-b")}>
                                <CardTitle className={cn("flex gap-2 items-center")}>
                                    <Filter/> Filter
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 flex-grow p-0 w-full">
                                <Form {...form}>
                                    <form>
                                        <div className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="department_name"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel className={cn("font-bold")}>
                                                            Name
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Department name..." {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="description"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel className={cn("font-bold")}>
                                                            Description
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Description..." {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="active"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel className={cn("font-bold")}>Status</FormLabel>
                                                        <MultiSelect
                                                            options={listActiveOptions}
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            placeholder="Select status"
                                                            variant="inverted"
                                                        />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </div>
                    </Card>
                    <Button variant="secondary" onClick={toggleSidebar}
                            className={cn(
                                "absolute bottom-3 border p-0 w-4 transition-opacity duration-300 ease-in-out",
                                isSidebarVisible ? "" : "-rotate-180 -left-4",
                                isHoveringSidebar ? "opacity-100" : "opacity-0"
                            )}>
                        <ChevronRight/>
                    </Button>
                </div>
            </div>
        </MainLayout>
    )
}

export default Department;