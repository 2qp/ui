import type { ReactElement, ReactNode } from "react";

// blocks

// components
import { rhfcheckbox } from "@app/demo/[name]/components/rhf-check-box";
import { rhfcombobox } from "@app/demo/[name]/components/rhf-combo-box";
import { rhfdate } from "@app/demo/[name]/components/rhf-date";
import { rhfdatetime } from "@app/demo/[name]/components/rhf-date-time";
import { rhfotp } from "@app/demo/[name]/components/rhf-otp";
import { rhfphone } from "@app/demo/[name]/components/rhf-phone";
import { rhfradio } from "@app/demo/[name]/components/rhf-radio";
import { rhfselect } from "@app/demo/[name]/components/rhf-select";
import { rhfslider } from "@app/demo/[name]/components/rhf-slider";
import { rhfswitch } from "@app/demo/[name]/components/rhf-switch";
import { rhftextarea } from "@app/demo/[name]/components/rhf-text-area";
import { rhftextfield } from "@app/demo/[name]/components/rhf-text-field";
import { rhftime } from "@app/demo/[name]/components/rhf-time";

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
  "rhf-phone-demo": rhfphone,
  "rhf-date-demo": rhfdate,
  "rhf-time-demo": rhftime,
  "rhf-date-time-demo": rhfdatetime,
  "rhf-select-demo": rhfselect,
  "rhf-otp-demo": rhfotp,

  // ui
} as const;

type DemoName = keyof typeof demos; // { [name: string]: Demo } this overriding literals

const getDemoComponents = (name: DemoName | (string & {})) => {
  const demo = demos[name as DemoName];
  return demo?.components || {};
};

export { getDemoComponents };
