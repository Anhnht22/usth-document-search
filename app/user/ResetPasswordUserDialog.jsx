import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {useCallback, useMemo, useState} from "react";
import {toast} from "react-toastify";
import {v4} from "uuid";
import {useUpdatePasswordUser} from "@/hook/useUsers";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {EyeIcon, EyeOffIcon} from "lucide-react";

const formSchema = z.object({
    password: z.string().min(1, {
        message: "Password is required!",
    }),
    re_password: z.string().min(1, {
        message: "Confirm Password is required!",
    }),
}).refine((data) => data.password === data.re_password, {
    message: "Passwords don't match",
    path: ["re_password"], // path of error
});

const UpdatePasswordUserDialog = ({selectedItem, isOpen, onOpenChange}) => {
    const {active, email, password, role_id, user_id, username} = useMemo(() => selectedItem || {}, [selectedItem]);

    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            re_password: "",
        }
    });

    const updatePasswordUserMutation = useUpdatePasswordUser();

    const onSubmit = useCallback((params) => {
        const reqParams = {
            id: user_id,
            params: params
        };

        updatePasswordUserMutation.mutate(reqParams, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success(
                    <div key={v4()}>
                        Update password <b>{username}</b> successfully
                    </div>
                );
                updatePasswordUserMutation.reset();
                form.reset();
            },
            onError: (error) => {
                const {returnMessage} = error;
                toast.error(returnMessage);
            }
        });
    }, [user_id, username])

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {active ? "Deactivate" : "Activate"}
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to {active ? "deactivate" : "activate"}
                        <span className={cn("font-bold")}> {username}</span>?
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className={cn("space-y-4")}>
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
                            <FormField
                                control={form.control}
                                name="re_password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className={cn("font-bold text-black")}>
                                            Password confirm
                                            <span className="text-red-500"> *</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className={cn("relative")}>
                                                <Input type={showRePassword ? "text" : "password"}
                                                       placeholder="••••••••" {...field}/>
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                    onClick={() => setShowRePassword(!showRePassword)}
                                                >
                                                    {showRePassword ? (
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
                        </div>
                        <DialogFooter className={cn("mt-4")}>
                            <Button variant="outline" type="reset" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={updatePasswordUserMutation.isPending}
                            >
                                Submit
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdatePasswordUserDialog;