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
import {useState} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {useCreateDepartment} from "@/hook/useDepartments";
import {toast} from "react-toastify";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const formSchema = z.object({
    department_name: z.string().min(1, {
        message: "Name is required!",
    }),
    description: z.string().min(1, {
        message: "Description is required!",
    }),
})

const CreateDepartmentDialog = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            department_name: "",
            description: ""
        }
    });

    const {mutate: createDepartment, isPending} = useCreateDepartment();

    const [isOpen, setIsOpen] = useState(false);

    const onSubmit = async (params) => {
        createDepartment(params, {
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create</DialogTitle>
                    <DialogDescription>
                        Create new department
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
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
                                            <Input placeholder="Description" {...field} />
                                        </FormControl>
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

export default CreateDepartmentDialog;