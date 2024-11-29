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
import {useUpdateDepartment} from "@/hook/useDepartments";
import {useEffect} from "react";
import {toast} from "react-toastify";
import {v4} from "uuid";

const DeactivateConfirmDialog = ({department, isOpen, onOpenChange}) => {
    const updateDepartmentMutation = useUpdateDepartment();

    const updateDepartment = (id, updateItem, params) => {
        updateDepartmentMutation.mutate({
            id: id,
            params: {
                department_name: updateItem?.department_name,
                description: updateItem?.description,
                active: updateItem?.active,
                ...params,
            }
        });
    }

    useEffect(() => {
        const {department_name} = department || {};

        if (updateDepartmentMutation.data) {
            const {returnCode} = updateDepartmentMutation.data
            if (returnCode === 200) {
                onOpenChange(false);
                toast.success(
                    <div key={v4()}>
                        Update department <b>{department_name}</b> successfully
                    </div>
                );
                updateDepartmentMutation.reset();
            }
        }
    }, [updateDepartmentMutation.data, department]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {department?.active ? "Deactivate" : "Activate"}
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to {department?.active ? "deactivate" : "activate"}
                        <span className={cn("font-extrabold")}> {department?.department_name}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onChange(false)}>
                        Hủy
                    </Button>
                    <Button
                        disabled={updateDepartmentMutation.isPending}
                        onClick={() => updateDepartment(department_id, department, {active: department?.active ? 0 : 1})}
                    >
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeactivateConfirmDialog;