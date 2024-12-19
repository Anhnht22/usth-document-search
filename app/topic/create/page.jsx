"use client"

import {Button} from "@/components/ui/button";
import {useCallback, useEffect, useState} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {MultiSelect} from "@/components/ui/multi-select";
import {useAuth} from "@/provider/AuthProvider";
import MainLayout from "@/components/commons/MainLayout";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {useRouter} from "next/navigation";
import clientRoutes from "@/routes/client";
import {Textarea} from "@/components/ui/textarea";
import {useCreateTopic} from "@/hook/useTopic";
import {useSubject} from "@/hook/useSubject";

const formSchema = z.object({
    topic_name: z.string().min(1, {
        message: "Topic name is required!",
    }),
    subject_id: z.array(z.number()).min(1, {
        message: "Subject is required!",
    }),
    description: z.string().min(1, {
        message: "Description is required!",
    }),
});

const CreateSubject = () => {
    const router = useRouter();

    const {role} = useAuth();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic_name: "",
            subject_id: [],
            description: "",
        }
    });
    const {mutate: createTopic, isPending} = useCreateTopic();

    const [listSubjectOptions, setListSubjectOptions] = useState([]);
    const [subjectPage, setSubjectPage] = useState(1);
    const {data: listSubject} = useSubject({
        active: 1,
        limit: 20,
        page: subjectPage,
        order: JSON.stringify({"t.subject_id": "desc"}),
    });

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

    const setPageChange = useCallback(() => {
        if (listSubject) {
            const {total: {limits, pages, total}} = listSubject;
            if (pages * limits < total) setSubjectPage(cur => cur + 1)
        }
    }, [listSubject]);

    const onSubmit = async (params) => {
        createTopic(params, {
            onSuccess: (response) => {
                const {returnMessage} = response;

                form.reset();
                toast.success(returnMessage);
                router.push(clientRoutes.topic.list.path);
            },
            onError: (error) => {
                const {returnMessage} = error;
                toast.error(returnMessage);
            },
        });
    };

    return (
        <MainLayout>
            <div className={cn("flex justify-center items-center min-h-full")}>
                <Card className="w-full max-w-[500px] py-5">
                    <CardHeader>
                        <CardTitle>Create Topic</CardTitle>
                        <CardDescription>Create Topic</CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className={cn("space-y-4")}>
                                <FormField
                                    control={form.control}
                                    name="topic_name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("font-bold text-black")}>
                                                Topic <span className="text-red-500"> *</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Topic" {...field} />
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
                                                <Textarea placeholder="Description..." {...field}/>
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
                                                isClearable={false}
                                                options={listSubjectOptions}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                placeholder="Select subject"
                                                loadMore={setPageChange}
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
                                    onClick={() => router.push(clientRoutes.topic.list.path)}
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

export default CreateSubject;