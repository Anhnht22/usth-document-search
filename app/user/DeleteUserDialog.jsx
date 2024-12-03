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

const DeleteUserDialog = ({selectedItem, isOpen, onOpenChange}) => {
    const {active, email, password, role_id, user_id, username} = selectedItem || {};

    const deletePermanentlyUserMutation = useDeletePermanentlyUser();

    const deletePermanentlyUser = (id) => {
        deletePermanentlyUserMutation.mutate(id);
    }

    useEffect(() => {
        if (deletePermanentlyUserMutation.data) {
            const {returnCode} = deletePermanentlyUserMutation.data
            if (returnCode === 200) {
                onOpenChange(false);
                toast.success(
                    <div key={v4()}>
                        Delete permanently user <b>{username}</b> successfully
                    </div>
                );
                deletePermanentlyUserMutation.reset();
            }
        }
    }, [deletePermanentlyUserMutation.data, username]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Delete Permanently
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete permanently {username}?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button
                        disabled={deletePermanentlyUserMutation.isPending}
                        onClick={() => deletePermanentlyUser(user_id)}
                    >
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteUserDialog;