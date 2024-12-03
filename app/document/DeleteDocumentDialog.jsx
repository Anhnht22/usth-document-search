import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useEffect} from "react";
import {toast} from "react-toastify";
import {v4} from "uuid";
import {useDeletePermanentlyUser} from "@/hook/useUsers";
import {useDeletePermanentlyDocument} from "@/hook/useDocument";

const DeleteUserDialog = ({selectedItem, isOpen, onOpenChange}) => {
    const {document_active, document_id, title} = selectedItem || {};

    const deletePermanentlDocumentMutation = useDeletePermanentlyDocument();

    const deletePermanentlyUser = (id) => {
        deletePermanentlDocumentMutation.mutate(id);
    }

    useEffect(() => {
        if (deletePermanentlDocumentMutation.data) {
            const {returnCode} = deletePermanentlDocumentMutation.data
            if (returnCode === 200) {
                onOpenChange(false);
                toast.success(
                    <div key={v4()}>
                        Delete permanently user <b>{title}</b> successfully
                    </div>
                );
                deletePermanentlDocumentMutation.reset();
            }
        }
    }, [deletePermanentlDocumentMutation.data, title]);

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