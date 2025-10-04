import { ThemeProvider } from "next-themes";

import type { JSX, ReactNode } from "react";

type NextThemesProviderProps = {
  children: ReactNode;
};

type NextThemesProviderType = (props: NextThemesProviderProps) => JSX.Element;

const NextThemesProvider: NextThemesProviderType = ({ children }) => {
  //
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      {children}
    </ThemeProvider>
  );
};

export { NextThemesProvider };
export type { NextThemesProviderProps, NextThemesProviderType };
