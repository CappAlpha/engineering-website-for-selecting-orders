"use client";

import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { PropsWithChildren, type FC } from "react";
import { Toaster } from "react-hot-toast";

import StoreProvider from "@/app/StoreProvider";

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <SessionProvider>
        <StoreProvider>{children}</StoreProvider>
      </SessionProvider>
      <NextTopLoader
        color="#1b7fe3"
        shadow="0 0 10px #1b7fe3,0 0 5px #1b7fe3"
        showSpinner={false}
      />
      <Toaster
        toastOptions={{
          style: {
            background: "#454545",
            color: "#fff",
          },
        }}
      />
    </>
  );
};
