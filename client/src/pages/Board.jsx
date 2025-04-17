import React, { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "@/redux/Slice/projectSlice";
import ProjectCard from "@/components/ProjectCard";

export default function Board() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, projects } = useSelector((state) => state.project);
  useEffect(() => {
    dispatch(fetchProjects(user.token));
  }, []);
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoaderCircle className="animate-spin size-10" />
      </div>
    );
  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">Projects</h1>
      </div>
      <div className="space-y-4">
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <div key={index}>
              <ProjectCard key={index} project={project} />
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-gray-500">No projects found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
