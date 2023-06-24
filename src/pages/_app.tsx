import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppProps, type AppType } from "next/app";
import { api } from "~/utils/api";
// import "~/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { MainLayout } from "~/features";

import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <MainLayout>{getLayout(<Component {...pageProps} />)}</MainLayout>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
