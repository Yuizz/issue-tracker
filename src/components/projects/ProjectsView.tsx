import { Spinner } from "@nextui-org/react";
import React from "react";
import { api } from "~/utils/api";
import ProjectCard from "./ProjectCard";

type Props = { userId: string };

function ProjectsView({ userId }: Props) {
  const userProjectsQuery = api.projects.getByUser.useQuery({ userId })
  if (userProjectsQuery.isLoading) return <Spinner />

  const data = userProjectsQuery.data
  return (
    <div className="grid grid-cols-responsive-300 w-full gap-3 pt-3">
      {data?.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

export default ProjectsView;
