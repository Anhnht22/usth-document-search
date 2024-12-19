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
import {useDeletePermanentlyTopic} from "@/hook/useTopic";

const DeleteTopicDialog = ({selectedItem, isOpen, onOpenChange}) => {
    const {
        topic_id,
        topic_name,
        topic_active,
        subject_name,
        subject_id
    } = selectedItem || {};

    const deleteTopicMutation = useDeletePermanentlyTopic();

    const deleteTopic = (id) => {
        deleteTopicMutation.mutate(id, {
                onSuccess: (response) => {
                    const {returnCode} = response
                    if (returnCode === 200) {
                        onOpenChange(false);
                        toast.success(
                            <div key={v4()}>
                                Delete permanently user <b>{topic_name}</b> successfully
                            </div>
                        );
                        deleteTopicMutation.reset();
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
                        Are you sure you want to delete permanently <b>{topic_name}</b>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button
                        disabled={deleteTopicMutation.isPending}
                        onClick={() => deleteTopic(topic_id)}
                    >
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteTopicDialog;