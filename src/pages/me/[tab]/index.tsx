import React, { type ReactElement, useEffect } from "react";
import type { NextPageWithLayout } from "../../_app";
import MeLayout from "../layout";
import { ProjectsView } from "~/features";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

interface tabsIndexInterface {
  overview: number;
  projects: number;
}

const tabsIndex: tabsIndexInterface = {
  overview: 0,
  projects: 1,
};

export function getServerSideProps(
  context: GetServerSidePropsContext<{ tab: string }>
) {
  const tab = context.params?.tab as keyof tabsIndexInterface | undefined;

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
  const { replace } = useRouter();
  if (!tab) tab = "overview";

  useEffect(() => {
    replace(`/me/${tab as string}`)
  }, [tab, replace])

  return (
    <div className="flex p-[1rem]">
      <Tabs
        w="full"
        defaultIndex={tabsIndex[tab]}
        index={tabsIndex[tab]}
        onChange={(index) => {
          console.log(index);
          replace(`/me/${index === 0 ? "overview" : "projects"}`);
        }}
        colorScheme="orange"
        variant={"solid-rounded"}
      >
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Proyectos</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Overview</TabPanel>
          <TabPanel>
            <ProjectsView userId={sessionData?.user.id} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

UserView.getLayout = function getLayout(page: ReactElement) {
  return <MeLayout>{page}</MeLayout>;
};

export default UserView;
