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
import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useTopic} from "@/hook/useTopic";
import {MultiSelect} from "@/components/ui/multi-select";
import {FileUpload} from "@/components/ui-custom/FileUpload";
import {useCreateDocument} from "@/hook/useDocument";
import {useKeyword} from "@/hook/useKeyword";
import {toast} from "react-toastify";
import CreateKeywordDocument from "@/app/document/CreateKeywordDocument";
import slugify from "slugify";

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
    keyword_ids: z.array(z.number()).default([]),
})

const CreateDocumentDialog = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            topic_id: "",
            file: null,
            keyword_ids: [],
        }
    });

    const {mutate: createDocument, isPending} = useCreateDocument();

    const [listTopicOptions, setListTopicOptions] = useState([]);
    const [topicPage, setTopicPage] = useState(1);
    const {data: topicResp} = useTopic({
        limit: 10,
        page: topicPage,
        active: 1,
        order: JSON.stringify({"t.topic_id": "desc"})
    });

    const [listKeywordOptions, setListKeywordOptions] = useState([]);
    const [keywordPage, setKeywordPage] = useState(1);
    const {data: keywordResp} = useKeyword({
        limit: 10,
        page: keywordPage,
        active: 1,
        order: JSON.stringify({"t.keyword_id": "desc"})
    });

    useEffect(() => {
        setListTopicOptions(prev =>
            [
                ...prev,
                ...(
                    topicResp?.data?.map(({topic_id, topic_name}) => ({
                        value: topic_id,
                        label: topic_name
                    })) ?? []
                )
            ]
        )
    }, [topicResp]);

    useEffect(() => {
        setListKeywordOptions(prev =>
            [
                ...prev,
                ...(
                    keywordResp?.data?.map(({keyword_id, keyword}) => ({
                        value: keyword_id,
                        label: keyword
                    })) ?? []
                )
            ]
        )
    }, [keywordResp]);

    const [isOpen, setIsOpen] = useState(false);

    const onSubmit = async (params) => {
        const formData = new FormData();
        formData.append("folder", "document");
        Object.keys(params).forEach((key) => {
            if (key === "file") {
                const file = params.file;

                // Tách tên file và extension
                const originalName = file.name;
                const extension = originalName.substring(originalName.lastIndexOf('.')); // Lấy extension (.docx, .pdf, ...)

                // Chuẩn hóa tên file (không tính phần extension)
                const baseName = slugify(originalName.substring(0, originalName.lastIndexOf('.')), {
                    lower: true,
                    strict: true,
                });

                // Nối lại tên file và extension
                const safeName = `${baseName}${extension}`;

                // Tạo file mới với tên chuẩn hóa
                const renamedFile = new File([file], safeName, {type: file.type});

                // Thêm vào FormData
                formData.append("file", renamedFile);
            } else if (key === "keyword_ids" && Array.isArray(params[key])) {
                params[key].forEach((id) => {
                    formData.append("keyword_ids[]", id); // Append từng giá trị
                });
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

    const onCreate = (data) => {
        const {insertId} = data;
        form.setValue("keyword_ids", [...form.getValues("keyword_ids"), insertId]);
    }

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
                                                loadMore={
                                                    useCallback(() => {
                                                        if (topicResp) {
                                                            const {total: {limits, pages, total}} = topicResp;
                                                            if (pages * limits < total)
                                                                setTopicPage(cur => cur + 1)
                                                        }
                                                    }, [topicResp])
                                                }
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
                                    name="keyword_ids"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("font-bold text-black")}>
                                                Keyword
                                            </FormLabel>
                                            <MultiSelect
                                                options={listKeywordOptions}
                                                loadMore={
                                                    useCallback(() => {
                                                        if (keywordResp) {
                                                            const {total: {limits, pages, total}} = keywordResp;
                                                            if (pages * limits < total)
                                                                setKeywordPage(cur => cur + 1)
                                                        }
                                                    }, [keywordResp])
                                                }
                                                isCreate={true}
                                                CreateComponent={<CreateKeywordDocument onCreate={onCreate}/>}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                placeholder="Select keyword"
                                            />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel
                                                className={cn("font-bold text-black")}>Files</FormLabel>
                                            <FileUpload
                                                limit={1}
                                                onFilesChange={useCallback((files) => field.onChange(files[0] || null), [])}
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