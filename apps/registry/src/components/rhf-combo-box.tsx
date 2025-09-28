"use client";

import { RHFComboBox } from "@/components/rhf/rhf-combo-box";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const RADIO_OPTIONS = [
  { label: "7 days", value: "7", id: "1" },
  { label: "14 days", value: "14", id: "2" },
  { label: "1 month", value: "30", id: "3" },
  { label: "2 months", value: "60", id: "4" },
] as const;

const COMBO_OPTIONS = [{ id: "1", label: "", items: RADIO_OPTIONS }];

const DURATION_VALUES = RADIO_OPTIONS.map((type) => type.value) as [
  (typeof RADIO_OPTIONS)[number]["value"],
];

const formSchema = z.object({
  combo: z.enum(DURATION_VALUES),
});

export const Component = () => {
  //

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      combo: "14",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) =>
    toast(JSON.stringify(data, null, 2));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/*  */}
        <RHFComboBox
          control={form.control}
          name="combo"
          label="Name"
          description="something..."
          data={COMBO_OPTIONS}
          safety={false}
          precompute={true}
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
