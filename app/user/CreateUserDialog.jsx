"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {EyeIcon, EyeOffIcon, Plus} from "lucide-react";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useForm, useWatch} from "react-hook-form";
import {toast} from "react-toastify";
import {useCreateUser} from "@/hook/useUsers";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Switch} from "@/components/ui/switch";
import {MultiSelect} from "@/components/ui/multi-select";
import {useRole} from "@/hook/useRole";
import {useDepartments} from "@/hook/useDepartments";
import {useAuth} from "@/provider/AuthProvider";
import {rolesType} from "@/roles/constants";

const formSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required!",
    }),
    password: z.string().min(1, {
        message: "Password is required!",
    }),
    email: z.string().min(1, {
        message: "Email is required!", // Kiểm tra giá trị rỗng
    }).email({
        message: "Invalid email address!", // Kiểm tra định dạng email
    }),
    active: z.number(),
    role_id: z.number().min(1, {
        message: "Role is required!",
    }),
    department_ids: z.array(z.number()).min(1, {
        message: "Department is required!",
    }),
});

const CreateUserDialog = () => {
    const {role} = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            email: "",
            active: 1,
            role_id: 0,
            department_ids: []
        }
    });
    const userRole = useWatch({control: form.control, name: "role_id"});

    const {mutate: createUser, isPending} = useCreateUser();

    const [listDepartmentOptions, setListDepartmentOptions] = useState([]);
    const [departmentPage, setDepartmentPage] = useState(1);
    const {data: listDepartment} = useDepartments({
        active: 1,
        limit: 10,
        page: departmentPage,
        order: JSON.stringify({"t.department_id": "desc"}),
    });
    const {data: listRole} = useRole({active: 1});

    const onSubmit = async (params) => {
        createUser(params, {
            onSuccess: (response) => {
                const {returnMessage} = response;

                form.reset();
                toast.success(returnMessage);
                setIsOpen(false);
            },
            onError: (error) => {
                const {returnMessage} = error;
                toast.error(returnMessage);
            },
        });
    };

    const listRoleOptions = useMemo(
        () => listRole?.data?.map(({role_id, role_name}) => ({
            value: role_id,
            label: role_name
        })) ?? [],
        [listRole]
    );

    const roleSelected = useMemo(
        () => listRoleOptions.filter(item => item.value === userRole)?.[0]
        , [userRole]
    );

    useEffect(() => {
        setListDepartmentOptions(prev =>
            [
                ...prev,
                ...(
                    listDepartment?.data?.map(({department_id, department_name}) =>
                        ({
                            value: department_id,
                            label: department_name
                        })) ?? []
                )
            ]
        )
    }, [listDepartment]);

    useEffect(() => {
        form.setValue("department_ids", []);
    }, [userRole]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><Plus/> Create</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create</DialogTitle>
                    <DialogDescription>
                        Create new user
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("font-bold text-black")}>
                                                Email <span className="text-red-500"> *</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Email" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="role_id"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("font-bold text-black")}>
                                                Role <span className="text-red-500"> *</span>
                                            </FormLabel>
                                            <MultiSelect
                                                isMultiple={false}
                                                isClearable={false}
                                                options={listRoleOptions}
                                                onValueChange={(value) => field.onChange(value[0])}
                                                defaultValue={field.value === 0 ? [] : [field.value]}
                                                placeholder="Select role"
                                            />
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("font-bold text-black")}>
                                                Username <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Username" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("font-bold text-black")}>
                                                Password
                                                <span className="text-red-500"> *</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className={cn("relative")}>
                                                    <Input type={showPassword ? "text" : "password"}
                                                           placeholder="••••••••" {...field}/>
                                                    <button
                                                        type="button"
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOffIcon className="h-4 w-4 text-gray-500"/>
                                                        ) : (
                                                            <EyeIcon className="h-4 w-4 text-gray-500"/>
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="department_ids"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("font-bold text-black")}>
                                                Department <span className="text-red-500"> *</span>
                                            </FormLabel>
                                            <MultiSelect
                                                isMultiple={roleSelected?.label !== rolesType.student}
                                                options={listDepartmentOptions}
                                                loadMore={
                                                    useCallback(() => {
                                                        if (listDepartment) {
                                                            const {total: {limits, pages, total}} = listDepartment;
                                                            if (pages * limits < total)
                                                                setDepartmentPage(cur => cur + 1)
                                                        }
                                                    }, [listDepartment])
                                                }
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                defaultValue={field.value}
                                                placeholder="Select department"
                                            />
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <div className={cn("flex items-end")}>
                                    <FormField
                                        control={form.control}
                                        name="active"
                                        render={({field}) => (
                                            <FormItem
                                                className={cn(
                                                    "flex flex-row items-center justify-between",
                                                    "px-3 py-1 w-full"
                                                )}
                                            >
                                                <div>
                                                    <FormLabel className="font-bold text-black">Active</FormLabel>
                                                </div>
                                                <div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            aria-readonly
                                                        />
                                                    </FormControl>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className={cn("flex justify-end")}>
                                <Button disabled={isPending} type="submit">Save</Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateUserDialog;