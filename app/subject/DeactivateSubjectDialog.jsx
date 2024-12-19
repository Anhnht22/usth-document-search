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
import {useMemo} from "react";
import {toast} from "react-toastify";
import {v4} from "uuid";
import {useUpdateSubject} from "@/hook/useSubject";

const DeactivateSubjectDialog = ({selectedItem, isOpen, onOpenChange}) => {
    const {
        subject_name,
        subject_id,
        subject_active: active
    } = useMemo(() => selectedItem || {}, [selectedItem]);

    const updateSubjectMutation = useUpdateSubject();

    const updateSubject = (id, updateItem, params) => {
        const reqParams = {
            id: id,
            params: {
                subject_name: updateItem.subject_name,
                ...params
            }
        };

        updateSubjectMutation.mutate(reqParams, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success(
                    <div key={v4()}>
                        Update subject <b>{subject_name}</b> successfully
                    </div>
                );
                updateSubjectMutation.reset();
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
                        {active ? "Deactivate" : "Activate"}
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to {active ? "deactivate" : "activate"}
                        <span className={cn("font-bold")}> {subject_name}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button
                        disabled={updateSubjectMutation.isPending}
                        onClick={() => updateSubject(subject_id, selectedItem, {active: active ? 0 : 1})}
                    >
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeactivateSubjectDialog;