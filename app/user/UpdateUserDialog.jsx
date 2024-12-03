"use client"

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {useCallback, useEffect, useMemo} from "react";
import {Switch} from "@/components/ui/switch";
import {MultiSelect} from "@/components/ui/multi-select";
import {useUpdateUser} from "@/hook/useUsers";
import {useRole} from "@/hook/useRole";
import {toast} from "react-toastify";
import {v4} from "uuid";

const UpdateUserDialog = ({selectedItem, isOpen, onOpenChange}) => {
    const {active, email, password, role_id, user_id, username} = selectedItem || {};

    const form = useForm({
        defaultValues: {
            email: "",
            username: "",
            active: true,
            role_id: 1,
        }
    });

    const updateUserMutation = useUpdateUser();
    const {data: listRole} = useRole();

    const onSubmit = useCallback(async (params) => {
        updateUserMutation.mutate({id: user_id, params});
    }, [user_id]);

    useEffect(() => {
        if (updateUserMutation.data) {
            const {returnCode} = updateUserMutation.data
            if (returnCode === 200) {
                onOpenChange(false);
                toast.success(
                    <div key={v4()}>
                        Delete permanently user <b>{username}</b> successfully
                    </div>
                );
                updateUserMutation.reset();
            }
        }
    }, [updateUserMutation.data]);

    useEffect(() => {
        if (selectedItem) {
            Object.entries(selectedItem)?.forEach(([key, value]) => {
                form.setValue(key, value);
            })
        }
    }, [selectedItem]);

    const listRoleOptions = useMemo(
        () => listRole?.map(({role_id, role_name}) => ({
            value: role_id,
            label: role_name
        })) ?? [],
        [listRole]
    );

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update</DialogTitle>
                    <DialogDescription>
                        Update a department
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
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
                                            <FormLabel className={cn("font-bold text-black")}>Status</FormLabel>
                                            <MultiSelect
                                                isMultiple={false}
                                                isClearable={false}
                                                options={listRoleOptions}
                                                onValueChange={(value) => field.onChange(value[0])}
                                                defaultValue={[field.value]}
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