import { Box, Button, Flex, Heading, Input } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { api } from "~/utils/api";

function add() {
  const [isFetching, setIsFetching] = useState(false);
  const { push } = useRouter();
  const mutationProjects = api.projects.create.useMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFetching(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name")?.toString() || "",
    };

    const newProject = await mutationProjects.mutate(data);
    setIsFetching(false);
    push("/me");
  };

  return (
    <Box py="1rem" px="3rem">
      <form onSubmit={onSubmit}>
        <Flex flexDir="column" gap="1rem">
          <Heading size="md">Agregar proyecto</Heading>
          <Input name="name" required />
          <Button
            type="submit"
            colorScheme="green"
            w="max-content"
            isLoading={isFetching}
            loadingText="Creando proyecto"
          >
            Submit
          </Button>
        </Flex>
      </form>
    </Box>
  );
}

export default add;
