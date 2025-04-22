import React from "react";
import TaskCard from "./TaskCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { fetchTasks } from "@/redux/Slice/taskSlice";

export default function TaskList({ projects }) {
  const dispatch = useDispatch();
  const {
    auth: { user },
    task: { tasks, loading },
  } = useSelector((state) => state);
  const [onlyMyTasks, setOnlyMyTasks] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");

  useEffect(() => {
    dispatch(
      fetchTasks({
        projectId: projects._id,
        token: user.token,
        assignedTo: onlyMyTasks ? user._id : undefined,
        sortBy,
      })
    );
  }, [onlyMyTasks, sortBy]);

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <Switch
            checked={onlyMyTasks}
            onCheckedChange={(checked) => setOnlyMyTasks(checked)}
            id="only-my-tasks"
          />
          <Label htmlFor="only-my-tasks">Only My Tasks</Label>
        </div>
        <Select
          onValueChange={(value) => setSortBy(value)}
          defaultValue="createdAt"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="createdAt">Created At</SelectItem>
          </SelectContent>
        </Select>
      </div>
{/*       {loading && (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-gray-500">Loading...</p>
        </div>
      )} */}
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task, index) => (
            <TaskCard key={index} task={task} projects={projects} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-gray-500">No tasks found.</p>
        </div>
      )}
    </>
  );
}
