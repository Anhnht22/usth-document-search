import {cn} from "@/lib/utils";
import {useEffect, useMemo, useRef, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ChevronRight, Filter} from "lucide-react";
import {Form, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm, useWatch} from "react-hook-form";
import {debounce, isEqual} from "lodash";
import {useDepartments} from "@/hook/useDepartments";
import {useSubject} from "@/hook/useSubject";
import {useTopic} from "@/hook/useTopic";
import {MultiSelect} from "@/components/ui/multi-select";
import {useSearchParams} from "next/navigation";
import {useKeyword} from "@/hook/useKeyword";
import useDebounce from "@/hook/useDebounce";

const defaultValues = {
    subject_id: [],
    department_id: [],
    topic_id: [],
    keyword_id: [],
}

const SearchForm = ({onChangeFilter}) => {
    const searchParamsUrl = useSearchParams();

    const subject_id = searchParamsUrl.getAll('subject_id') || []
    const department_id = searchParamsUrl.getAll('department_id') || []
    const topic_id = searchParamsUrl.getAll('topic_id') || []
    const keyword_id = searchParamsUrl.getAll('keyword_id') || []

    const form = useForm({
        defaultValues: defaultValues
    });
    const searchParams = useWatch({control: form.control});
    // Lưu giá trị params trước đó
    const previousParams = useRef(defaultValues);

    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isHoveringSidebar, setIsHoveringSidebar] = useState(false);

    const toggleSidebar = () => setIsSidebarVisible(prev => !prev);

    const debouncedSetFilter = useMemo(
        () => debounce(onChangeFilter, 300),
        []
    );

    const filledFormRef = useRef([]);
    useEffect(() => {
        if (form.getValues().subject_id?.length <= 0 && filledFormRef.current.indexOf('subject_id') === -1) {
            form.setValue("subject_id", subject_id.map(item => Number(item)))
            filledFormRef.current.push('subject_id')
        }
    }, [subject_id]);

    useEffect(() => {
        if (form.getValues().department_id?.length <= 0 && filledFormRef.current.indexOf('department_id') === -1) {
            form.setValue("department_id", department_id.map(item => Number(item)))
            filledFormRef.current.push('department_id')
        }
    }, [department_id]);

    useEffect(() => {
        if (form.getValues().topic_id?.length <= 0 && filledFormRef.current.indexOf('topic_id') === -1) {
            form.setValue("topic_id", topic_id.map(item => Number(item)))
            filledFormRef.current.push('topic_id')
        }
    }, [topic_id]);

    useEffect(() => {
        if (form.getValues().keyword_id?.length <= 0 && filledFormRef.current.indexOf('keyword_id') === -1) {
            form.setValue("keyword_id", keyword_id.map(item => Number(item)))
            filledFormRef.current.push('keyword_id')
        }
    }, [keyword_id]);

    useEffect(() => {
        if (!isEqual(previousParams.current, searchParams)) {
            debouncedSetFilter(searchParams);
            previousParams.current = searchParams; // Cập nhật giá trị cũ
        }
        return () => debouncedSetFilter.cancel(); // Hủy debounce khi component unmount
    }, [searchParams, debouncedSetFilter]);

    const {data: departmentResp} = useDepartments({
        limit: -999,
        active: 1,
        order: JSON.stringify({"t.department_id": "desc"})
    });

    const {data: subjectResp} = useSubject({
        limit: -999,
        active: 1,
        // department_id: department_id,
        order: JSON.stringify({"t.subject_id": "desc"})
    });

    const {data: topicResp} = useTopic({
        limit: -999,
        active: 1,
        // department_id: department_id,
        // subject_id: subject_id,
        order: JSON.stringify({"t.topic_id": "desc"})
    });

    const {data: keywordResp} = useKeyword({
        limit: -999,
        active: 1,
        order: JSON.stringify({"t.keyword_id": "desc"})
    });

    return (
        <div
            className={cn(
                "h-full",
                "shrink-0 transition-all duration-300 ease-in-out",
                isSidebarVisible ? "w-80" : "w-10"
            )}
            onMouseEnter={() => setIsHoveringSidebar(true)}
            onMouseLeave={() => setIsHoveringSidebar(false)}
        >
            <Card
                className={cn(
                    "h-full flex flex-col rounded-none overflow-hidden overflow-y-auto",
                    "transition-all duration-300 ease-in-out",
                    isSidebarVisible ? "bg-white p-4" : "bg-gray-100"
                )}
            >
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
                                        name="department_id"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className={cn("font-bold text-black")}>
                                                    Department
                                                </FormLabel>
                                                <MultiSelect
                                                    isClearable={true}
                                                    options={departmentResp?.data?.map(({
                                                                                            department_id,
                                                                                            department_name
                                                                                        }) => ({
                                                        value: department_id,
                                                        label: department_name
                                                    })) ?? []}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    placeholder="Select topic"
                                                />
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="subject_id"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className={cn("font-bold text-black")}>
                                                    Subject
                                                </FormLabel>
                                                <MultiSelect
                                                    isClearable={true}
                                                    options={subjectResp?.data?.map(({subject_id, subject_name}) => ({
                                                        value: subject_id,
                                                        label: subject_name
                                                    })) ?? []}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    placeholder="Select topic"
                                                />
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="topic_id"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className={cn("font-bold text-black")}>
                                                    Topic
                                                </FormLabel>
                                                <MultiSelect
                                                    isClearable={true}
                                                    options={topicResp?.data?.map(({topic_id, topic_name}) => ({
                                                        value: topic_id,
                                                        label: topic_name
                                                    })) ?? []}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    placeholder="Select topic"
                                                />
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="keyword_id"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className={cn("font-bold text-black")}>
                                                    Keyword
                                                </FormLabel>
                                                <MultiSelect
                                                    isClearable={true}
                                                    options={keywordResp?.data?.map(({keyword_id, keyword}) => ({
                                                        value: keyword_id,
                                                        label: keyword
                                                    })) ?? []}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    placeholder="Select keyword"
                                                />
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    {/*<FormField*/}
                                    {/*    control={form.control}*/}
                                    {/*    name="title"*/}
                                    {/*    render={({field}) => (*/}
                                    {/*        <FormItem>*/}
                                    {/*            <FormLabel className={cn("font-bold")}>*/}
                                    {/*                Title*/}
                                    {/*            </FormLabel>*/}
                                    {/*            <FormControl>*/}
                                    {/*                <Input placeholder="Title..." {...field} />*/}
                                    {/*            </FormControl>*/}
                                    {/*        </FormItem>*/}
                                    {/*    )}*/}
                                    {/*/>*/}
                                    {/*<FormField*/}
                                    {/*    control={form.control}*/}
                                    {/*    name="description"*/}
                                    {/*    render={({field}) => (*/}
                                    {/*        <FormItem>*/}
                                    {/*            <FormLabel className={cn("font-bold")}>*/}
                                    {/*                Description*/}
                                    {/*            </FormLabel>*/}
                                    {/*            <FormControl>*/}
                                    {/*                <Input placeholder="Description..." {...field} />*/}
                                    {/*            </FormControl>*/}
                                    {/*        </FormItem>*/}
                                    {/*    )}*/}
                                    {/*/>*/}
                                    {/*<FormField*/}
                                    {/*    control={form.control}*/}
                                    {/*    name="created_date"*/}
                                    {/*    render={({field}) => (*/}
                                    {/*        <FormItem>*/}
                                    {/*            <FormLabel className={cn("font-bold")}>Created date</FormLabel>*/}
                                    {/*            <DateRangePicker onChange={field.onChange}/>*/}
                                    {/*        </FormItem>*/}
                                    {/*    )}*/}
                                    {/*/>*/}
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
    )
}

export default SearchForm;