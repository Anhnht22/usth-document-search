import {cn} from "@/lib/utils";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ChevronRight, Filter} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {MultiSelect} from "@/components/ui/multi-select";
import {listActiveOptions} from "@/utils/common";
import {Button} from "@/components/ui/button";
import {useEffect, useMemo, useRef, useState} from "react";
import {useForm, useWatch} from "react-hook-form";
import {debounce, isEqual} from "lodash";
import {useRole} from "@/hook/useRole";

const defaultValues = {
    username: "",
    email: "",
    role_name: [],
    active: []
}

const SearchForm = ({onChangeFilter}) => {
    const form = useForm({
        defaultValues: defaultValues
    });
    const searchParams = useWatch({control: form.control});
    // Lưu giá trị params trước đó
    const previousParams = useRef(defaultValues);

    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isHoveringSidebar, setIsHoveringSidebar] = useState(false);

    const {data: listRole} = useRole();

    const toggleSidebar = () => setIsSidebarVisible(prev => !prev)

    const onChangeFilterInternal = (params) => {
        onChangeFilter(compare);
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

    const listRoleOptions = useMemo(
        () => listRole?.data?.map(({role_id, role_name}) => ({
            value: role_id,
            label: role_name
        })) ?? [],
        [listRole]
    );

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
                                        name="username"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className={cn("font-bold")}>
                                                    Username
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Username..." {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className={cn("font-bold")}>
                                                    Email
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Email..." {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="role_name"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className={cn("font-bold")}>Status</FormLabel>
                                                <MultiSelect
                                                    options={listRoleOptions}
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    placeholder="Select role"
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

export default SearchForm;