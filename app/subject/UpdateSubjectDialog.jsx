"use client"

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {useCallback, useEffect, useState} from "react";
import {MultiSelect} from "@/components/ui/multi-select";
import {toast} from "react-toastify";
import {v4} from "uuid";
import {useDepartments} from "@/hook/useDepartments";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useUpdateSubject} from "@/hook/useSubject";

const formSchema = z.object({
    subject_name: z.string().min(1, {
        message: "Subject name is required!",
    }),
    department_id: z.array(z.number()).min(1, {
        message: "Department is required!",
    }),
});

const UpdateSubjectDialog = ({selectedItem, isOpen, onOpenChange}) => {
    const {subject_active: active, department, subject_id, subject_name} = selectedItem || {};

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subject_name: "",
            department_id: []
        }
    });

    const updateSubjectMutation = useUpdateSubject();

    const onSubmit = useCallback((params) => {
        updateSubjectMutation.mutate({id: subject_id, params}, {
            onSuccess: (response) => {
                const {returnCode} = response
                if (returnCode === 200) {
                    onOpenChange(false);
                    toast.success(
                        <div key={v4()}>
                            Update subject <b>{subject_name}</b> successfully
                        </div>
                    );
                    updateSubjectMutation.reset();
                }
            },
            onError: (error) => {
                const {returnMessage} = error;
                toast.error(returnMessage);
            }
        });
    }, [subject_id]);

    useEffect(() => {
        if (selectedItem) {
            const {department, subject_id, subject_name} = selectedItem;
            form.setValue("subject_name", subject_name);
            form.setValue("department_id", department.map(({department_id}) => department_id));
        }
    }, [selectedItem]);

    useEffect(() => {
        if (!isOpen) form.reset();
    }, [isOpen]);

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
                            <FormField
                                control={form.control}
                                name="subject_name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className={cn("font-bold text-black")}>
                                            Subject <span className="text-red-500"> *</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Subject" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="department_id"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className={cn("font-bold text-black")}>
                                            Department <span className="text-red-500"> *</span>
                                        </FormLabel>
                                        <MultiSelect
                                            isClearable={false}
                                            options={listDepartmentOptions}
                                            onValueChange={field.onChange}
                                            value={field.value}
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
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className={cn("flex justify-end")}>
                                <Button disabled={updateSubjectMutation.isPending} type="submit">Save</Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateSubjectDialog;