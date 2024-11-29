"use client"

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {useUpdateDepartment} from "@/hook/useDepartments";
import {useEffect} from "react";
import {toast} from "react-toastify";
import {v4} from "uuid";
import {Switch} from "@/components/ui/switch";

const UpdateDepartmentDialog = ({departmentItem, isOpen, onOpenChange}) => {
    const {department_id, department_name, description, active} = departmentItem || {};

    const form = useForm({
        defaultValues: {
            department_name: "",
            description: "",
            active: 0
        }
    });

    const updateDepartmentMutation = useUpdateDepartment();

    const onSubmit = async (params) => {
        updateDepartmentMutation.mutate({id: department_id, params});
    };

    useEffect(() => {
        if (updateDepartmentMutation.data) {
            const {returnCode} = updateDepartmentMutation.data
            if (returnCode === 200) {
                onOpenChange(false);
                toast.success(
                    <div key={v4()}>
                        Delete permanently department <b>{department_name}</b> successfully
                    </div>
                );
                updateDepartmentMutation.reset();
            }
        }
    }, [updateDepartmentMutation.data]);

    useEffect(() => {
        form.setValue('department_name', department_name);
        form.setValue('description', description);
        form.setValue('active', active);
    }, [department_name, description, active]);

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
                            <FormField
                                control={form.control}
                                name="department_name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className={cn("font-bold")}>
                                            Name <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name" {...field} />
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
                                            Description <span className="text-red-500"> *</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Description" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="active"
                                render={({field}) => (
                                    <FormItem
                                        className="flex flex-row items-center justify-between rounded-lg border px-3 py-1 shadow-sm">
                                        <div className="">
                                            <FormLabel>Active</FormLabel>
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
                            <div className={cn("flex justify-end")}>
                                <Button type="submit">Save</Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateDepartmentDialog;