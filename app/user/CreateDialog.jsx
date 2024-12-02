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
import {EyeIcon, EyeOffIcon, Plus} from "lucide-react";
import {useMemo, useState} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import {useUser} from "@/hook/useUsers";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Switch} from "@/components/ui/switch";
import {MultiSelect} from "@/components/ui/multi-select";
import {useRole} from "@/hook/useRole";

const formSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required!",
    }),
    password: z.string().min(1, {
        message: "Password is required!",
    }),
    email: z.string().min(1, {
        message: "Email is required!", // Kiểm tra giá trị rỗng
    }).email({
        message: "Invalid email address!", // Kiểm tra định dạng email
    }),
    active: z.boolean(),
    role_id: z.number().min(1, {
        message: "Role is required!",
    }),
})

const CreateDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            email: "",
            active: 1,
            role_id: 3,
        }
    });

    const {mutate: createUser, isPending} = useUser();
    const {data: listRole} = useRole();

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

    const listRoleOptions = useMemo(
        () => listRole?.map(({role_id, role_name}) => ({
            value: role_id,
            label: role_name
        })) ?? [],
        [listRole]
    );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><Plus/> Create</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create</DialogTitle>
                    <DialogDescription>
                        Create new user
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className={cn("col-span-full")}>
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
                                </div>
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
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("font-bold text-black")}>
                                                Password
                                                <span className="text-red-500"> *</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className={cn("relative")}>
                                                    <Input type={showPassword ? "text" : "password"}
                                                           placeholder="••••••••" {...field}/>
                                                    <button
                                                        type="button"
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOffIcon className="h-4 w-4 text-gray-500"/>
                                                        ) : (
                                                            <EyeIcon className="h-4 w-4 text-gray-500"/>
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <div className={cn("flex items-end")}>
                                    <FormField
                                        control={form.control}
                                        name="active"
                                        render={({field}) => (
                                            <FormItem
                                                className={cn(
                                                    "flex flex-row items-center justify-between",
                                                    "px-3 py-1 w-full"
                                                )}
                                            >
                                                <div className="">
                                                    <FormLabel>Active</FormLabel>
                                                </div>
                                                <div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            aria-readonly
                                                        />
                                                    </FormControl>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="role_id"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("font-bold")}>Status</FormLabel>
                                            <MultiSelect
                                                isMultiple={false}
                                                isClearable={false}
                                                options={listRoleOptions}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                placeholder="Select role"
                                            />
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

export default CreateDialog;