"use client"

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useCreateDepartment} from "@/hook/useDepartments";
import {useAuth} from "@/provider/AuthProvider";
import MainLayout from "@/components/commons/MainLayout";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {useRouter} from "next/navigation";
import clientRoutes from "@/routes/client";
import {Textarea} from "@/components/ui/textarea";

const formSchema = z.object({
    department_name: z.string().min(1, {
        message: "Name is required!",
    }),
    description: z.string().min(1, {
        message: "Description is required!",
    }),
})

const CreateDepartment = () => {
    const router = useRouter();

    const {role} = useAuth();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            department_name: "",
            description: ""
        }
    });

    const {mutate: createDepartment, isPending} = useCreateDepartment();

    const onSubmit = async (params) => {
        createDepartment(params, {
            onSuccess: (response) => {
                const {returnMessage} = response;

                form.reset();
                toast.success(returnMessage);
                router.push(clientRoutes.department.list.path);
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
                <Card className={cn("w-full max-w-[500px] py-5")}>
                    <CardHeader>
                        <CardTitle>Create Department</CardTitle>
                        <CardDescription>Create Department</CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className={cn("space-y-4")}>
                                <FormField
                                    control={form.control}
                                    name="department_name"
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
                            </CardContent>
                            <CardFooter className="flex justify-center gap-3">
                                <Button
                                    disabled={isPending}
                                    variant="outline"
                                    type="reset"
                                    onClick={() => router.push(clientRoutes.department.list.path)}
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

export default CreateDepartment;