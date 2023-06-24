import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function MeLayout({ children }: Props) {
  const { data: sessionData } = useSession();

  return (
    <Flex>
      <Flex
        boxShadow={"lg"}
        h="100vh"
        p="1.5rem"
        w={{
          base: "100%",
          md: "30%",
          xl: "20%",
        }}
        flexDir={"column"}
        alignItems={"center"}
        gap="1rem"
      >
        <Avatar
          size={"2xl"}
          src={sessionData?.user?.image!}
          name={sessionData?.user?.name!}
        />
        <Box>
          <Text fontSize="3xl" fontWeight={"bold"} textAlign={"center"}>
            {sessionData?.user?.name}
          </Text>
          <Text fontSize="xl" textAlign={"center"}>
            {sessionData?.user?.email}
          </Text>
        </Box>
      </Flex>
      {children}
    </Flex>
  );
}
