import React, { ReactElement, useEffect } from "react";
import { NextPageWithLayout } from "../_app";
import MeLayout from "./layout";
import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { ProjectsView } from "~/features";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GetServerSideProps } from "next";

// const tabsIndex = {
//   projects: {
//     title: "Proyectos",
//     panel: <ProjectsView />,
//   },
// };

const UserView: NextPageWithLayout = () => {
  const { data: sessionData } = useSession();
  const { replace } = useRouter();

  useEffect(() => {
    if (!sessionData) {
      replace("/");
    }
  }, []);

  return (
    <Flex p="1rem">
      <Tabs w="full" colorScheme="orange" variant={"solid-rounded"}>
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Proyectos</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Overview</TabPanel>
          <TabPanel>
            <ProjectsView userId={sessionData?.user.id!} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

UserView.getLayout = function getLayout(page: ReactElement) {
  return <MeLayout>{page}</MeLayout>;
};

export default UserView;
