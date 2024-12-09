import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {CircleCheck, Plus} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {CommandItem} from "@/components/ui/command";
import * as React from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "react-toastify";
import {useCreateKeyword} from "@/hook/useKeyword";

const formSchemaKeyword = z.object({
    keyword: z.string().min(1, {
        message: "Keyword is required!",
    }),
})

const CreateKeywordDocument = ({onCreate}) => {
    const formKeyword = useForm({
        resolver: zodResolver(formSchemaKeyword),
        defaultValues: {
            keyword: "",
        }
    });

    const {mutate: createKeyword, isPending} = useCreateKeyword();

    const onSubmitKeyword = (params) => {
        createKeyword(params, {
            onSuccess: (response) => {
                const {returnMessage, data} = response;
                formKeyword.reset();
                toast.success(returnMessage);
                // setIsOpen(false);
                if (onCreate) onCreate(data)
            },
            onError: (error) => {
                const {returnMessage} = error;
                toast.error(returnMessage);
            },
        });
    };

    return (
        <CommandItem key="create" className="cursor-pointer">
            <Form {...formKeyword}>
                <form className={cn("w-full")}>
                    <FormField
                        control={formKeyword.control}
                        name="keyword"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <div
                                        className={cn("flex justify-center items-center")}>
                                        <Plus
                                            className={cn(
                                                "mr-2 h-4 w-4 shrink-0 opacity-50",
                                            )}
                                        />
                                        <Input
                                            className={cn(
                                                "border-0 shadow-none focus-visible:ring-0",
                                                "px-0 pr-3"
                                            )}
                                            placeholder="Title"
                                            {...field}
                                        />
                                        <Button
                                            onClick={formKeyword.handleSubmit(onSubmitKeyword)}
                                            className={cn("p-1.5 rounded-full h-fit")}
                                        >
                                            <CircleCheck/>
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage>{formKeyword.formState.errors?.keyword?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </CommandItem>
    )
}

export default CreateKeywordDocument;
