import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {listDocumentStatus} from "@/utils/common";
import {cn} from "@/lib/utils";
import {useUpdateDocument} from "@/hook/useDocument";
import {useCallback, useRef, useState} from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {z} from "zod";
import {Textarea} from "@/components/ui/textarea";
import {toast} from "react-toastify";

const formSchema = z.object({
    reason: z.string().min(1, {
        message: "Reason is required!",
    }),
})

const StatusDocumentUpdate = ({selectedItem}) => {
    const {document_id, status} = selectedItem;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            reason: "",
        }
    });

    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

    const updateDataRef = useRef({});

    const updateDocumentMutation = useUpdateDocument();

    const updatePreCheck = ({id, updateItem, status}) => {
        updateDataRef.current = {id, updateItem, status};
        if (status === listDocumentStatus.REJECTED.key) {
            setIsUpdateDialogOpen(true);
        } else {
            updateStatusDepartment();
        }
    }

    const updateStatusDepartment = () => {
        const {id, updateItem, status, reason} = updateDataRef.current;
        const {title, topic_id, description} = updateItem;
        const params = {
            topic_id: topic_id,
            title: title,
            description: description,
            status: status
        };

        if (reason) params.reason = reason;

        const reqParams = {id: id, params: params};
        updateDocumentMutation.mutate(reqParams, {
            onSuccess: () => {
                setIsUpdateDialogOpen(false);
                updateDocumentMutation.reset();
                form.reset();
            },
            onError: (error) => {
                const {returnMessage} = error;
                toast.error(returnMessage);
            }
        });
    }

    const onSubmit = useCallback((params) => {
        if (selectedItem) {
            updateDataRef.current.reason = params.reason;
            updateStatusDepartment();
        }
    }, [selectedItem])

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-[80px] p-0 focus-visible:ring-0">
                        <div
                            style={{backgroundColor: listDocumentStatus[status.toUpperCase()].color}}
                            className={cn(
                                "hover:cursor-pointer w-full text-center shadow-xl",
                                "p-2 rounded-full text-white text-[10px] leading-none"
                            )}
                        >{status}</div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                    {Object.values(listDocumentStatus).map(value => value.key !== status.toUpperCase() &&
                        (
                            <DropdownMenuItem
                                key={value.key}
                                className={cn("hover:cursor-pointer justify-center hover:bg-gray-200")}
                                onClick={() => {
                                    updatePreCheck({
                                        id: document_id,
                                        updateItem: selectedItem,
                                        status: value.key
                                    })
                                }}
                            >
                                <div style={{backgroundColor: value.color}}
                                     className={cn(
                                         "w-[90px] text-center rounded-full",
                                         "p-2 text-white text-[10px] leading-none"
                                     )}
                                >
                                    {value.key}
                                </div>
                            </DropdownMenuItem>
                        )
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogContent className="sm:max-w-[525px] overflow-y-auto max-h-screen">
                    <DialogHeader>
                        <DialogTitle>Reject document</DialogTitle>
                        <DialogDescription>
                            Why reject document upload?
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="reason"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className={cn("font-bold text-black")}>
                                                    Reason <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Reason" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className={cn("flex justify-end")}>
                                    <Button disabled={updateDocumentMutation.isPending} type="submit">
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default StatusDocumentUpdate;