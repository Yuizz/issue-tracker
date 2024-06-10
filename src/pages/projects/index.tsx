import React from "react";
import ProjectCard from "~/components/projects/ProjectCard";
import { api } from "~/utils/api";

function index() {
  const projectsQuery = api.projects.getAllPublic.useQuery();
  const projects = projectsQuery.data;
  return (

    <div className="grid grid-cols-responsive-300 w-full gap-3 pt-3 px-8">
      {projects?.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

export default index;
