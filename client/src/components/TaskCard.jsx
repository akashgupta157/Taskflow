import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useDispatch, useSelector } from "react-redux";
import { updateTask } from "@/redux/Slice/taskSlice";
import Comment from "./Comment";

export default function TaskCard({ task }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleStatusChange = (value) => {
    dispatch(
      updateTask({ status: value, taskId: task._id, token: user.token })
    );
    setOpen(false);
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row justify-between items-start space-y-0">
          <div>
            <CardTitle className="text-lg">{task.title}</CardTitle>
            <CardDescription className="mt-1">
              Created{" "}
              {task.createdAt && (
                <>
                  {new Date(task.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </>
              )}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-2">
            <Badge
              className={`capitalize ${
                task.priority === "low"
                  ? "bg-green-500"
                  : task.priority === "medium"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              {task.priority}
            </Badge>
            <Badge
              className={`capitalize ${
                task.status === "completed"
                  ? "bg-green-500"
                  : task.status === "in-progress"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              {task.status}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">
              Assign to: <b>{task.assignedTo?.name}</b>
            </span>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    Task Details
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <p>
                    <b>Title:</b> {task.title}
                  </p>
                  <p>
                    <b>Description:</b> {task.description}
                  </p>
                  <p className="capitalize">
                    <b>Priority:</b> {task.priority}
                  </p>
                  <p className="capitalize">
                    <b>Status:</b> {task.status}
                  </p>
                  <p>
                    <b>Assigned To:</b> {task.assignedTo?.name} (
                    {task.assignedTo?.email})
                  </p>
                  {task.assignedTo?._id === user._id && (
                    <div>
                      <p className="font-semibold mb-1">Update Status:</p>
                      <Select
                        value={task.status}
                        onValueChange={handleStatusChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <Comment task={task} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
