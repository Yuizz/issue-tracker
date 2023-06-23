import React from "react";
import { api } from "~/utils/api";

function index() {
  const projects = api.projects.getAll.useQuery();
  console.log(projects);
  return <div>projects</div>;
}

export default index;
