import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps, AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { MainLayout } from "~/features";

import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import { NextUIProvider } from "@nextui-org/react";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider>
      <NextUIProvider>
        <MainLayout>{getLayout(<Component {...pageProps} />)}</MainLayout>
      </NextUIProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
