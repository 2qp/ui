"use client";

import { RHFSlider } from "@/components/rhf/rhf-slider";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const RADIO_OPTIONS = [
  { label: "7 days", value: "7" },
  { label: "14 days", value: "14" },
  { label: "1 month", value: "30" },
  { label: "2 months", value: "60" },
] as const;

const DURATION_VALUES = RADIO_OPTIONS.map((type) => type.value) as [
  (typeof RADIO_OPTIONS)[number]["value"],
];

const formSchema = z.object({
  slider: z.array(z.number(), { message: " slider err" }),
});

export const Component = () => {
  //

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      slider: [4],
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) =>
    toast(JSON.stringify(data, null, 2));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/*  */}
        <RHFSlider
          control={form.control}
          name="slider"
          label="Name"
          description="something..."
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
