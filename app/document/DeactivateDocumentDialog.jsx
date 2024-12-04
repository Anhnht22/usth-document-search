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
import {useEffect, useMemo} from "react";
import {toast} from "react-toastify";
import {v4} from "uuid";
import {useUpdateDocument} from "@/hook/useDocument";

const DeactivateUserDialog = ({selectedItem, isOpen, onOpenChange}) => {
    const {document_active, document_id, title} = useMemo(() => selectedItem || {}, [selectedItem]);

    const updateDocumentMutation = useUpdateDocument();

    const updateDepartment = (id, updateItem, params) => {
        const {title, topic_id, description} = updateItem;

        const reqParams = {
            id: id,
            params: {
                topic_id: topic_id,
                title: title,
                description: description,
                ...params
            }
        }
        updateDocumentMutation.mutate(reqParams, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success(
                    <div key={v4()}>
                        Update document <b>{title}</b> successfully
                    </div>
                );
                updateDocumentMutation.reset();
            },
            onError: (error) => {
                const {returnMessage} = error;
                toast.error(returnMessage);
            }
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {document_active ? "Deactivate" : "Activate"}
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to {document_active ? "deactivate" : "activate"}
                        <span className={cn("font-bold")}> {title}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        disabled={updateDocumentMutation.isPending}
                        onClick={() => updateDepartment(document_id, selectedItem, {active: document_active ? 0 : 1})}
                    >
                        Apply
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeactivateUserDialog;