import { signOut } from "next-auth/react";
import type { Session } from "next-auth"
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, NavbarContent } from "@nextui-org/react";
import NavLink from "./NavLink";

interface AvatarDropdownProps {
  user: Session["user"]
}
export default function AvatarDropdown({ user }: AvatarDropdownProps) {

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          name={user.name ?? ""}
          size="sm"
          src={user.image ?? ""}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{user.email ?? ""}</p>
        </DropdownItem>
        <DropdownItem key="profile">
          <NavLink href="/me">Profile</NavLink>
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onClick={() => void signOut()}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}