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
import {useUpdateUser} from "@/hook/useUsers";

const DeactivateUserDialog = ({selectedItem, isOpen, onOpenChange}) => {
    const {active, email, password, role_id, user_id, username} = useMemo(() => selectedItem || {}, [selectedItem]);

    const updateDepartmentMutation = useUpdateUser();

    const updateDepartment = (id, updateItem, params) => {
        updateDepartmentMutation.mutate({
            id: id,
            params: {
                ...updateItem,
                ...params,
            }
        });
    }

    useEffect(() => {
        if (updateDepartmentMutation.data) {
            const {returnCode} = updateDepartmentMutation.data
            if (returnCode === 200) {
                onOpenChange(false);
                toast.success(
                    <div key={v4()}>
                        Update department <b>{username}</b> successfully
                    </div>
                );
                updateDepartmentMutation.reset();
            }
        }
    }, [updateDepartmentMutation.data, username]);

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
                <DialogFooter>
                    <Button variant="outline" onClick={() => onChange(false)}>
                        Hủy
                    </Button>
                    <Button
                        disabled={updateDepartmentMutation.isPending}
                        onClick={() => updateDepartment(user_id, selectedItem, {active: active ? 0 : 1})}
                    >
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeactivateUserDialog;