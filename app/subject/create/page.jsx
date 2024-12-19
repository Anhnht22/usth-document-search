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
import {useDepartments} from "@/hook/useDepartments";
import {useAuth} from "@/provider/AuthProvider";
import {useCreateSubject} from "@/hook/useSubject";
import MainLayout from "@/components/commons/MainLayout";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {useRouter} from "next/navigation";
import clientRoutes from "@/routes/client";
import {Textarea} from "@/components/ui/textarea";

const formSchema = z.object({
    subject_name: z.string().min(1, {
        message: "Subject name is required!",
    }),
    department_id: z.array(z.number()).min(1, {
        message: "Department is required!",
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
            subject_name: "",
            department_id: [],
            description: "",
        }
    });
    const {mutate: createSubject, isPending} = useCreateSubject();

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

    const setPageChange = useCallback(() => {
        if (listDepartment) {
            const {total: {limits, pages, total}} = listDepartment;
            if (pages * limits < total) setDepartmentPage(cur => cur + 1)
        }
    }, [listDepartment]);

    const onSubmit = async (params) => {
        createSubject(params, {
            onSuccess: (response) => {
                const {returnMessage} = response;

                form.reset();
                toast.success(returnMessage);
                router.push(clientRoutes.subject.list.path);
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
                        <CardTitle>Create Subject</CardTitle>
                        <CardDescription>Create Subject</CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className={cn("space-y-4")}>
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
                                    onClick={() => router.push(clientRoutes.subject.list.path)}
                                >Cancel
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