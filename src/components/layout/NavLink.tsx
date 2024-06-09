import Link from "next/link";
import { ReactNode } from "react";

export type linkObj = {
  href: string;
  name?: string;
  children?: ReactNode;
  width?: string;
};

export default function NavLink({ href, children }: linkObj): ReactNode {
  return (
    <Link href={href} color="foreground">
      {children}
    </Link>
  )
}