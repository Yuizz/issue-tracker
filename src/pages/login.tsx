import {
  Flex,
  Box,
  Center,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { signIn, getProviders } from "next-auth/react";
import { GetInitial } from "next";
import Image from "next/image";

export async function getInitialProps(context: GetServerSideProps<{}>) {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}

export default function LoginView() {
  console.log(getProviders());
  const providers = getProviders();
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          {Object.values(providers).map((provider) => (
            <Button
              onClick={() => void signIn(provider.id)}
              w={"full"}
              variant={"outline"}
              // leftIcon={
              //   // <Image
              //   //   src={"/static/images/icon-google.svg"}
              //   //   alt="icono google"
              //   //   width="48px"
              //   //   height={"auto"}
              //   // />
              // }
            >
              <Center>
                <Text>Sign in with {provider.name}</Text>
              </Center>
            </Button>
          ))}
        </Box>
      </Stack>
    </Flex>
  );
}
