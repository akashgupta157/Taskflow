import { z } from "zod";
import { toast } from "sonner";
import { Button } from "./ui/button";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CircleCheckBig, LogOut, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { logout } from "@/redux/Slice/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { createProject } from "@/redux/Slice/projectSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "react-router";

const formSchema = z.object({
  projectName: z.string().min(1, { message: "Project name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

function getColorForLetter(letter) {
  const code = letter.charCodeAt(0);
  const hue = (code * 100) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const initial = user.name?.charAt(0).toUpperCase();
  const bgColor = getColorForLetter(initial);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      description: "",
    },
  });

  function onSubmit(values) {
    dispatch(
      createProject({
        projectDetails: {
          name: values.projectName,
          description: values.description,
        },
        token: user.token,
      })
    );
    toast.success("Project created successfully", {
      icon: <CircleCheckBig />,
      style: {
        backgroundColor: "#4caf50",
        color: "#fff",
      },
    });
    setOpen(false);
  }

  return (
    <div className="flex items-center justify-between p-4 bg-zinc-800 shadow text-white">
      <h1
        className="text-3xl font-bold font-mono cursor-pointer"
        onClick={() => navigate("/board")}
      >
        Taskflow
      </h1>
      <div className="flex items-center gap-5">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-transparent hover:bg-zinc-700 text-white border border-white">
              <Plus />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Project Details</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Project Name" {...field} />
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
                        <Input placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="mt-4 bg-blue-500 hover:bg-blue-600"
                >
                  Create Project
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <div className="flex items-center gap-2">
          <p
            className="w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold text-lg"
            style={{ backgroundColor: bgColor }}
          >
            {initial}
          </p>
          <p>{user.name}</p>
        </div>
        <Button className="bg-red-500 hover:bg-red-600" onClick={handleLogout}>
          <LogOut /> Logout
        </Button>
      </div>
    </div>
  );
}
