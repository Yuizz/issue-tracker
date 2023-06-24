import { Button, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { api } from "~/utils/api";

function add() {
  const [name, setName] = useState("");
  const mutationProjects = api.projects.create.useMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.currentTarget);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
    };

    console.log(data);

    // const newProject = await mutationProjects.mutate({ name });
    // console.log(newProject);
  };

  return (
    <form onSubmit={onSubmit}>
      <Input
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}

export default add;
