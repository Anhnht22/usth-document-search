import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useDeletePermanentlyDepartment} from "@/hook/useDepartments";
import {useEffect} from "react";
import {toast} from "react-toastify";
import {v4} from "uuid";

const DeleteDepartmentDialog = ({department, isOpen, onOpenChange}) => {
    const {department_id, department_name} = department || {};

    const deletePermanentlyDepartmentMutation = useDeletePermanentlyDepartment();

    const deletePermanentlyDepartment = (id) => {
        deletePermanentlyDepartmentMutation.mutate(id);
    }

    useEffect(() => {
        if (deletePermanentlyDepartmentMutation.data) {
            const {returnCode} = deletePermanentlyDepartmentMutation.data
            if (returnCode === 200) {
                onOpenChange(false);
                toast.success(
                    <div key={v4()}>
                        Delete permanently department <b>{department_name}</b> successfully
                    </div>
                );
                deletePermanentlyDepartmentMutation.reset();
            }
        }
    }, [deletePermanentlyDepartmentMutation.data, department_name]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Delete Permanently
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete permanently {department_name}?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button
                        disabled={deletePermanentlyDepartmentMutation.isPending}
                        onClick={() => deletePermanentlyDepartment(department_id)}
                    >
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteDepartmentDialog;