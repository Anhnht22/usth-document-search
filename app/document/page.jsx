"use client";

import MainLayout from "@/components/commons/MainLayout";
import {cn} from "@/lib/utils";
import {Typography} from "@/components/ui/typography";
import CreateDepartmentDialog from "@/app/department/CreateDepartmentDialog";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Calendar, CalendarIcon, CheckCircle2, ChevronRight, Filter, XCircle} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm, useWatch} from "react-hook-form";
import {useEffect, useMemo, useState} from "react";
import {debounce} from "lodash";
import {MultiSelect} from "@/components/ui/multi-select";
import {convertUnixDate, ddMMYYYY, listActiveOptions} from "@/utils/common";
import {useDocument} from "@/hook/useDocument";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {format} from "date-fns";

const ListUser = () => {
    const form = useForm({
        defaultValues: {
            topic: "",
            title: "",
            description: "",
            created_by: [],
            created_date: "",
            active: [],
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

    const {data: listDocument, isLoading, isFetching} = useDocument({
        limit: 20,
        ...debounceFilter
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
                        <Typography variant="h2" className={cn("mb-4")}>User</Typography>
                        <div className={cn("space-x-3")}>
                            <CreateDepartmentDialog/>
                        </div>
                    </div>
                    <Table>
                        <TableCaption>List of departments in the organization</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className={cn("w-20")}>ID</TableHead>
                                <TableHead className={cn("min-w-[150px]")}>Topic</TableHead>
                                <TableHead className={cn("w-[250px]")}>Title</TableHead>
                                <TableHead className={cn("w-[300px]")}>Description</TableHead>
                                <TableHead className={cn("min-w-[300px]")}>File path</TableHead>
                                <TableHead className={cn("min-w-36")}>Created by</TableHead>
                                <TableHead className={cn("w-60")}>Created date</TableHead>
                                <TableHead className={cn("w-32 text-center")}>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listDocument?.map((item) => {
                                const {
                                    document_id, file_path, title, description, upload_date,
                                    document_active, username, topic_name
                                } = item;
                                const uploadString = convertUnixDate(upload_date / 1000, ddMMYYYY);

                                return (
                                    <TableRow key={document_id}>
                                        <TableCell>{document_id}</TableCell>
                                        <TableCell>{topic_name}</TableCell>
                                        <TableCell>{title}</TableCell>
                                        <TableCell>{description}</TableCell>
                                        <TableCell>{file_path}</TableCell>
                                        <TableCell>{username}</TableCell>
                                        <TableCell>{uploadString}</TableCell>
                                        <TableCell>
                                            <div className={cn("flex justify-center")}>
                                                {document_active ? (
                                                    <CheckCircle2 className="text-green-500"/>
                                                ) : (
                                                    <XCircle className="text-red-500"/>
                                                )}
                                            </div>
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
                                                name="topic"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel className={cn("font-bold")}>
                                                            Topic
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Topic..." {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="title"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel className={cn("font-bold")}>
                                                            Title
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Title..." {...field} />
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
                                                name="created_date"
                                                render={({field}) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>Date of birth</FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className={cn(
                                                                            "w-[240px] pl-3 text-left font-normal",
                                                                            !field.value && "text-muted-foreground"
                                                                        )}
                                                                    >
                                                                        {field.value ? (
                                                                            format(field.value, "PPP")
                                                                        ) : (
                                                                            <span>Pick a date</span>
                                                                        )}
                                                                        <CalendarIcon
                                                                            className="ml-auto h-4 w-4 opacity-50"/>
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={field.value}
                                                                    onSelect={field.onChange}
                                                                    disabled={(date) =>
                                                                        date > new Date() || date < new Date("1900-01-01")
                                                                    }
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
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
    );
}

export default ListUser;
