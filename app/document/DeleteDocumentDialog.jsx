import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {toast} from "react-toastify";
import {v4} from "uuid";
import {useDeletePermanentlyDocument} from "@/hook/useDocument";

const DeleteUserDialog = ({selectedItem, isOpen, onOpenChange}) => {
    const {document_active, document_id, title} = selectedItem || {};

    const deletePermanentlDocumentMutation = useDeletePermanentlyDocument();

    const deletePermanentlyUser = (id) => {
        deletePermanentlDocumentMutation.mutate(id, {
                onSuccess: (response) => {
                    const {returnCode} = response
                    if (returnCode === 200) {
                        onOpenChange(false);
                        toast.success(
                            <div key={v4()}>
                                Delete permanently user <b>{title}</b> successfully
                            </div>
                        );
                        deletePermanentlDocumentMutation.reset();
                    }
                },
                onError: (error) => {
                    const {returnMessage} = error;
                    toast.error(returnMessage);
                }
            }
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Delete Permanently
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete permanently <b>{title}</b>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button
                        disabled={deletePermanentlDocumentMutation.isPending}
                        onClick={() => deletePermanentlyUser(document_id)}
                    >
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteUserDialog;