import ShellLayout from "@app/demo/[name]/blocks/shell-layout";
import { Component } from "@/components/rhf-phone";

const rhfphone = {
  name: "rhf-phone",
  components: {
    Default: (
      <ShellLayout>
        <Component />
      </ShellLayout>
    ),
  },
};

export { rhfphone };
