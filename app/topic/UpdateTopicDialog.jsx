"use client"

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {useForm} from "react-hook-form";
import {useCallback, useEffect, useMemo} from "react";
import {MultiSelect} from "@/components/ui/multi-select";
import {toast} from "react-toastify";
import {v4} from "uuid";
import {useUpdateTopic} from "@/hook/useTopic";
import {useSubject} from "@/hook/useSubject";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

const UpdateTopicDialog = ({selectedItem, isOpen, onOpenChange}) => {
    const {
        topic_id,
        topic_name,
        topic_active,
        subject_name,
        subject_id
    } = selectedItem || {};

    const form = useForm({
        defaultValues: {
            topic_name: "",
            subject_id: 0,
        }
    });

    const updateTopicMutation = useUpdateTopic();
    const {data: listSubject} = useSubject({active: 1});

    const listSubjectOptions = useMemo(
        () => listSubject?.data?.map(({subject_id, subject_name}) => ({
            value: subject_id,
            label: subject_name
        })) ?? [],
        [listSubject]
    );

    const onSubmit = useCallback(async (params) => {
        updateTopicMutation.mutate({id: topic_id, params}, {
            onSuccess: (response) => {
                const {returnCode} = response
                if (returnCode === 200) {
                    onOpenChange(false);
                    toast.success(
                        <div key={v4()}>
                            Update topic <b>{topic_name}</b> successfully
                        </div>
                    );
                    updateTopicMutation.reset();
                }
            },
            onError: (error) => {
                const {returnMessage} = error;
                toast.error(returnMessage);
            }
        });
    }, [topic_id]);

    useEffect(() => {
        if (selectedItem) {
            const {topic_name, subject_id} = selectedItem || {};
            form.setValue("topic_name", topic_name);
            form.setValue("subject_id", subject_id);
        }
    }, [selectedItem]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-auto max-w-full">
                <DialogHeader>
                    <DialogTitle>Update</DialogTitle>
                    <DialogDescription>
                        Update a topic
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <div className="sm:w-[525px] w-full">
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="topic_name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("font-bold text-black")}>
                                                Name <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Name" {...field} />
                                            </FormControl>
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
                                                Subject <span className="text-red-500"> *</span>
                                            </FormLabel>
                                            <MultiSelect
                                                isMultiple={false}
                                                isClearable={false}
                                                options={listSubjectOptions}
                                                onValueChange={(value) => field.onChange(value[0])}
                                                value={field.value === 0 ? [] : [field.value]}
                                                placeholder="Select subject"
                                            />
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <div className={cn("flex justify-end")}>
                                    <Button disabled={updateTopicMutation.isPending} type="submit">Save</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateTopicDialog;