import type { ReactElement, ReactNode } from "react";

// blocks

// components
import { rhftextfield } from "@/app/demo/[name]/components/rhf-text-field";
import { rhftextarea } from "@/app/demo/[name]/components/rhf-text-area";

// ui

interface Demo {
  name: string; // this must match the `registry.json` name
  components?: {
    [name: string]: ReactNode | ReactElement;
  };
}

export const demos: { [name: string]: Demo } = {
  // blocks

  // components
  "rhf-text-field": rhftextfield,
  "rhf-text-area": rhftextarea,

  // ui
};
