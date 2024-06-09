import { Spinner } from "@nextui-org/react";
import React from "react";
import { api } from "~/utils/api";

type Props = { userId: string };

function ProjectsView({ userId }: Props) {
  const userProjectsQuery = api.users.getMe.useQuery()
  if (userProjectsQuery.isLoading) return <Spinner />

  const data = userProjectsQuery.data
  return (<div>
    {data?.map(project => (
      <div key={project.id}>
        <h1>{project.name}</h1>
        <p>{project.description}</p>
      </div>
    ))}
  </div>)
}

export default ProjectsView;
