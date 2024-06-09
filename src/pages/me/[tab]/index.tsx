import React, { type ReactElement } from "react";
import type { NextPageWithLayout } from "../../_app";
import MeLayout from "../layout";
import { ProjectsView } from "~/components";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Tab, Tabs } from "@nextui-org/react";
import ProjectFormModal from "~/components/projects/ProjectFormModal";
import { LayoutDashboard, Library } from "lucide-react";

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
    <div className="flex p-[1rem] flex-col w-full">
      <Tabs
        size="lg"
        aria-label="User tabs"
        selectedKey={tab}
        onSelectionChange={(key) => replace(`/me/${key}`)}
        color="primary"
      >
        <Tab key="overview" title={
          <div className="flex items-center space-x-2">
            <LayoutDashboard />
            <span>Overview</span>
          </div>
        }>
          This is overview tab
        </Tab>
        <Tab key="projects" title={
          <div className="flex items-center space-x-2">
            <Library />
            <span>Projects</span>
          </div>
        }>
          <div className="flex justify-end">
            <ProjectFormModal />
          </div>
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
