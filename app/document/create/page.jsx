"use client"

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useForm, useWatch} from "react-hook-form";
import {toast} from "react-toastify";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAuth} from "@/provider/AuthProvider";
import MainLayout from "@/components/commons/MainLayout";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {useRouter} from "next/navigation";
import clientRoutes from "@/routes/client";
import {MultiSelect} from "@/components/ui/multi-select";
import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import CreateKeywordDocument from "@/app/document/CreateKeywordDocument";
import {FileUpload} from "@/components/ui-custom/FileUpload";
import {useTopicParams} from "@/hook/useTopic";
import {useKeyword} from "@/hook/useKeyword";
import {useCreateDocument} from "@/hook/useDocument";
import slugify from "slugify";
import {Textarea} from "@/components/ui/textarea";
import {useDepartments} from "@/hook/useDepartments";
import {useSubjectByUser} from "@/hook/useSubject";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Name is required!",
    }),
    description: z.string().min(1, {
        message: "Description is required!",
    }),
    department_id: z.array(z.number()).min(1, {
        message: "Department is required!",
    }),
    subject_id: z.array(z.number()).min(1, {
        message: "Subject is required!",
    }),
    topic_id: z.array(z.number()).min(1, {
        message: "Topic is required!",
    }),
    file: z.any().refine((file) => file instanceof File, {
        message: "File is required!",
    }),
    keyword_ids: z.array(z.number()).default([]),
})

