"use client";

import { RHFOTP } from "@/components/rhf/rhf-otp";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const BYPASS_INTERNAL_STYLE = {
  styles: { inputOTPSlotClassName: "shadow-none" },
} as const;

const formSchema = z.object({
  otp: z.string(),
  otp_i: z.string(),
  otp_ii: z.string(),
});

export const Component = () => {
  //

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      otp: "",
      otp_i: "",
      otp_ii: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) =>
    toast(JSON.stringify(data, null, 2));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/*  */}

        <RHFOTP
          control={form.control}
          name="otp"
          label="Name"
          description="something..."
          {...BYPASS_INTERNAL_STYLE}
        />

        <RHFOTP
          control={form.control}
          name="otp_i"
          label="Name"
          description="something..."
          structure={[{ separator: false, slots: 4 }]}
          {...BYPASS_INTERNAL_STYLE}
        />

        <RHFOTP
          control={form.control}
          name="otp_ii"
          label="Name"
          description="something..."
          structure={[
            { separator: true, slots: 3 },
            { separator: false, slots: 3 },
          ]}
          {...BYPASS_INTERNAL_STYLE}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};
