import { signOut } from "next-auth/react";
import type { Session } from "next-auth"
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface AvatarDropdownProps {
  user: Session["user"]
}
export default function AvatarDropdown({ user }: AvatarDropdownProps) {
  const router = useRouter()

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
        <DropdownItem key="profile" showDivider className="h-14 gap-2" onClick={() => router.replace("/me")}>
          <User
            name={user.name ?? ""}
            description={user.email ?? ""}
            avatarProps={{
              src: user.image ?? "",
            }}
          />
        </DropdownItem>

        <DropdownItem key="see profile" onClick={() => router.replace("/me/overview")}>
          Profile
        </DropdownItem>
        <DropdownItem key="see projects" onClick={() => router.replace("/me/projects")}>
          Projects
        </DropdownItem>
        <DropdownItem key="settings" onClick={() => router.replace("/settings")}>
          Settings
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onClick={() => void signOut({ callbackUrl: "/", redirect: true })}>
          <div className="flex items-center space-x-2 gap-4">
            <LogOut />
            Log Out
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}