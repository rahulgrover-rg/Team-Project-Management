import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Loader } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAvatarColor, getAvatarFallbackText, transformOptions } from "@/lib/helper";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { TaskPriorityEnum, TaskStatusEnum } from "@/constant";
import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-projects";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editTaskMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { TaskType } from "@/types/api.type";

interface EditTaskFormProps {
  task: TaskType;
  onClose: () => void;
  onSuccess: ()=> void;
}

const formSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required" }),
  description: z.string().trim(),
  projectId: z.string().trim().min(1, { message: "Project is required" }),
  status: z.nativeEnum(TaskStatusEnum, {
    required_error: "Status is required",
  }),
  priority: z.nativeEnum(TaskPriorityEnum, {
    required_error: "Priority is required",
  }),
  assignedTo: z.string().trim().min(1, { message: "AssignedTo is required" }),
  dueDate: z.date({
    required_error: "A due date is required",
  }),
});

const EditTaskForm = ({ task, onClose, onSuccess }: EditTaskFormProps) => {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useMutation({
    mutationFn: editTaskMutationFn,
  });

  const { data: projectData } = useGetProjectsInWorkspaceQuery({
    workspaceId,
  });

  const { data: memberData } = useGetWorkspaceMembers(workspaceId);

  const projects = projectData?.projects || [];
  const members = memberData?.members || [];

  const projectOptions = projects.map((project) => ({
    label: (
      <div className="flex items-center gap-1">
        <span>{project.emoji}</span>
        <span>{project.name}</span>
      </div>
    ),
    value: project._id,
  }));

  const membersOptions = members.map((member) => {
    const name = member.userId?.name || "Unknown";
    const initials = getAvatarFallbackText(name);
    const avatarColor = getAvatarColor(name);

    return {
      label: (
        <div className="flex items-center space-x-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={member.userId.profilePicture || ""} alt={name} />
            <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
          </Avatar>
          <span>{name}</span>
        </div>
      ),
      value: member.userId._id,
    };
  });

  const taskStatusList = Object.values(TaskStatusEnum);
  const taskPriorityList = Object.values(TaskPriorityEnum);

  const statusOptions = transformOptions(taskStatusList);
  const priorityOptions = transformOptions(taskPriorityList);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      projectId: "",
      status: TaskStatusEnum.TODO,
      priority: TaskPriorityEnum.LOW,
      assignedTo: "",
      dueDate: new Date(),
    },
  });

  useEffect(() => {
    if (task) {
      form.setValue("title", task.title);
      form.setValue("description", task.description || "");
      form.setValue("projectId", task.project?._id as string);
      form.setValue("status", task.status);
      form.setValue("priority", task.priority);
      form.setValue("assignedTo", task.assignedTo?._id as string);
      form.setValue("dueDate", new Date(task.dueDate));
    }
  }, [task, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;
  
    const payload = {
      taskId: task?._id as string,
      projectId: values.projectId,
      workspaceId,
      data: {
        ...values,
        dueDate: values.dueDate.toISOString(),
      },
    };
  
    mutate(payload, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ["project-analytics", values.projectId], 
        });
        queryClient.invalidateQueries({
          queryKey: ["all-tasks", workspaceId],
        });
        toast({
          title: "Success",
          description: data.message || "Task updated successfully",
          variant: "success",
        });
        onClose();
        onSuccess();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to update task",
          variant: "destructive",
        });
      },
    });
  };
  

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Project */}
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projectOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        
        {/* Assigned To */}
        <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned To</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an assignee" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {membersOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Due Date */}
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <Input
                type="date"
                value={field.value ? format(field.value, "PPP") : ""}
                onChange={(e) =>
                  field.onChange(e.target.value ? new Date(e.target.value) : null)
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Priority */}
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        

        {/* Submit */}
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader className="animate-spin"/>}
          Update Task
        </Button>
      </form>
    </Form>
  );
};

export default EditTaskForm;
