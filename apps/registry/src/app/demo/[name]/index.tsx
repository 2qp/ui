import type { ReactElement, ReactNode } from "react";

// blocks

// components
import { rhfcheckbox } from "@/app/demo/[name]/components/rhf-check-box";
import { rhfcombobox } from "@/app/demo/[name]/components/rhf-combo-box";
import { rhfradio } from "@/app/demo/[name]/components/rhf-radio";
import { rhfslider } from "@/app/demo/[name]/components/rhf-slider";
import { rhfswitch } from "@/app/demo/[name]/components/rhf-switch";
import { rhftextarea } from "@/app/demo/[name]/components/rhf-text-area";
import { rhftextfield } from "@/app/demo/[name]/components/rhf-text-field";

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
  "rhf-text-field-demo": rhftextfield,
  "rhf-text-area-demo": rhftextarea,
  "rhf-check-box-demo": rhfcheckbox,
  "rhf-switch-demo": rhfswitch,
  "rhf-radio-demo": rhfradio,
  "rhf-slider-demo": rhfslider,
  "rhf-combo-box-demo": rhfcombobox,

  // ui
};
