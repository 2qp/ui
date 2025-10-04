"use client";

import { NextThemesProvider } from "./next-themes-provider";

import type { JSX, ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

type ProvidersType = (props: ProvidersProps) => JSX.Element;

const Providers: ProvidersType = ({ children }) => {
  return <NextThemesProvider>{children}</NextThemesProvider>;
};

export { Providers };
export type { ProvidersProps, ProvidersType };
