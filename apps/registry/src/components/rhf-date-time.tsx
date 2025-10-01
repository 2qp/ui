"use client";

import { RHFDateTime } from "@/components/rhf/rhf-date-time";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const sampleDate = new Date("2025-02-10T01:02:36");

const formSchema = z.object({
  date_time: z.date(),
  date_times: z.array(z.date()).optional(),
  date_times_range: z.object({ from: z.date(), to: z.date() }),
});

export const Component = () => {
  //

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {},
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) =>
    toast(JSON.stringify(data, null, 2));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/*  */}
        <RHFDateTime
          control={form.control}
          name="date_time"
          label="Date Time"
          mode="single"
        />

        <RHFDateTime
          control={form.control}
          name="date_times"
          label="Date Times"
          mode="multiple"
        />

        <RHFDateTime
          control={form.control}
          name="date_times_range"
          label="Date Time Range"
          mode="range"
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
