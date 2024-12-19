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
import {useSubject, useUpdateSubject} from "@/hook/useSubject";
import {Textarea} from "@/components/ui/textarea";
import {useDepartments} from "@/hook/useDepartments";

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

const UpdateDepartment = () => {
    const {role} = useAuth();

    const router = useRouter();
    const params = useParams();

    const {id} = params;

    const {data: subjectData, ...fetchUser} = useSubject({subject_id: id})

    /*{
        "subject_id": 22,
        "subject_name": "ádasd",
        "description": "ádasd",
        "subject_active": 1,
        "department": [
            {
                "subject_id": 22,
                "department_id": 65,
                "department_name": "Faculty of Engineering and Applied Sciences",
                "description": "Covers a wide range of modern engineering and technological fields.",
                "active": 1
            }
        ]
    }*/
    const {subject_id, subject_name, description, subject_active, department} = subjectData?.data?.[0] ?? {};

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subject_name: "",
            description: "",
            department_id: [],
        }
    });

    const updateSubjectMutation = useUpdateSubject();

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
            if (pages * limits < total) {
                setDepartmentPage(cur => cur + 1)
            }
        }
    }, [listDepartment]);

    const onSubmit = useCallback((params) => {
        updateSubjectMutation.mutate({id: id, params}, {
            onSuccess: (response) => {
                const {returnCode} = response
                if (returnCode === 200) {
                    toast.success(
                        <div key={v4()}>
                            Update subject <b>{subject_name}</b> successfully
                        </div>
                    );
                    updateSubjectMutation.reset();
                    router.push(clientRoutes.subject.list.path);
                }
            },
            onError: (error) => {
                const {returnMessage} = error;
                toast.error(returnMessage);
            }
        });
    }, [id]);

    useEffect(() => form.setValue("subject_name", subject_name), [subject_name]);
    useEffect(() => form.setValue("description", description), [description]);
    useEffect(() =>
            form.setValue("department_id", department?.map(item => item.department_id) || []),
        [department]
    );

    return (
        <MainLayout>
            <div className={cn("flex justify-center items-center min-h-full")}>
                <Card className={cn("w-full max-w-[600px] py-5")}>
                    <CardHeader>
                        <CardTitle>Update User</CardTitle>
                        <CardDescription>Update User</CardDescription>
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
                                    disabled={updateSubjectMutation.isPending}
                                    variant="outline"
                                    type="reset"
                                    onClick={() => router.push(clientRoutes.subject.list.path)}
                                >
                                    Cancel
                                </Button>
                                <Button disabled={updateSubjectMutation.isPending} type="submit">Submit</Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>
        </MainLayout>
    )
}

export default UpdateDepartment;