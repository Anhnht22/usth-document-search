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
import {Plus} from "lucide-react";
import {useMemo, useState} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useTopic} from "@/hook/useTopic";
import {MultiSelect} from "@/components/ui/multi-select";
import {FileUpload} from "@/components/ui-custom/FileUpload";
import {useCreateDocument} from "@/hook/useDocument";

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
    file: z.any().refine((file) => file instanceof File, {
        message: "File is required!",
    }),
})

const CreateDocumentDialog = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            topic_id: "",
            file: null
        }
    });

    const {mutate: createDocument, isPending} = useCreateDocument();
    const {data: topicResp} = useTopic();

    const listTopicOptions = useMemo(
        () => topicResp?.data?.map(({topic_id, topic_name}) => ({
            value: topic_id,
            label: topic_name
        })) ?? [],
        [topicResp]
    );

    const [isOpen, setIsOpen] = useState(false);

    const onSubmit = async (params) => {
        const formData = new FormData();
        formData.append("folder", "document");
        Object.keys(params).forEach((key) => {
            if (key === "file") {
                formData.append("file", params.file); // File duy nhất
            } else {
                formData.append(key, params[key]);
            }
        });

        createDocument(formData, {
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

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><Plus/> Create</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] overflow-y-auto max-h-screen">
                <DialogHeader>
                    <DialogTitle>Create</DialogTitle>
                    <DialogDescription>
                        Create new document
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
                                                defaultValue={field.value !== "" ? [field.value] : []}
                                                placeholder="Select topic"
                                            />
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("font-bold text-black")}>Files</FormLabel>
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
                                <Button disabled={isPending} type="submit">Save</Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateDocumentDialog;