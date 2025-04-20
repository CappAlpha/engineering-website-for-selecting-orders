"use client";

import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";

import { makeStore, AppStore } from "../shared/store/store";

export default function StoreProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const storeRef = useRef<AppStore | null>(null);

  return (
    <Provider store={storeRef.current ?? makeStore()}>{children}</Provider>
  );
}
