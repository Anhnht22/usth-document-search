"use client"

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useForm, useWatch} from "react-hook-form";
import {toast} from "react-toastify";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useDepartments} from "@/hook/useDepartments";
import {useAuth} from "@/provider/AuthProvider";
import MainLayout from "@/components/commons/MainLayout";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import clientRoutes from "@/routes/client";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useUpdateUser, useUser} from "@/hook/useUsers";
import {useRole} from "@/hook/useRole";
import {MultiSelect} from "@/components/ui/multi-select";
import {rolesType} from "@/roles/constants";
import {v4} from "uuid";
import {useParams, useRouter} from "next/navigation";

const formSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required!",
    }),
    email: z.string().min(1, {
        message: "Email is required!", // Kiểm tra giá trị rỗng
    }).email({
        message: "Invalid email address!", // Kiểm tra định dạng email
    }),
    active: z.number(),
    role_id: z.number().min(1, {
        message: "Role is required!",
    }),
    department_ids: z.array(z.number()).min(1, {
        message: "Department is required!",
    }),
});

const UpdateDepartment = () => {
    const {role} = useAuth();

    const router = useRouter();
    const params = useParams();

    const {id} = params;

    const {data: userData, ...fetchUser} = useUser({user_id: id})

    /*{
        "user_id": 44,
        "username": "admin2",
        "email": "test@gmail.com",
        "active": 1,
        "role_name": "professor",
        "role_id": 2,
        "department": [
            {
                "user_id": 44,
                "department_id": 245,
                "department_name": "Language Center"
            }
        ]
    }*/
    const {email, username, role_id, active, department} = userData?.data?.[0] ?? {};

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            username: "",
            active: true,
            role_id: 0,
            department_ids: [],
        }
    });
    const userRoleId = useWatch({control: form.control, name: "role_id"});

    const updateUserMutation = useUpdateUser();

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

    const {data: listRole} = useRole({
        active: 1,
        limit: -999
    });
    const listRoleOptions = useMemo(
        () => listRole?.data?.map(({role_id, role_name}) => ({
            value: role_id,
            label: role_name
        })) ?? [],
        [listRole]
    );

    const onSubmit = useCallback((params) => {
        updateUserMutation.mutate({id: id, params}, {
            onSuccess: (response) => {
                const {returnCode} = response
                if (returnCode === 200) {
                    toast.success(
                        <div key={v4()}>
                            Update user <b>{username}</b> successfully
                        </div>
                    );
                    updateUserMutation.reset();
                    router.push(clientRoutes.user.list.path);
                }
            },
            onError: (error) => {
                const {returnMessage} = error;
                toast.error(returnMessage);
            }
        });
    }, [id]);

    useEffect(() => form.setValue("email", email), [email]);
    useEffect(() => form.setValue("username", username), [username]);
    useEffect(() => form.setValue("role_id", role_id), [role_id]);
    useEffect(() => form.setValue("active", active), [active]);
    useEffect(() =>
            form.setValue("department_ids", department?.map(item => item.department_id) || []),
        [department]
    );

    // if (fetchUser.isLoading) return <div>Loading...</div>

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
                            <CardContent className={cn("grid grid-cols-2 gap-4")}>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("font-bold text-black")}>
                                                Email <span className="text-red-500"> *</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Email" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="role_id"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("font-bold text-black")}>
                                                Role <span className="text-red-500"> *</span>
                                            </FormLabel>
                                            <MultiSelect
                                                isMultiple={false}
                                                isClearable={false}
                                                options={listRoleOptions}
                                                onValueChange={(value) => field.onChange(value[0])}
                                                value={field.value === 0 ? [] : [field.value]}
                                                placeholder="Select role"
                                            />
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("font-bold text-black")}>
                                                Username <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Username" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="department_ids"
                                    render={({field}) => (
                                        <FormItem className={cn("col-span-full")}>
                                            <FormLabel className={cn("font-bold text-black")}>
                                                Department <span className="text-red-500"> *</span>
                                            </FormLabel>
                                            <MultiSelect
                                                isMultiple={
                                                    listRoleOptions.find(item => item.value === userRoleId)?.label !== rolesType.student
                                                }
                                                options={listDepartmentOptions}
                                                loadMore={setPageChange}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                defaultValue={field.value}
                                                placeholder="Select department"
                                            />
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter className="flex justify-center gap-3">
                                <Button
                                    disabled={updateUserMutation.isPending}
                                    variant="outline"
                                    type="reset"
                                    onClick={() => router.push(clientRoutes.user.list.path)}
                                >
                                    Cancel
                                </Button>
                                <Button disabled={updateUserMutation.isPending} type="submit">Submit</Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>
        </MainLayout>
    )
}

export default UpdateDepartment;