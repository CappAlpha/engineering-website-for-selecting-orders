"use client";
import { makeStore, AppStore } from "../store/store";
import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";

export default function StoreProvider({ children }: Readonly<{ children: ReactNode }>) {
  const storeRef = useRef<AppStore | null>(null);

  return <Provider store={storeRef.current ?? makeStore()}>{children}</Provider>;
}
