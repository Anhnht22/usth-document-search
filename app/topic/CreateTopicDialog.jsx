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
import {useCallback, useEffect, useState} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAuth} from "@/provider/AuthProvider";
import {useCreateTopic} from "@/hook/useTopic";
import {MultiSelect} from "@/components/ui/multi-select";
import {useSubject} from "@/hook/useSubject";

const formSchema = z.object({
    topic_name: z.string().min(1, {
        message: "Name is required!",
    }),
    subject_id: z.number().min(1, {
        message: "Subject is required!",
    }),
})

const CreateTopicDialog = () => {
    const {role} = useAuth();

    const [isOpen, setIsOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic_name: "",
            subject_id: 0,
        }
    });

    const {mutate: createUser, isPending} = useCreateTopic();

    const [listSubjectOptions, setListSubjectOptions] = useState([]);
    const [topicPage, setTopicPage] = useState(1);
    const {data: listSubject} = useSubject({
        limit: 10,
        page: topicPage,
        active: 1,
        order: JSON.stringify({"t.subject_id": "desc"})
    });

    const setTopicPageChange = useCallback(() => {
        if (listSubject) {
            const {total: {limits, pages, total}} = listSubject;
            if (pages * limits < total) setTopicPage(cur => cur + 1)
        }
    }, [listSubject]);

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

    const onSubmit = async (params) => {
        createUser(params, {
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
            <DialogContent className="sm:max-w-[500px] overflow-visible">
                <DialogHeader>
                    <DialogTitle>Create</DialogTitle>
                    <DialogDescription>
                        Create new user
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className={cn("")}>
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
                                            defaultValue={field.value === 0 ? [] : [field.value]}
                                            placeholder="Select subject"
                                            loadMore={setTopicPageChange}
                                        />
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
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

export default CreateTopicDialog;