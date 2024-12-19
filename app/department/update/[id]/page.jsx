"use client"

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useDepartments, useUpdateDepartment} from "@/hook/useDepartments";
import {useAuth} from "@/provider/AuthProvider";
import MainLayout from "@/components/commons/MainLayout";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import clientRoutes from "@/routes/client";
import {useCallback, useEffect} from "react";
import {v4} from "uuid";
import {useParams, useRouter} from "next/navigation";
import {Switch} from "@/components/ui/switch";
import {Textarea} from "@/components/ui/textarea";

const formSchema = z.object({
    department_name: z.string().min(1, {
        message: "Department name is required!",
    }),
    description: z.string().min(1, {
        message: "Description is required!", // Kiểm tra giá trị rỗng
    }),
    active: z.number()
});

const UpdateDepartment = () => {
    const {role} = useAuth();

    const router = useRouter();
    const params = useParams();

    const {id} = params;

    const {data: departmentData} = useDepartments({department_id: id})

    /*{
        "department_id": 69,
        "department_name": "Language Center",
        "description": "Offers language courses to support students in improving their communication skills, especially in English.",
        "active": 1
    }*/
    const {department_id, department_name, description, active} = departmentData?.data?.[0] ?? {};

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            department_name: "",
            description: "",
            active: 0
        }
    });

    const updateDepartmentMutation = useUpdateDepartment();

    const onSubmit = useCallback((params) => {
        updateDepartmentMutation.mutate({id: id, params}, {
            onSuccess: (response) => {
                const {returnCode} = response
                if (returnCode === 200) {
                    toast.success(
                        <div key={v4()}>
                            Update department <b>{department_name}</b> successfully
                        </div>
                    );
                    updateDepartmentMutation.reset();
                    router.push(clientRoutes.department.list.path);
                }
            },
            onError: (error) => {
                const {returnMessage} = error;
                toast.error(returnMessage);
            }
        });
    }, [id]);

    useEffect(() => form.setValue("department_name", department_name), [department_name]);
    useEffect(() => form.setValue("description", description), [description]);
    useEffect(() => form.setValue("active", active), [active]);

    return (
        <MainLayout>
            <div className={cn("flex justify-center items-center min-h-full")}>
                <Card className={cn("w-full max-w-[500px] py-5")}>
                    <CardHeader>
                        <CardTitle>Update Department</CardTitle>
                        <CardDescription>Update Department</CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className={cn("space-y-4")}>
                                <FormField
                                    control={form.control}
                                    name="department_name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("font-bold")}>
                                                Name <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Name" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("font-bold")}>
                                                Description <span className="text-red-500"> *</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Description..." {...field}/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="active"
                                    render={({field}) => (
                                        <FormItem
                                            className="">
                                            <div className="">
                                                <FormLabel>Active</FormLabel>
                                            </div>
                                            <div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value === 1}
                                                        onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                                                        aria-readonly
                                                    />
                                                </FormControl>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter className="flex justify-center gap-3">
                                <Button
                                    disabled={updateDepartmentMutation.isPending}
                                    variant="outline"
                                    type="reset"
                                    onClick={() => router.push(clientRoutes.department.list.path)}
                                >
                                    Cancel
                                </Button>
                                <Button disabled={updateDepartmentMutation.isPending} type="submit">Submit</Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>
        </MainLayout>
    )
}

export default UpdateDepartment;