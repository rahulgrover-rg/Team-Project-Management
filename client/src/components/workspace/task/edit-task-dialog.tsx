// import { Edit3 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import EditTaskForm from "@/components/workspace/task/edit-task-form"; 
import { TaskType } from "@/types/api.type";

interface EditTaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    task: TaskType;
    onSuccess: () => void;
}

const EditTaskDialog = ({ task, isOpen, onClose, onSuccess }: EditTaskDialogProps) => {
  return (
    <div>
      <Dialog modal={true} open={isOpen} onOpenChange={(open) => !open && onClose()}>
        {/* <DialogTrigger asChild>
          <button>
            <Edit3 className="w-5 h-5" />
          </button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-lg border-0">
          <EditTaskForm task={task} onClose={onClose} onSuccess={onSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditTaskDialog;
