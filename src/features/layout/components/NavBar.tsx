import { ReactNode } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  ButtonGroup,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";

const links = [
  // {
  //   to: "/users",
  //   name: "Users",
  // },
  {
    to: "/projects",
    name: "Projects",
  },
];

type linkObj = {
  to: string;
  name?: string;
  children?: ReactNode;
};
const NavLink = ({ to, name, children }: linkObj) => (
  <Link
    px={0}
    py={0}
    h="max-content"
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={to}
  >
    {children}
  </Link>
);

export default function Navbar() {
  const { data: sessionData } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {links.map((link) => (
                <NavLink key={link.name} name={link.name} to={link.to}>
                  <Button variant={"ghost"}>{link.name}</Button>
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            {!sessionData && (
              <Button onClick={() => void signIn()}>Login</Button>
            )}
            {sessionData && (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    src={sessionData?.user?.image!}
                    name={sessionData?.user?.name!}
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem>Link 3</MenuItem>
                  <NavLink to="/me" name="perfil">
                    <MenuItem>Mi perfil</MenuItem>
                  </NavLink>
                  <MenuDivider />
                  <MenuItem onClick={() => void signOut()}>
                    <ButtonGroup>Cerrar sesión 🙋‍♂️</ButtonGroup>
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {links.map((link) => (
                <NavLink key={link.name} name={link.name} to={link.to} />
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
