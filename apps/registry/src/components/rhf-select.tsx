"use client";

import { RHFSelect } from "@/components/rhf/rhf-select";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const SELECT_OPTIONS = [
  { label: "7 days", value: "7", id: "1" },
  { label: "14 days", value: "14", id: "2" },
  { label: "1 month", value: "30", id: "3" },
  { label: "2 months", value: "60", id: "4" },
] as const;

const SELECT_OPTIONS_GROUPS = [{ id: "1", label: "Durations", items: SELECT_OPTIONS }];

const DURATION_VALUES = SELECT_OPTIONS.map((type) => type.value) as [
  (typeof SELECT_OPTIONS)[number]["value"],
];

const formSchema = z.object({
  select: z.enum(DURATION_VALUES),
});

export const Component = () => {
  //

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      select: "14",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) =>
    toast(JSON.stringify(data, null, 2));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/*  */}
        <RHFSelect
          control={form.control}
          name="select"
          label="Name"
          description="something..."
          data={SELECT_OPTIONS_GROUPS}
          safety={false}
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
