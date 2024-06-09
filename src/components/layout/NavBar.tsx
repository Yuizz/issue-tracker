import { signIn, useSession } from "next-auth/react";
import { Navbar as NextUINavbar, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, Button } from "@nextui-org/react";
import NavLink, { type linkObj } from "./NavLink";
import AvatarDropdown from "./AvatarDropdown";
import { useState } from "react";
import { MdLogin } from "react-icons/md";

const links: linkObj[] = [
  {
    href: "/",
    name: "Home",

  },
  {
    href: "/projects",
    name: "Projects",
  },
];

export default function Navbar() {
  const [isMenuOpen, updateMenuState] = useState(false);
  const { data: sessionData } = useSession();

  return (
    <>
      <NextUINavbar onMenuOpenChange={updateMenuState}>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarMenu>
          {links.map((link) => (
            <NavbarItem key={link.name}>
              <NavLink href={link.href}>{link.name}</NavLink>
            </NavbarItem>
          ))}
        </NavbarMenu>


        <NavbarContent className="hidden sm:flex gap-4">
          {links.map((link) => (
            <NavbarItem key={link.name}>
              <NavLink href={link.href}>{link.name}</NavLink>
            </NavbarItem>
          ))}
        </NavbarContent>

        {sessionData ? (
          <NavbarContent as="div" justify="end">
            <AvatarDropdown user={sessionData.user} />
          </NavbarContent>
        ) : (
          <NavbarItem>
            <Button onClick={() => void signIn()} variant="light" color="primary">Sign in <MdLogin /></Button>
          </NavbarItem>
        )}
      </NextUINavbar>
    </>
  );
}
