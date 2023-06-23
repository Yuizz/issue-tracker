import { Button, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { api } from "~/utils/api";

function add() {
  const [name, setName] = useState("");
  const mutationProjects = api.projects.create.useMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newProject = await mutationProjects.mutate({ name });
    console.log(newProject);
  };

  return (
    <form onSubmit={onSubmit}>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      <Button>Submit</Button>
    </form>
  );
}

export default add;
