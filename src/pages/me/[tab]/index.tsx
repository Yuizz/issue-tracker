import React, { type ReactElement, useEffect } from "react";
import type { NextPageWithLayout } from "../../_app";
import MeLayout from "../layout";
import { ProjectsView } from "~/features";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Tab, Tabs } from "@nextui-org/react";
import { IoLibrary } from "react-icons/io5";
import { TbLayoutDashboardFilled } from "react-icons/tb";

export function getServerSideProps(
  context: GetServerSidePropsContext<{ tab: string }>
) {
  const tab = context.params?.tab as string;

  return {
    props: {
      tab,
    },
  };
}

const UserView: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ tab }) => {
  const { data: sessionData } = useSession();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { replace } = useRouter();
  if (!tab) tab = "overview";

  if (!sessionData) return null;
  return (
    <div className="flex p-[1rem] flex-col">
      <Tabs
        aria-label="User tabs"
        selectedKey={tab}
        onSelectionChange={(key) => replace(`/me/${key}`)}
        color="primary"
      >
        <Tab key="overview" title={
          <div className="flex items-center space-x-2">
            <TbLayoutDashboardFilled />
            <span>Overview</span>
          </div>
        }>
          This is overview tab
        </Tab>
        <Tab key="projects" title={
          <div className="flex items-center space-x-2">
            <IoLibrary />
            <span>Projects</span>
          </div>
        }>
          <ProjectsView userId={sessionData.user.id} />
        </Tab>
      </Tabs>
    </div>
  );
};

UserView.getLayout = function getLayout(page: ReactElement) {
  return <MeLayout>{page}</MeLayout>;
};

export default UserView;
