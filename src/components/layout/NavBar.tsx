import { signIn, useSession } from "next-auth/react";
import { Navbar as NextUINavbar, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, Button } from "@nextui-org/react";
import NavLink, { type linkObj } from "./NavLink";
import AvatarDropdown from "./AvatarDropdown";
import { useState } from "react";
import { LogIn } from "lucide-react";
import ColorModeButton from "~/components/theme/ColorModeButton";

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

        <NavbarContent as="div" justify="end">
          <ColorModeButton />
          {sessionData ? (
            <AvatarDropdown user={sessionData.user} />
          ) : (
            <NavbarItem>
              <Button onClick={() => void signIn()} variant="light" color="primary">Sign in <LogIn /></Button>
            </NavbarItem>
          )}
        </NavbarContent>
      </NextUINavbar>
    </>
  );
}
