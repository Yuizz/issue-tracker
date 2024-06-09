import { Avatar } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function MeLayout({ children }: Props) {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex md:flex-col items-center gap-4 p-6 w-full md:w-1/4 xl:w-1/5 bg-white shadow-lg md:h-screen">
        <Avatar
          className="w-30 h-30 text-large"
          src={sessionData?.user?.image ?? ""}
          name={sessionData?.user?.name ?? "User"}
        />
        <div>
          <p className="text-3xl font-bold align-middle">
            {sessionData?.user?.name}
          </p>
          <p className="text-xl align-middle">
            {sessionData?.user?.email}
          </p>
        </div>
      </div>
      <div className="flex w-full">{children}</div>
    </div>
  );
}
