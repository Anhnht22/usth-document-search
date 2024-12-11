"use client"

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {useCallback, useEffect, useMemo} from "react";
import {MultiSelect} from "@/components/ui/multi-select";
import {toast} from "react-toastify";
import {v4} from "uuid";
import {useUpdateDocument} from "@/hook/useDocument";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {FileUpload} from "@/components/ui-custom/FileUpload";
import {useTopic} from "@/hook/useTopic";
import {File} from "lucide-react";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Name is required!",
    }),
    description: z.string().min(1, {
        message: "Description is required!",
    }),
    topic_id: z.number().min(1, {
        message: "Topic is required!",
    }),
    file_new: z.any()
})

const UpdateUserDialog = ({selectedItem, isOpen, onOpenChange}) => {
    /*{
        "document_id": 1,
        "file_path": "document/1733222886694-319333330-glowing-golden.png",
        "title": "Program File Demo",
        "description": "Program File Demo",
        "upload_date": 1733233654631,
        "document_active": 0,
        "username": "admin",
        "topic_name": "Program 1",
        "topic_id": 1
    }*/
    const {document_id, title, file_path} = selectedItem || {};

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            topic_id: "",
            file_new: null
        }
    });

    const updateDocumentMutation = useUpdateDocument();
    const {data: topicResp} = useTopic({active: 1});

    const listTopicOptions = useMemo(
        () => topicResp?.data?.map(({topic_id, topic_name}) => ({
            value: topic_id,
            label: topic_name
        })) ?? [],
        [topicResp]
    );

    const onSubmit = useCallback(async (params) => {
        const formData = new FormData();
        formData.append("folder", "document");
        Object.keys(params).forEach((key) => {
            if (key === "file_new") {
                if (params.file_new !== null)
                    formData.append("file", params.file_new); // File duy nhất
            } else {
                formData.append(key, params[key]);
            }
        });

        updateDocumentMutation.mutate({id: document_id, params: formData}, {
            onSuccess: (response) => {
                const {returnCode} = response
                if (returnCode === 200) {
                    onOpenChange(false);
                    toast.success(
                        <div key={v4()}>
                            Update document <b>{title}</b> successfully
                        </div>
                    );
                    updateDocumentMutation.reset();
                }
            },
            onError: (error) => {
                const {returnMessage} = error;
                toast.error(returnMessage);
            }
        });
    }, [document_id]);

    useEffect(() => {
        if (selectedItem) {
            const {title, description, topic_id} = selectedItem;
            form.setValue("title", title)
            form.setValue("description", description)
            form.setValue("topic_id", topic_id)
        }
    }, [selectedItem]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-screen">
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
                                    name="title"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("font-bold text-black")}>
                                                Title <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Title" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("font-bold text-black")}>
                                                Description <span className="text-red-500"> *</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Description" {...field} />
                                            </FormControl>
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
                                                Topic <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <MultiSelect
                                                isMultiple={false}
                                                isClearable={false}
                                                options={listTopicOptions}
                                                onValueChange={(value) => field.onChange(value[0])}
                                                value={field.value !== "" ? [field.value] : []}
                                                placeholder="Select topic"
                                            />
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="file_new"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("font-bold text-black")}>Files</FormLabel>
                                            {isOpen && !field.value && (
                                                <ul key={v4()} className="mt-2 space-y-2">
                                                    {[file_path].map((file) => (
                                                        <li key={file}
                                                            className="flex items-center justify-between p-2 bg-muted rounded-md">
                                                            <div className="flex items-center flex-grow w-full">
                                                                <div>
                                                                    <File
                                                                        className="h-5 w-5 mr-2 text-muted-foreground"/>
                                                                </div>
                                                                <span className={cn(
                                                                    "text-sm block w-full",
                                                                    "whitespace-nowrap text-ellipsis truncate"
                                                                )}>{file}</span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            <FileUpload
                                                limit={1}
                                                onFilesChange={(files) => field.onChange(files[0] || null)}
                                            />
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className={cn("flex justify-end")}>
                                <Button disabled={updateDocumentMutation.isPending} type="submit">Save</Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateUserDialog;