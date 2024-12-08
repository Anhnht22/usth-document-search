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
import {useUpdateTopic} from "@/hook/useTopic";

const DeactivateTopicDialog = ({selectedItem, isOpen, onOpenChange}) => {
    const {
        topic_id,
        topic_name,
        topic_active,
        subject_name,
        subject_id
    } = useMemo(() => selectedItem || {}, [selectedItem]);

    const updateTopicMutation = useUpdateTopic();

    const updateDepartment = (id, updateItem, params) => {
        const reqParams = {
            id: id,
            params: {
                topic_name: topic_name,
                subject_id: subject_id,
                active: topic_active,
                ...params
            }
        };

        updateTopicMutation.mutate(reqParams, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success(
                    <div key={v4()}>
                        Update topic <b>{topic_name}</b> successfully
                    </div>
                );
                updateTopicMutation.reset();
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
                        {topic_active ? "Deactivate" : "Activate"}
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to {topic_active ? "deactivate" : "activate"}
                        <span className={cn("font-bold")}> {topic_name}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button
                        disabled={updateTopicMutation.isPending}
                        onClick={() => updateDepartment(topic_id, selectedItem, {active: topic_active ? 0 : 1})}
                    >
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeactivateTopicDialog;