import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, cn, configure } from "@/lib/utils";
import { fetchProjectById } from "@/redux/Slice/projectSlice";
import { LoaderCircle, Plus, CircleCheckBig } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createTask, fetchTasks } from "@/redux/Slice/taskSlice";
import TaskCard from "@/components/TaskCard";
import TaskList from "@/components/TaskList";

const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "in-progress", "completed"]),
  assignedTo: z.string().min(1, { message: "Assigned to is required" }),
});

export default function ProjectDetailPage() {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  const {
    auth: { user },
    project: { projects },
    task: { tasks, loading },
  } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchProjectById({ projectId, token: user.token }));
    dispatch(fetchTasks({ projectId, token: user.token }));
  }, []);

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      assignedTo: "",
    },
  });

  const onSubmit = (values) => {
    dispatch(createTask({ taskDetails: values, projectId, token: user.token }));
    toast.success("Task assigned successfully", {
      icon: <CircleCheckBig />,
      style: { backgroundColor: "#4caf50", color: "#fff" },
    });
    form.reset();
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const config = configure(user?.token);
    const getMembers = setTimeout(async () => {
      if (!search) return;
      try {
        const { data } = await axios.get(
          `${backend_url}/auth?search=${search}`,
          config
        );
        setMembers(data);
      } catch (err) {
        console.error("Failed to search users", err);
      }
    }, 500);

    return () => clearTimeout(getMembers);
  }, [search, members]);


  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[50vh]">
  //       <LoaderCircle className="animate-spin size-10" />
  //     </div>
  //   );
  // }

  if (!projects) {
    return (
      <div className="text-center py-10 text-gray-500">
        Project not found or failed to load.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-xl font-bold">{projects.name}</h1>
          <p className="text-gray-500">{projects.description}</p>
        </div>

        {user._id === projects?.createdBy?._id && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                <Plus className="mr-2" />
                Assign Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign New Task</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Task title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Task description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="assignedTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assign To</FormLabel>
                        <Popover
                          open={isPopoverOpen}
                          onOpenChange={setIsPopoverOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between"
                              >
                                {members.find(
                                  (member) => member._id === field.value
                                )?.name ?? "Search user..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="">
                            <Command>
                              <Input
                                type="text"
                                onChange={(e) => setSearch(e.target.value)}
                                value={search}
                                icon="search"
                              />
                              <CommandList>
                                <CommandEmpty>No users found.</CommandEmpty>
                                <CommandGroup>
                                  {members.map((member) => (
                                    <CommandItem
                                      key={member._id}
                                      value={member._id}
                                      onSelect={() => {
                                        form.setValue("assignedTo", member._id);
                                        setIsPopoverOpen(false);
                                        setSearch("");
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === member._id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {member.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4 w-full">
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl className="w-full">
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl className="w-full">
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit">Create Task</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <TaskList projects={projects} />
    </div>
  );
}
