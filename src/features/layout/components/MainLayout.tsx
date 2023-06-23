import { Flex, Box } from "@chakra-ui/react";
import React from "react";
import Navbar from "./NavBar";

type Props = {
  children: string | React.ReactNode;
};

function MainLayout({ children }: Props) {
  return (
    <Flex flexDirection={"column"}>
      <Navbar />
      <Box w="100%">{children}</Box>
    </Flex>
  );
}

export default MainLayout;
