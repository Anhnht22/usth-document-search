import {cn} from "@/lib/utils";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ChevronRight, Filter} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {MultiSelect} from "@/components/ui/multi-select";
import {Button} from "@/components/ui/button";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useForm, useWatch} from "react-hook-form";
import {debounce, isEqual} from "lodash";
import {useDepartments} from "@/hook/useDepartments";
import {listActiveOptions} from "@/utils/common";

const defaultValues = {
    subject_name: "",
    department_id: [],
    active: []
}

const SubjectSearchForm = ({onChangeFilter}) => {
    const form = useForm({
        defaultValues: defaultValues
    });
    const searchParams = useWatch({control: form.control});
    // Lưu giá trị params trước đó
    const previousParams = useRef(defaultValues);

    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isHoveringSidebar, setIsHoveringSidebar] = useState(false);

    const [listDepartmentOptions, setListDepartmentOptions] = useState([]);
    const [departmentPage, setDepartmentPage] = useState(1);
    const {data: departmentResp} = useDepartments({
        limit: 10,
        page: departmentPage,
        active: 1,
        order: JSON.stringify({"t.department_id": "desc"})
    });

    useEffect(() => {
        setListDepartmentOptions(prev =>
            [
                ...prev,
                ...(
                    departmentResp?.data
                        ?.filter(({department_id}) => !prev.some(option => option.value === department_id))
                        .map(({department_id, department_name}) => ({
                            value: department_id,
                            label: department_name
                        })) ?? []
                )
            ]
        )
    }, [departmentResp]);

    const toggleSidebar = () => setIsSidebarVisible(prev => !prev)

    const onChangeFilterInternal = (params) => {
        onChangeFilter(params);
    }

    const debouncedSetFilter = useMemo(
        () => debounce(onChangeFilterInternal, 300),
        []
    );

    useEffect(() => {
        if (!isEqual(previousParams.current, searchParams)) {
            debouncedSetFilter(searchParams);
            previousParams.current = searchParams; // Cập nhật giá trị cũ
        }
        return () => debouncedSetFilter.cancel(); // Hủy debounce khi component unmount
    }, [searchParams, debouncedSetFilter]);

    return (
        <div className={cn(
            "h-full relative",
            "shrink-0 transition-all duration-300 ease-in-out",
            isSidebarVisible ? "w-80" : "w-10"
        )}
             onMouseEnter={() => setIsHoveringSidebar(true)}
             onMouseLeave={() => setIsHoveringSidebar(false)}>
            <Card className={cn(
                "h-full flex flex-col rounded-none overflow-hidden overflow-y-auto",
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
                                        name="subject_name"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className={cn("font-bold")}>
                                                    Subject
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Subject..." {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="department_id"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className={cn("font-bold")}>Department</FormLabel>
                                                <MultiSelect
                                                    options={listDepartmentOptions}
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    placeholder="Select department"
                                                    loadMore={
                                                        useCallback(() => {
                                                            if (departmentResp) {
                                                                const {total: {limits, pages, total}} = departmentResp;
                                                                if (pages * limits < total)
                                                                    setDepartmentPage(cur => cur + 1)
                                                            }
                                                        }, [departmentResp])
                                                    }
                                                />
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
    )
}

export default SubjectSearchForm;