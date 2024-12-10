"use client"

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useForm, useWatch} from "react-hook-form";
import {useCallback, useEffect, useMemo} from "react";
import {Switch} from "@/components/ui/switch";
import {MultiSelect} from "@/components/ui/multi-select";
import {useUpdateUser} from "@/hook/useUsers";
import {useRole} from "@/hook/useRole";
import {toast} from "react-toastify";
import {v4} from "uuid";
import {rolesType} from "@/roles/constants";
import {useDepartments} from "@/hook/useDepartments";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const formSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required!",
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

const UpdateUserDialog = ({selectedItem, isOpen, onOpenChange}) => {
    const {active, email, password, role_id, user_id, username} = selectedItem || {};

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            username: "",
            active: true,
            role_id: 0,
            department_ids: [],
        }
    });
    const userRoleId = useWatch({control: form.control, name: "role_id"});

    const updateUserMutation = useUpdateUser();
    const {data: listDepartment} = useDepartments({active: 1});
    const {data: listRole} = useRole({active: 1});

    const onSubmit = useCallback((params) => {
        updateUserMutation.mutate({id: user_id, params}, {
            onSuccess: (response) => {
                const {returnCode} = response
                if (returnCode === 200) {
                    onOpenChange(false);
                    toast.success(
                        <div key={v4()}>
                            Update user <b>{username}</b> successfully
                        </div>
                    );
                    updateUserMutation.reset();
                }
            },
            onError: (error) => {
                const {returnMessage} = error;
                toast.error(returnMessage);
            }
        });
    }, [user_id]);

    useEffect(() => {
        if (selectedItem) {
            const {email, department, username, role_id, active} = selectedItem;
            form.setValue("email", email);
            form.setValue("username", username);
            form.setValue("role_id", role_id);
            form.setValue("active", active);
        }
    }, [selectedItem]);

    const listRoleOptions = useMemo(
        () => listRole?.data?.map(({role_id, role_name}) => ({
            value: role_id,
            label: role_name
        })) ?? [],
        [listRole]
    );

    useEffect(() => {
        if (selectedItem) {
            const itemRole = listRoleOptions.filter(item => item.value === userRoleId)?.[0];
            const {email, department, username, role_id, active} = selectedItem;

            if (form.getValues("department_ids").length === 0) {
                form.setValue("department_ids", department?.map(({department_id}) => department_id) || []);
            }

            if (itemRole && itemRole.label === rolesType.student) {
                form.setValue("department_ids", [form.getValues("department_ids")?.[0]]);
            }
        }
    }, [userRoleId, selectedItem, listRoleOptions]);

    const roleSelected = useMemo(
        () => listRoleOptions.filter(item => item.value === userRoleId)?.[0]
        , [userRoleId]
    );

    const listDepartmentOptions = useMemo(
        () => listDepartment?.data?.map(({department_id, department_name}) =>
            ({
                value: department_id,
                label: department_name
            })) ?? [],
        [listRole]
    );

    useEffect(() => {
        if (!isOpen) form.reset();
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Update</DialogTitle>
                    <DialogDescription>
                        Update a department
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
                                    name="department_ids"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("font-bold text-black")}>
                                                Department <span className="text-red-500"> *</span>
                                            </FormLabel>
                                            <MultiSelect
                                                isMultiple={roleSelected?.label !== rolesType.student}
                                                isClearable={false}
                                                options={listDepartmentOptions}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                defaultValue={field.value}
                                                placeholder="Select department"
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
                                                value={field.value === 0 ? [] : [field.value]}
                                                placeholder="Select role"
                                            />
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
                                                    "flex flex-row items-center gap-3",
                                                    "py-1 w-full"
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
                                <Button disabled={updateUserMutation.isPending} type="submit">Save</Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateUserDialog;