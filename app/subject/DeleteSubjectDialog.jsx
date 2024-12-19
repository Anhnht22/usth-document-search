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
import {useDeletePermanentlySubject} from "@/hook/useSubject";

const DeleteSubjectDialog = ({selectedItem, isOpen, onOpenChange}) => {
    const {subject_active: active, department, subject_id: id, subject_name} = selectedItem || {};

    const deleteSubjectMutation = useDeletePermanentlySubject();

    const deletePermanentlyUser = (id) => {
        deleteSubjectMutation.mutate(id, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success(
                    <div key={v4()}>
                        Delete permanently user <b>{subject_name}</b> successfully
                    </div>
                );
                deleteSubjectMutation.reset();
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
                        Delete Permanently
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete permanently {subject_name}?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button
                        disabled={deleteSubjectMutation.isPending}
                        onClick={() => deletePermanentlyUser(id)}
                    >
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteSubjectDialog;