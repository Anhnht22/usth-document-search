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
import {useEffect, useMemo} from "react";
import {toast} from "react-toastify";
import {v4} from "uuid";

const DeactivateConfirmDialog = ({department, isOpen, onOpenChange}) => {
    const {department_id, department_name, active} = useMemo(() => department || {}, [department]);

    const updateDepartmentMutation = useUpdateDepartment();

    const updateDepartment = (id, updateItem, params) => {
        const {department_name, description, active} = updateItem || {};

        updateDepartmentMutation.mutate({
            id: id,
            params: {
                department_name: department_name,
                description: description,
                active: active,
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
                        Update department <b>{department_name}</b> successfully
                    </div>
                );
                updateDepartmentMutation.reset();
            }
        }
    }, [updateDepartmentMutation.data, department_name]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {active ? "Deactivate" : "Activate"}
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to {active ? "deactivate" : "activate"}
                        <span className={cn("font-bold")}> {department_name}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button
                        disabled={updateDepartmentMutation.isPending}
                        onClick={() => updateDepartment(department_id, department, {active: active ? 0 : 1})}
                    >
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeactivateConfirmDialog;