import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import MeLayout from "./layout";
import { Flex } from "@chakra-ui/react";

const UserView: NextPageWithLayout = () => {
  return <Flex p="1rem">me page</Flex>;
};

UserView.getLayout = function getLayout(page: ReactElement) {
  return <MeLayout>{page}</MeLayout>;
};

export default UserView;