const CreateDocument = () => {
    const router = useRouter();

    const {role} = useAuth();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            department_id: [],
            subject_id: [],
            topic_id: [],
            file: null,
            keyword_ids: [],
        }
    });
    const dataForm = useWatch({control: form.control});
    const dataDepartmentForm = useWatch({control: form.control, name: "department_id"});

    const {mutate: createDocument, isPending} = useCreateDocument();

    const onSubmit = (params) => {
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
            } else if (key === "topic_id" && Array.isArray(params[key])) {
                params[key].forEach((id) => {
                    formData.append("topic_id[]", id); // Append từng giá trị
                });
            } else if (key === "department_id" && Array.isArray(params[key])) {
                params[key].forEach((id) => {
                    formData.append("department_id[]", id); // Append từng giá trị
                });
            } else if (key === "subject_id" && Array.isArray(params[key])) {
                params[key].forEach((id) => {
                    formData.append("subject_id[]", id); // Append từng giá trị
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
                router.push(clientRoutes.document.list.path);
            },
            onError: (error) => {
                const {returnMessage} = error;
                toast.error(returnMessage);
            },
        });
    };

    const [listTopicOptions, setListTopicOptions] = useState([]);
    const [topicPage, setTopicPage] = useState(1);
    const [searchParamsTopic, setSearchParamsTopic] = useState(null);
    const {data: listTopic} = useTopicParams(searchParamsTopic);

    useEffect(() => {
        setListTopicOptions(prev =>
            [
                ...prev,
                ...(
                    listTopic?.data
                        ?.filter(({topic_id}) => !prev.some(option => option.value === topic_id))
                        .map(({topic_id, topic_name}) => ({
                            value: topic_id,
                            label: topic_name
                        })) ?? []
                )
            ]
        )
    }, [listTopic]);

    const setPageChange = useCallback(() => {
        if (listTopic) {
            const {total: {limits, pages, total}} = listTopic;
            if (pages * limits < total) setTopicPage(cur => cur + 1)
        }
    }, [listTopic]);

    const [listKeywordOptions, setListKeywordOptions] = useState([]);
    const [keywordPage, setKeywordPage] = useState(1);
    const {data: listKeyword} = useKeyword({
        active: 1,
        limit: 20,
        page: keywordPage,
        order: JSON.stringify({"t.keyword_id": "desc"}),
    });

    useEffect(() => {
        setListKeywordOptions(prev =>
            [
                ...prev,
                ...(
                    listKeyword?.data
                        ?.filter(({keyword_id}) => !prev.some(option => option.value === keyword_id))
                        .map(({keyword_id, keyword}) => ({
                            value: keyword_id,
                            label: keyword
                        })) ?? []
                )
            ]
        )
    }, [listKeyword]);

    const setPageKeywordChange = useCallback(() => {
        if (listKeyword) {
            const {total: {limits, pages, total}} = listKeyword;
            if (pages * limits < total) setKeywordPage(cur => cur + 1)
        }
    }, [listKeyword]);

    const onCreate = (data) => {
        const {insertId} = data;
        form.setValue("keyword_ids", [...form.getValues("keyword_ids"), insertId]);
        setPageKeywordChange(1);
    }

    const [listDepartmentOptions, setListDepartmentOptions] = useState([]);
    const [departmentPage, setDepartmentPage] = useState(1);
    const {data: listDepartment} = useDepartments({
        active: 1,
        limit: 20,
        page: departmentPage,
        order: JSON.stringify({"t.department_id": "desc"}),
    });

    useEffect(() => {
        setListDepartmentOptions(prev =>
            [
                ...prev,
                ...(
                    listDepartment?.data
                        ?.filter(({department_id}) => !prev.some(option => option.value === department_id))
                        .map(({department_id, department_name}) => ({
                            value: department_id,
                            label: department_name
                        })) ?? []
                )
            ]
        )
    }, [listDepartment]);

    const setPageChangeDepartment = useCallback(() => {
        if (listDepartment) {
            const {total: {limits, pages, total}} = listDepartment;
            if (pages * limits < total) setDepartmentPage(cur => cur + 1)
        }
    }, [listDepartment]);

    const [listSubjectOptions, setListSubjectOptions] = useState([]);
    const [subjectPage, setSubjectPage] = useState(1);
    const [searchParamsSubject, setSearchParamsSubject] = useState(null);
    const {data: listSubject} = useSubjectByUser(searchParamsSubject);

    useEffect(() => {
        setListSubjectOptions(prev =>
            [
                ...prev,
                ...(
                    listSubject?.data
                        ?.filter(({subject_id}) => !prev.some(option => option.value === subject_id))
                        .map(({subject_id, subject_name}) => ({
                            value: subject_id,
                            label: subject_name
                        })) ?? []
                )
            ]
        )
    }, [listSubject]);

    const setPageChangeSubject = useCallback(() => {
        if (listSubject) {
            const {total: {limits, pages, total}} = listSubject;
            if (pages * limits < total) setSubjectPage(cur => cur + 1)
        }
    }, [listSubject]);

    return (
        <MainLayout>
            <div className="flex items-center justify-center min-h-full">
                <Card className={cn("w-full max-w-[600px] py-5 mx-auto")}>
                    <CardHeader>
                        <CardTitle>Create Document</CardTitle>
                        <CardDescription>Create Document</CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className={cn("h-full")}>
                            <CardContent className={cn("space-y-4")}>
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
                                                <Textarea placeholder="Description" {...field} />
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
                                                Department <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <MultiSelect
                                                isClearable={false}
                                                options={listDepartmentOptions}
                                                loadMore={setPageChangeDepartment()}
                                                onValueChange={(value) => {
                                                    setListSubjectOptions([]);
                                                    if (value && value.length > 0) {
                                                        setSearchParamsSubject({
                                                            active: 1,
                                                            limit: 20,
                                                            page: subjectPage,
                                                            department_id: value,
                                                            order: JSON.stringify({"t.subject_id": "desc"}),
                                                        })
                                                    } else {
                                                        setSearchParamsSubject(null);
                                                    }
                                                    form.setValue("subject_id", []);
                                                    field.onChange(value)
                                                }}
                                                value={field.value}
                                                placeholder="Select Department"
                                            />
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
                                                Subject <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <MultiSelect
                                                isClearable={false}
                                                options={listSubjectOptions}
                                                loadMore={setPageChangeSubject()}
                                                onValueChange={(value) => {
                                                    setListTopicOptions([]);
                                                    if (value && value.length > 0) {
                                                        setSearchParamsTopic({
                                                            active: 1,
                                                            limit: 20,
                                                            page: topicPage,
                                                            subject_id: value,
                                                            department_id: form.getValues("department_id"),
                                                            order: JSON.stringify({"t.topic_id": "desc"}),
                                                        })
                                                    } else {
                                                        setSearchParamsSubject(null);
                                                    }
                                                    form.setValue("topic_id", []);
                                                    field.onChange(value)
                                                }}
                                                value={field.value}
                                                placeholder="Select Subject"
                                            />
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
                                                isClearable={false}
                                                options={listTopicOptions}
                                                loadMore={setPageChange}
                                                onValueChange={field.onChange}
                                                value={field.value}
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
                                                loadMore={setPageKeywordChange}
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
                            </CardContent>
                            <CardFooter className="flex justify-center gap-3">
                                <Button
                                    disabled={isPending}
                                    variant="outline"
                                    type="reset"
                                    onClick={() => router.push(clientRoutes.document.list.path)}
                                >
                                    Cancel
                                </Button>
                                <Button disabled={isPending} type="submit">Submit</Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>
        </MainLayout>
    )
}

export default CreateDocument;