"use client"

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAuth} from "@/provider/AuthProvider";
import MainLayout from "@/components/commons/MainLayout";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import clientRoutes from "@/routes/client";
import {useCallback, useEffect, useState} from "react";
import {MultiSelect} from "@/components/ui/multi-select";
import {v4} from "uuid";
import {useParams, useRouter} from "next/navigation";
import {useSubject} from "@/hook/useSubject";
import {Textarea} from "@/components/ui/textarea";
import {useTopic, useUpdateTopic} from "@/hook/useTopic";

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

const UpdateDepartment = () => {
    const {role} = useAuth();

    const router = useRouter();
    const params = useParams();

    const {id} = params;

    const {data: topicData} = useTopic({topic_id: id})

    /*{
        "topic_id": 15,
        "topic_name": "ádasd",
        "description": "ádasd",
        "active": 1,
        "subject": [
            {
                "topic_id": 15,
                "subject_id": 22,
                "subject_name": "ádasd",
                "active": 1,
                "description": "\náda"
            }
        ]
    }*/
    const {topic_id, topic_name, description, active, subject} = topicData?.data?.[0] ?? {};

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic_name: "",
            subject_id: [],
            description: "",
        }
    });

    const updateTopicMutation = useUpdateTopic();

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

    const onSubmit = useCallback((params) => {
        updateTopicMutation.mutate({id: id, params}, {
            onSuccess: (response) => {
                const {returnCode} = response
                if (returnCode === 200) {
                    toast.success(
                        <div key={v4()}>
                            Update topic <b>{topic_name}</b> successfully
                        </div>
                    );
                    updateTopicMutation.reset();
                    router.push(clientRoutes.topic.list.path);
                }
            },
            onError: (error) => {
                const {returnMessage} = error;
                toast.error(returnMessage);
            }
        });
    }, [id]);

    useEffect(() => form.setValue("topic_name", topic_name), [topic_name]);
    useEffect(() => form.setValue("description", description), [description]);
    useEffect(() =>
            form.setValue("subject_id", subject?.map(item => item.subject_id) || []),
        [subject]
    );

    return (
        <MainLayout>
            <div className={cn("flex justify-center items-center min-h-full")}>
                <Card className={cn("w-full max-w-[600px] py-5")}>
                    <CardHeader>
                        <CardTitle>Update Topic</CardTitle>
                        <CardDescription>Update Topic</CardDescription>
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
                                    disabled={updateTopicMutation.isPending}
                                    variant="outline"
                                    type="reset"
                                    onClick={() => router.push(clientRoutes.topic.list.path)}
                                >
                                    Cancel
                                </Button>
                                <Button disabled={updateTopicMutation.isPending} type="submit">Submit</Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>
        </MainLayout>
    )
}

export default UpdateDepartment;